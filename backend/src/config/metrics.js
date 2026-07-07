const client = require("prom-client");

// Collects default Node.js process metrics for free — memory usage,
// CPU usage, event loop lag, active handles. Zero extra code needed
// for these; prom-client instruments the process automatically.
client.collectDefaultMetrics();

// Custom metric: total HTTP requests, broken down by method, route,
// and status code. A Counter only ever goes up — correct choice here
// since "total requests so far" should never decrease.
const httpRequestCounter = new client.Counter({
  name: "http_requests_total",
  help: "Total number of HTTP requests",
  labelNames: ["method", "route", "status_code"],
});

// Custom metric: how long requests take, as a Histogram — this is
// what lets you calculate percentiles (p95, p99) later, the same kind
// of number k6 gave us in CP7, but from real production traffic
// instead of a synthetic load test.
const httpRequestDuration = new client.Histogram({
  name: "http_request_duration_seconds",
  help: "HTTP request duration in seconds",
  labelNames: ["method", "route", "status_code"],
  buckets: [0.01, 0.05, 0.1, 0.5, 1, 2, 5], // matches realistic latency ranges for this app
});

module.exports = { client, httpRequestCounter, httpRequestDuration };