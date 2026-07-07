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
};


module.exports = { connect, closeDatabase, clearDatabase };