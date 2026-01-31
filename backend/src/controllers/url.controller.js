const Url = require("../models/url.model");
const generateCode = require("../utils/generateCode");

exports.shortenUrl = async (req, res) => {
 try {
        const { originalUrl } = req.body;
        if (!originalUrl) {
            return res.status(400).json({ message: "Original URL required" });
        }
        const shortCode = generateCode();
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

  if (!url) {
    return res.status(404).json({ message: "URL not found" });
  }

  url.clickCount += 1;
  await url.save();

  res.redirect(url.originalUrl);
};
