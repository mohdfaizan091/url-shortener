const { MongoMemoryServer } = require("mongodb-memory-server");
const mongoose = require("mongoose");
const redisClient = require("../src/config/redis");

let mongoServer;

const connect = async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
};

const closeDatabase = async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoServer.stop();
  redisClient.removeAllListeners("error");
  await redisClient.quit();
};

const clearDatabase = async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany();
  }

  await redisClient.del("ratelimit:::1", "ratelimit:::ffff:127.0.0.1");

  // Also clear cache keys — otherwise leftover cached entries from a
  // prior test run (or manual testing against this same Redis
  // instance) could make a cache test pass or fail for the wrong
  // reason instead of testing what THIS run actually did.
  const cacheKeys = await redisClient.keys("shortUrl:*");
  if (cacheKeys.length > 0) {
    await redisClient.del(...cacheKeys);
  }
};

module.exports = { connect, closeDatabase, clearDatabase };