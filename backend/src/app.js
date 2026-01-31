const express = require("express");
const app = express();
const cors = require("cors");

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
    cors({
        origin:"http://localhost:5173"
    })
);

const healthRoute = require("./routes/healthRoute");
app.use("/", healthRoute);

const urlRoute = require("./routes/url.route");
app.use("/", urlRoute);

module.exports = app;