const express = require("express");
const consign = require("consign");
const bodyParser = require("body-parser");
const upload = require("express-fileupload");

const app = express();

app.set("view engine", "ejs");
app.set("views", "./src/views");

app.use(
  upload({
    useTempFiles: true,
  })
);
app.use(express.static("./src/assets"));

consign()
  .include("src/routes")
  .then("src/services")
  .then("src/controllers")
  .into(app);

module.exports = app;
