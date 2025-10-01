const { loginUser, singupUser } = require("../models/auth");

const newError = require("../utils/newError");

exports.getLogin = (req, res, next) => {
  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
  });
};

exports.postLogin = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await loginUser({ email, password });

  if (!user) return res.redirect("/login");
  else {
    req.session.user = user;
    req.session.loggedIn = true;
    req.session.save((err) => {
      if (err) throw newError("Failed to log in", err);
      res.redirect("/");
    });
  }
};

exports.postLogout = async (req, res, next) => {
  req.session.destroy((err) => {
    if (err) throw newError("Failed to logout", err);
    res.redirect("/");
  });
};

exports.getSignup = (req, res, next) => {
  res.render("auth/signup", {
    path: "/signup",
    pageTitle: "Signup",
  });
};

// ! VALIDATION will be implemented during course section S18 - Understanding Validation
exports.postSignup = async (req, res, next) => {
  const { email, password, confirmPassword } = req.body;
  const userExists = await singupUser({ email, password, confirmPassword });

  if (userExists === true) return res.redirect("/signup");
  return res.redirect("/");
};
