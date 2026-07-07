// tests/cache.test.js
const request = require("supertest");
const app = require("../src/app");
const Url = require("../src/models/url.model");
const { connect, closeDatabase, clearDatabase } = require("./setup");

beforeAll(async () => await connect());
afterEach(async () => await clearDatabase());
afterAll(async () => await closeDatabase());

describe("Redis cache-aside behavior", () => {
  test("second request for the same shortCode skips Mongo entirely", async () => {
    await Url.create({
      originalUrl: "https://example.com/cached-page",
      shortCode: "cacheme1",
    });

    // jest.spyOn wraps the real Url.findOne so we can observe calls to
    // it, while still letting it actually run (unlike jest.fn(), which
    // would replace it entirely and break the real DB read).
    const findOneSpy = jest.spyOn(Url, "findOne");

    const first = await request(app).get("/cacheme1");
    expect(first.status).toBe(302);
    expect(findOneSpy).toHaveBeenCalledTimes(1); // cache miss — hits Mongo

    const second = await request(app).get("/cacheme1");
    expect(second.status).toBe(302);
    expect(findOneSpy).toHaveBeenCalledTimes(1); // still 1 — cache HIT, no new Mongo call

    findOneSpy.mockRestore(); // always clean up spies so they don't leak into other tests
  });
});