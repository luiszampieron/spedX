const express = require("express");
const consign = require("consign");
const bodyParser = require("body-parser");

const app = express();

app.set("view engine", "ejs");
app.set("views", "./src/views");

app.use(express.static("./src/assets"));
app.use(bodyParser.urlencoded({ extended: true }));

consign()
  .include("src/routes")
  .then("src/services")
  .then("src/controllers")
  .into(app);

module.exports = app;
