const express = require("express");
const path = require("path");
const passport = require("passport");
const { Strategy } = require("passport-google-oauth20");
const cookieSession = require("cookie-session");
const { createError } = require("./utils");

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

// secret values
const config = {
  CLIENT_ID: process.env.CLIENT_ID,
  CLIENT_SECRET: process.env.CLIENT_SECRET,
  COOKIE_KEY_1: process.env.COOKIE_KEY_1,
  COOKIE_KEY_2: process.env.COOKIE_KEY_2,
};

// set session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// read session
passport.deserializeUser((id, done) => {
  done(null, id);
});

// auth options for passport strategy
const AUTH_OPTIONS = {
  callbackURL: "/auth/google/redirect",
  clientID: config.CLIENT_ID,
  clientSecret: config.CLIENT_SECRET,
};

// handling auth after user sign-in
function verifyCallback(accessToken, refreshToken, profile, done) {
  console.log("User profile", profile);
  done(null, profile);
}

// passport strategy for google auth
passport.use(new Strategy(AUTH_OPTIONS, verifyCallback));

const app = express();

// cookie-session config
const cookieOptions = {
  name: "userSession",
  maxAge: 24 * 60 * 60 * 1000,
  keys: [config.COOKIE_KEY_1, config.COOKIE_KEY_2],
};

app.use(cookieSession(cookieOptions));

// passport start
app.use(passport.initialize());

// passport know session
app.use(passport.session());

// static assets config
app.use(express.static(path.join(__dirname, "assets")));

// template engine config
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

// get user middlewra
app.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});

// check user log-in
const isLoggedIn = (req, res, next) => {
  const loggedIn = req.isAuthenticated() && req.user;
  if (!loggedIn) {
    return next(createError(400, "You are not authorized"));
  }
  next();
};

// for user redirect page
app.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["email"],
  })
);

// redirect_url after sign-in
app.get(
  "/auth/google/redirect",
  passport.authenticate("google", {
    failureRedirect: "/error",
    successRedirect: "/",
    session: true,
  }),
  (req, res) => {
    console.log("Google called us back!");
  }
);

// logout
app.get("/auth/logout", (req, res) => {
  req.logout();
  return res.redirect("/");
});

// auth failure endpoint
app.get("/error", (req, res, next) => {
  next(createError(500, "google authentication error occured"));
});

// secret page endpoint
app.get("/secret", isLoggedIn, (req, res) => {
  res.render("secret");
});

// render main page
app.get("/", (req, res) => {
  res.render("home", { title: "Home" });
});

// error middleware
app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || "Something went wrong";
  res.status(status).render("error", { status, message });
});

module.exports = app;
