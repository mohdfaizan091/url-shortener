const { MongoMemoryServer } = require("mongodb-memory-server");
const mongoose = require("mongoose");

let mongoServer;

// Called once before all tests in a file — boots an isolated,
// throwaway MongoDB instance and points Mongoose at it. This is why
// running tests never touches your real dev/prod database.
const connect = async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
};

// Called after all tests in a file — disconnects Mongoose and shuts
// down the in-memory instance so it doesn't leak between test files.
const closeDatabase = async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoServer.stop();
};

// Called between individual tests — wipes all collections so test
// order can't affect test outcomes (e.g. a leftover doc from test #1
// causing a false duplicate-key error in test #2).
const clearDatabase = async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany();
  }
};

module.exports = { connect, closeDatabase, clearDatabase };