const path = require("path");
const express = require("express");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const csrf = require("csurf");
require("dotenv").config();

const errorController = require("./controllers/error");

const { mongoConnect, getMongoDB_URI } = require("./src/db/database");

const attachUser = require("./middleware/attachUser");
const attachLocals = require("./middleware/attachLocals");

const MongoDB_URI = getMongoDB_URI();

const app = express();
const store = new MongoDBStore({
  uri: MongoDB_URI,
  collection: "sessions",
});
const csrfProtection = csrf();

app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");

const required = require("./utils/requireEnvVar");
const catchErrAsync = require("./utils/catchErrAsync");

app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use(cookieParser());
app.use(
  session({
    secret: required("SESSION_HASH"),
    resave: false,
    saveUninitialized: false,
    store,
    // cookie: {}
  })
);
app.use(csrfProtection);

app.use(catchErrAsync(attachUser)); // * attaches user found by User.findById(req.session.user._id) to req.user
app.use(attachLocals);

app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(errorController.get404);
app.use(errorController.getErrorPage);

// ^ setting up MongoDB connection
mongoConnect(() => {
  app.listen(3000);
});
