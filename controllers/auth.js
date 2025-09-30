const { loginUser } = require("../models/auth");

const newError = require("../utils/newError");

exports.getLogin = (req, res, next) => {
  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    loggedIn: req.session.loggedIn,
  });
};

// ! real user authentication will be implemented during the next course
exports.postLogin = async (req, res, next) => {
  const user = await loginUser(); // * logs in using set userID credentials

  req.session.user = user;
  req.session.loggedIn = true;
  req.session.save((err) => {
    if (err) throw newError("Failed to log in", err);
    res.redirect("/");
  });
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
    loggedIn: req.session.loggedIn || false,
  });
};

exports.postSignup = async (req, res, next) => {};
