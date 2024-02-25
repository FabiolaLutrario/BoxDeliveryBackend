import request from "supertest";
import app from "../server";

describe("Get /api/packages", () => {
  test("should respond with a 200 status code", async () => {
    const response = await request(app).get("/api/packages");
    expect(response.statusCode).toBe(200);
    console.info("Siiiiiiiiiiiii");
  });
});

// describe("Post /api/packages", () => {
//   test("should respond with a 201 status code", async () => {
//     const response = await request(app).post("/api/packages").send();
//     expect(response.statusCode).toBe(201);
//     console.info("Post");
//   });
// });
