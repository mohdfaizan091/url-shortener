const request = require("supertest");
const app = require("../src/app");
const Url = require("../src/models/url.model");
const { connect, closeDatabase, clearDatabase } = require("./setup");

beforeAll(async () => await connect());
afterEach(async () => await clearDatabase());
afterAll(async () => await closeDatabase());

describe("POST /shorten (shortenUrl)", () => {
  test("returns 201 and a shortUrl for a valid URL", async () => {
    const res = await request(app)
      .post("/shorten")
      .send({ originalUrl: "https://example.com/page-one" });

    expect(res.status).toBe(201);

    expect(res.body.shortUrl).toBeDefined();
  });

  test("different URLs get different shortCodes", async () => {
    const first = await request(app)
      .post("/shorten")
      .send({ originalUrl: "https://example.com/page-two" });

    const second = await request(app)
      .post("/shorten")
      .send({ originalUrl: "https://example.com/page-three" });

    const firstCode = first.body.shortUrl.split("/").pop();
    const secondCode = second.body.shortUrl.split("/").pop();

    expect(firstCode).not.toBe(secondCode);
  });
});