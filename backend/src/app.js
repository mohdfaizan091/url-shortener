const express = require("express");
const app = express();
const crypto = require("crypto");
app.set("trust proxy", true);
const os = require("os");
const cors = require("cors");
const pinoHttp = require("pino-http");
const logger = require("./config/logger");
const { client, httpRequestCounter, httpRequestDuration } = require("./config/metrics");

//observility--To log the request and response details
app.use(
  pinoHttp({
    logger,
    genReqId: (req) => req.headers["x-request-id"] || crypto.randomUUID(),
    // Never log sensitive headers. Cookies can contain live session
    // tokens; Authorization headers can contain API keys/JWTs. Logging
    // these in plaintext is a real security risk — anyone with log
    // access could hijack a session or impersonate a request.
    redact: {
      paths: [
        "req.headers.cookie",
        "req.headers.authorization",
        "res.headers['set-cookie']",
      ],
      censor: "[REDACTED]",
    },
  })
);

//os--To check round robin algorith to assign the request to different containers in the cluster
app.use((req, res, next) => {
  res.set("X-Served-By", os.hostname());
  next();
});

//---

app.use((req, res, next) => {
  const start = process.hrtime();

  res.on("finish", () => {
    const [seconds, nanoseconds] = process.hrtime(start);
    const duration = seconds + nanoseconds / 1e9;
    // req.route?.path gives the route PATTERN (e.g. "/:shortCode"),
    // not the actual URL (e.g. "/abc123") — this matters a lot: if we
    // labeled by actual URL, every unique short code would create a
    // brand new metric series, and Prometheus's storage would grow
    // unbounded. Grouping by pattern keeps cardinality sane.
    const route = req.route?.path || "unknown";

    httpRequestCounter.inc({ method: req.method, route, status_code: res.statusCode });
    httpRequestDuration.observe({ method: req.method, route, status_code: res.statusCode }, duration);
  });

  next();
});

app.get("/metrics", async (req, res) => {
  res.set("Content-Type", client.register.contentType);
  res.end(await client.register.metrics());
});

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