const express = require("express");
const app = express();

const healthRoute = require("./routes/healthRoute");
app.use("/", healthRoute);

module.exports = app;