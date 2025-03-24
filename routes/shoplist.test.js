process.env.NODE_ENV = "test";
const request = require("supertest");
const app = require("../app");
const items = require("../fakeDb");

let pickles = { name: "Pickles", price: 1.22 };

beforeEach(function () {
  items.push(pickles);
});

afterEach(function () {
  // make sure this *mutates*, not redefines, `cats`
  // one way to make the array from fakeDB empty
  items.length = 0;
});

describe("GET /shoplist", () => {
  test("Get all items in shopping list", async () => {
    const res = await request(app).get("/shoplist");
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ items: [pickles] });
  });

  test("Get invalid name responds with 404", async () => {
    const res = await request(app).get(`/shoplist/waffle`);
    expect(res.statusCode).toBe(404);
  });
});

describe("GET /shoplist/:name", () => {
  test("Get item by name", async () => {
    const res = await request(app).get(`/shoplist/${pickles.name}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ item: pickles });
  });
});

describe("POST /shoplist", () => {
  test("Creating a new item", async () => {
    const res = await request(app)
      .post("/shoplist")
      .send({ name: "Bubby", price: 2.22 });
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ item: { name: "Bubby", price: 2.22 } });
  });
  test("Respond with 404 if name is missing ", async () => {
    const res = await request(app).post(`/shoplist`).send({});
    expect(res.statusCode).toBe(400);
  });
  test("Respond with 404 if price is not number  ", async () => {
    const res = await request(app)
      .post(`/shoplist`)
      .send({ name: "Bubby", price: "Not a Number" });
    expect(res.statusCode).toBe(400);
  });
});

describe("PATCH /shoplist/:name", () => {
  test("Update Item's name", async () => {
    const res = await request(app)
      .patch(`/shoplist/${pickles.name}`)
      .send({ name: "Monster" }); // ✅ Fix: Only update 'name'

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({
      item: { name: "Monster", price: pickles.price },
    }); // ✅ Keep original price
  });

  test("Update Item's price", async () => {
    const res = await request(app)
      .patch(`/shoplist/${pickles.name}`)
      .send({ price: 5.4 });

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({
      item: { name: pickles.name, price: 5.4 },
    });
  });

  test("Respond with 404 if item does not exist", async () => {
    const res = await request(app)
      .patch("/shoplist/nonexistent-item")
      .send({ name: "NewName" });
    expect(res.statusCode).toBe(404);
  });
});

describe("DELETE  /shoplist/:name", () => {
  test("Delete a Shoplist's name", async () => {
    const res = await request(app).delete(`/shoplist/${pickles.name}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ message: "Deleted" });
  });
  test("Respond with 404 for deleting invalid name", async () => {
    const res = await request(app).delete(`/shoplist/buddy`);
    expect(res.statusCode).toBe(404);
  });
});
