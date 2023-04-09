const express = require("express");
const path = require("path");

const app = express();

// static assets config
app.use(express.static(path.join(__dirname, "assets")));

// template engine config
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

// render main page
app.get("/", (req, res) => {
  res.render("home", { title: "Home" });
});

module.exports = app;
