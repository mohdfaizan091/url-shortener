const fs = require("fs");
const path = require("path");
const redisClient = require("../config/redis");

// Load the Lua script once at startup, not on every request — reading
// from disk per-request would be wasteful, and ioredis lets us register
// a Lua script as a reusable "command" on the client.
const luaScript = fs.readFileSync(
  path.join(__dirname, "../utils/tokenBucket.lua"),
  "utf8"
);

// This registers a new method, redisClient.tokenBucket(...), backed by
// the Lua script. numberOfKeys: 1 tells Redis how many of the arguments
// we'll pass are KEYS vs ARGV — matches KEYS[1] in the script.
redisClient.defineCommand("tokenBucket", {
  numberOfKeys: 1,
  lua: luaScript,
});

const CAPACITY = 5;      // bucket holds max 5 tokens
const REFILL_RATE = 1;   // 1 token added back per second

const rateLimiter = async (req, res, next) => {
  // Forward-compatible key: use a logged-in user's ID if one exists on
  // the request, otherwise fall back to IP. req.user doesn't exist
  // anywhere in this codebase yet — this always falls back to IP for
  // now, but the moment auth is added later, this line doesn't change.
  const identifier = req.user?.id || req.ip;
  const key = `ratelimit:${identifier}`;

  try {
    const [allowed, remaining] = await redisClient.tokenBucket(
      key,
      CAPACITY,
      REFILL_RATE,
      Date.now()
    );

    res.set("X-RateLimit-Remaining", remaining);

    if (allowed === 0) {
      return res.status(429).json({
        message: "Too many requests. Please slow down.",
      });
    }

    next();
  } catch (err) {
    // Same philosophy as the cache: if Redis is down, the rate limiter
    // shouldn't take the whole app down with it. Fail open — let the
    // request through rather than blocking all traffic because of an
    // infrastructure hiccup. (Worth flagging: this is a real trade-off,
    // not a free win — see note below.)
    console.error("Rate limiter failed, allowing request through:", err.message);
    next();
  }
};

module.exports = rateLimiter;