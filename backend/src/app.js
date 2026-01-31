const express = require("express");
const app = express();


// Middleware
app.use(express.json());


const healthRoute = require("./routes/healthRoute");
app.use("/", healthRoute);

const urlRoute = require("./routes/url.route");
app.use("/", urlRoute);

module.exports = app;