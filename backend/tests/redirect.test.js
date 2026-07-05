const request = require("supertest");
const app = require("../src/app");
const Url = require("../src/models/url.model");
const { connect, closeDatabase, clearDatabase } = require("./setup");

beforeAll(async () => await connect());
afterEach(async () => await clearDatabase());
afterAll(async () => await closeDatabase());

// Small helper: clickCount is updated in the background (fire-and-forget),
// so the response may be sent before MongoDB finishes writing the update.
// Waiting a little before checking the database makes the test reliable.

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

describe("GET /:shortCode (redirectUrl)", () => {
  test("returns 404 for a shortCode that doesn't exist", async () => {
    const res = await request(app).get("/doesNotExist");
    expect(res.status).toBe(404);
  });

  test("returns 410 for an expired URL", async () => {
    await Url.create({
      originalUrl: "https://example.com/old",
      shortCode: "expired1",
      expiresAt: new Date(Date.now() - 1000 * 60), // 1 minute in the past
    });

    const res = await request(app).get("/expired1");
    expect(res.status).toBe(410);
  });

  test("redirects to the original URL for a valid shortCode", async () => {
    await Url.create({
      originalUrl: "https://example.com/valid",
      shortCode: "valid1",
    });

    const res = await request(app).get("/valid1");
    expect(res.status).toBe(302);
    expect(res.headers.location).toBe("https://example.com/valid");
  });

  test("increments clickCount after a redirect", async () => {
    await Url.create({
      originalUrl: "https://example.com/counted",
      shortCode: "counted1",
    });

    await request(app).get("/counted1");
    await wait(50); // let the fire-and-forget $inc finish

    const updated = await Url.findOne({ shortCode: "counted1" });
    expect(updated.clickCount).toBe(1);
  });

// This test verifies the CP1 fix. Before using $inc, multiple requests
// could read the same clickCount, increment it separately, and overwrite
// each other's updates, causing some clicks to be lost. Using MongoDB's
// atomic $inc ensures every request increments the counter correctly,
// even when many requests hit the same shortCode at the same time.

  test("does not lose clicks under concurrent requests (race condition check)", async () => {
    await Url.create({
      originalUrl: "https://example.com/race",
      shortCode: "race1",
    });

    const CONCURRENT_REQUESTS = 20;
    await Promise.all(
      Array.from({ length: CONCURRENT_REQUESTS }, () =>
        request(app).get("/race1")
      )
    );

    await wait(200); // wait for all background clickCount updates to complete

    const updated = await Url.findOne({ shortCode: "race1" });
    expect(updated.clickCount).toBe(CONCURRENT_REQUESTS);
  });
});