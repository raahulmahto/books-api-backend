const request = require("supertest");
const app = require("../src/app");

describe("Books API", () => {
  let token = null;
  let bookId = null;

  const testUser = {
    name: "Book Tester",
    email: "book@test.com",
    password: "Test1234!",
  };

  beforeAll(async () => {
    // register
    await request(app).post("/api/v1/auth/register").send(testUser);

    // login
    const res = await request(app)
      .post("/api/v1/auth/login")
      .send({
        email: testUser.email,
        password: testUser.password,
      });

    token = res.body.tokens.accessToken;
  });

  it("should create a book", async () => {
    const res = await request(app)
      .post("/api/v1/books")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Test Book",
        author: "Test Author",
        price: 199,
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    bookId = res.body.data._id;
  });

  it("should fetch list of books", async () => {
    const res = await request(app).get("/api/v1/books");

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it("should get a book by id", async () => {
    const res = await request(app).get(`/api/v1/books/${bookId}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it("should update the book", async () => {
    const res = await request(app)
      .put(`/api/v1/books/${bookId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "Updated Book Title" });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.title).toBe("Updated Book Title");
  });

  it("should soft delete the book", async () => {
    const res = await request(app)
      .delete(`/api/v1/books/${bookId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });
});
