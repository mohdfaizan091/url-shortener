// One-off script to seed short codes directly into MongoDB for load
// testing GET /:shortCode. Bypasses /shorten entirely — CP4's rate
// limiter would block repeated calls to that endpoint, and we're not
// testing URL creation here anyway, just redirect throughput.
require("dotenv").config({ path: "../.env" });
const mongoose = require("mongoose");
const Url = require("../src/models/url.model");

const SEED_COUNT = 20; // pool of short codes k6 will pick from randomly

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URL);

  const codes = [];
  for (let i = 0; i < SEED_COUNT; i++) {
    const code = `loadtest${i}`;
    await Url.findOneAndUpdate(
      { shortCode: code },
      { originalUrl: `https://example.com/loadtest-${i}`, shortCode: code },
      { upsert: true, returnDocument: "after" }
    );
    codes.push(code);
  }

  console.log("Seeded short codes:", codes.join(", "));
  await mongoose.disconnect();
};

seed();