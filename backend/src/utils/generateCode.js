const Counter = require("../models/counter.model");
const { toBase62 } = require("./base62");

// Atomically increments the single shared counter and returns the new
// value. upsert: true means: if the counter document doesn't exist yet
// (first ever call), create it starting from seq: 1 instead of erroring.
// This is the same $inc atomicity pattern as the click-count fix in
// CP1 — two concurrent /shorten requests can't both read seq=5 and
// both get back 6. MongoDB guarantees each caller gets a distinct,
// sequential value.
const generateCode = async () => {
  const counter = await Counter.findOneAndUpdate(
    { _id: "shortCodeCounter" },
    { $inc: { seq: 1 } },
    { returnDocument: "after", upsert: true }
  );

  return toBase62(counter.seq);
};

module.exports = generateCode;