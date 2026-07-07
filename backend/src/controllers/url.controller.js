const Url = require("../models/url.model");
const generateCode = require("../utils/generateCode");
const redisClient = require("../config/redis");
// url validation function

const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

//-------------
// genearate a short code for the URL
exports.shortenUrl = async (req, res) => {
 try {
        const { originalUrl } = req.body;

        if (!originalUrl) {
            return res.status(400).json({ message: "Original URL required" });
        }

        if (!isValidUrl(originalUrl)) {
            return res.status(400).json({ message: "Invalid URL" });
        }

        //check that url exist already
        const existingUrl = await Url.findOne({ originalUrl });
        if(existingUrl) {
            return res.json({
                shortUrl: `${req.protocol}://${req.get("host")}/${existingUrl.shortCode}`,
                message: "URL already shortened",
            });
        }

        // No collision check needed — generateCode() pulls from an atomic.
        // counter, so every value is guaranteed unique by construction.
        const shortCode = await generateCode();
        const newUrl = new Url({
            originalUrl,
            shortCode,
        });
        await newUrl.save();

        res.status(201).json({
            shortUrl: `${req.protocol}://${req.get("host")}/${shortCode}`,
        });
    }   catch (error) {
        console.error("Error shortening URL:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

//----------




// redirect to the original URL
const CACHE_TTL_SECONDS = 60 * 60; // 1 hour default for URLs with no explicit expiry

exports.redirectUrl = async (req, res) => {
  const { shortCode } = req.params;
  const cacheKey = `shortUrl:${shortCode}`;

  let cached = null;
  try {
    cached = await redisClient.get(cacheKey);
  } catch (err) {
    // Redis unreachable — don't fail the request, just skip the cache
    // and fall through to Mongo like the cache never existed.
    console.error("Redis GET failed, falling back to DB:", err.message);
  }

  let originalUrl, expiresAt;

  if (cached) {
    // Cache HIT — skip Mongo entirely.
    ({ originalUrl, expiresAt } = JSON.parse(cached));
  } else {
    // Cache MISS — this is the expensive path, same as before CP3.
    const url = await Url.findOne({ shortCode });

    if (!url) {
      return res.status(404).json({ message: "URL not found" });
    }
    if (url.expiresAt && url.expiresAt < new Date()) {
      return res.status(410).json({ message: "URL expired" });
    }

    originalUrl = url.originalUrl;
    expiresAt = url.expiresAt;

    // Populate the cache so the NEXT request for this shortCode is a hit.
    const ttl = expiresAt
      ? Math.max(1, Math.floor((new Date(expiresAt) - Date.now()) / 1000))
      : CACHE_TTL_SECONDS;

    try {
      await redisClient.set(
        cacheKey,
        JSON.stringify({ originalUrl, expiresAt }),
        "EX",
        ttl
      );
    } catch (err) {
      // Failing to populate the cache isn't fatal — worst case, the
      // next request is also a cache miss. Log and move on.
      console.error("Redis SET failed:", err.message);
    }
  }

  // On a cache HIT we still need the expiry check — the cached TTL
  // roughly aligns with expiresAt, but Redis TTL eviction isn't
  // millisecond-precise, so this is a cheap belt-and-suspenders check.
  if (expiresAt && new Date(expiresAt) < new Date()) {
    return res.status(410).json({ message: "URL expired" });
  }

  res.redirect(originalUrl);

  Url.findOneAndUpdate({ shortCode }, { $inc: { clickCount: 1 } }).catch((err) => {
    console.error(`Click count update failed for ${shortCode}:`, err);
  });
};

//---------------

// get analytics for a short URL
exports.getAnalytics = async (req, res) => {
    const { shortCode } = req.params;

    const url = await Url.findOne({ shortCode });
    if(!url){
        return res.status(404).json({
            status: false,
            message: "URL Not Found"
        });
    }

    res.json({
        originalUrl: url.originalUrl,
        shortCode: url.shortCode,
        clickCount: url.clickCount,
        createdAt: url.createdAt,
    });
};