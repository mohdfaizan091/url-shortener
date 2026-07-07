const request = require("supertest");
const app = require("../src/app");
const Url = require("../src/models/url.model");
const { connect, closeDatabase, clearDatabase } = require("./setup");

beforeAll(async () => await connect());
afterEach(async () => await clearDatabase());
afterAll(async () => await closeDatabase());

describe("Rate Limiter", () => {
  test("allows requests within the rate limit", async () => {
    for (let i = 0; i < 5; i++) {
      const res = await request(app)
        .post("/shorten")
        .send({ originalUrl: `https://example.com/page-${i}` });

      expect(res.status).toBe(201);
    }
  });

  test("blocks the request once the limit is exceeded", async () => {
    // Spend all 5 tokens first.
    for (let i = 0; i < 5; i++) {
      const res = await request(app)
        .post("/shorten")
        .send({ originalUrl: `https://example.com/page-${i}` });

      expect(res.status).toBe(201);
    }

    // 6th request in the same window — bucket is empty, this MUST be 429.
    const blocked = await request(app)
      .post("/shorten")
      .send({ originalUrl: "https://example.com/page-six" });

    expect(blocked.status).toBe(429);
  });
});