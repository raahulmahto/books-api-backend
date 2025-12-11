const request = require("supertest");
const app = require("../src/app");
const mongoose = require("mongoose");

describe("Auth API", () => {
  let token = null;

  const user = {
    name: "Test User",
    email: "test@example.com",
    password: "Password123!",
  };

  it("should register a new user", async () => {
    const res = await request(app)
      .post("/api/v1/auth/register")
      .send(user);

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.email).toBe(user.email);
  });

  it("should login and return access token", async () => {
    const res = await request(app)
      .post("/api/v1/auth/login")
      .send({
        email: user.email,
        password: user.password,
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.tokens.accessToken).toBeDefined();

    token = res.body.tokens.accessToken;
  });

  it("should allow access to protected route", async () => {
    const res = await request(app)
      .get("/api/v1/protected/profile")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });
});
