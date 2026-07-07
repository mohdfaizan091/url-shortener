const Redis = require("ioredis");

// One shared connection for the whole app, not one per request — Redis
// connections are meant to be long-lived and reused, unlike a typical
// HTTP request/response cycle.
const redisClient = new Redis(process.env.REDIS_URL || "redis://localhost:6379", {
  maxRetriesPerRequest: 1, // fail fast per command instead of retrying repeatedly
  retryStrategy: (times) => {
    if (times > 3) return null; // stop trying to reconnect after 3 attempts
    return Math.min(times * 100, 2000); // backoff: 100ms, 200ms, 300ms...
  },
});

redisClient.on("error", (err) => {
  // Redis being down should degrade performance, not crash the app —
  // this is why we log rather than throw. The redirect flow will fall
  // back to hitting Mongo directly if the cache is unreachable.
  console.error("Redis connection error:", err.message);
});

module.exports = redisClient;