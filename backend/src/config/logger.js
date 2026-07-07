const pino = require("pino");

// One shared logger instance for the whole app, same reasoning as the
// shared Redis client — created once, reused everywhere, not
// re-instantiated per request.
const logger = pino({
  level: process.env.LOG_LEVEL || "info",
  formatters: {
    level: (label) => ({ level: label }), // log level as a string field, not a number
  },
  timestamp: pino.stdTimeFunctions.isoTime, // human-readable ISO timestamps, not epoch ms
});

module.exports = logger;