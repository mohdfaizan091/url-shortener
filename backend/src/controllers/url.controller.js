const Url = require("../models/url.model");
const generateCode = require("../utils/generateCode");

const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};


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

        //handelling the collision
        let shortCode;
        let exists = true;
        while(exists) {
            shortCode = generateCode();
            exists = await Url.findOne({ shortCode });
        }

        const newUrl = new Url({
            originalUrl,
            shortCode,
        });
        await newUrl.save();
        res.status(201).json({
            shortUrl: `${req.protocol}://${req.get("host")}/${shortCode}`,
        });
    } catch (error) {
        console.error("Error shortening URL:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

exports.redirectUrl = async (req, res) => {
  const { shortCode } = req.params;
  const url = await Url.findOne({ shortCode });

  if (!url) return res.status(404).json({ message: "URL not found" });
  if (url.expiresAt && url.expiresAt < new Date()) {
    return res.status(410).json({ message: "URL expired" });
  }

  // Redirect immediately — the user should not wait on an analytics write.
  res.redirect(url.originalUrl);

  // Atomic, fire-and-forget click tracking, decoupled from the response.
  Url.findOneAndUpdate({ shortCode }, { $inc: { clickCount: 1 } }).catch((err) => {
    console.error(`Click count update failed for ${shortCode}:`, err);
  });
};


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