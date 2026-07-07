-- KEYS[1] = the rate limit key (e.g. "ratelimit:1.2.3.4")
-- ARGV[1] = max tokens (bucket capacity)
-- ARGV[2] = refill rate (tokens added per second)
-- ARGV[3] = current timestamp (ms, passed in from Node — never trust
--           Redis server time alone across a cluster, but more
--           importantly this lets us test with a controlled clock)

local key = KEYS[1]
local capacity = tonumber(ARGV[1])
local refillRate = tonumber(ARGV[2])
local now = tonumber(ARGV[3])

local bucket = redis.call("HMGET", key, "tokens", "lastRefill")
local tokens = tonumber(bucket[1])
local lastRefill = tonumber(bucket[2])

-- First request ever for this key: start full.
if tokens == nil then
  tokens = capacity
  lastRefill = now
end

-- Refill based on elapsed time since last check.
local elapsedSeconds = (now - lastRefill) / 1000
local refillAmount = elapsedSeconds * refillRate
tokens = math.min(capacity, tokens + refillAmount)

local allowed = 0
if tokens >= 1 then
  tokens = tokens - 1
  allowed = 1
end

redis.call("HMSET", key, "tokens", tokens, "lastRefill", now)
redis.call("EXPIRE", key, 3600) -- cleanup: don't keep dead keys forever

return { allowed, math.floor(tokens) }