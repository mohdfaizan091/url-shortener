const mongoose = require("mongoose");

// A single document tracks the last used ID. 
// per something — just one global sequence for shortCode generation.
const counterSchema = new mongoose.Schema({
  _id: { type: String, required: true }, // e.g. "shortCodeCounter"
  seq: { type: Number, default: 0 },
});

module.exports = mongoose.model("Counter", counterSchema);