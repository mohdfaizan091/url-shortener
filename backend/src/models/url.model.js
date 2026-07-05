const mongoose = require("mongoose");

const urlSchema = new mongoose.Schema({
   originalUrl: {
   type: String,
   required: true,
   index: true, // speeds up the dedup lookup in shortenUrl (findOne({ originalUrl }))
  },
  shortCode: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  clickCount: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  expiresAt: {
    type: Date,
    default: null,
  }
  
});

module.exports = mongoose.model("Url", urlSchema);
