import request from "supertest";
import app from "../server";
import { DATEONLY } from "sequelize";

beforeAll(async () => {
  await request(app).post("/api/users/register").send({
    email: "usuario@example.com",
    name: "Marcos",
    last_name: "Pérez",
    password: "password",
    is_admin: false,
    is_confirmed: true,
  });
});

afterAll(async () => {
  await request(app).delete("/api/users/delete/deliveryman").send({
    email: "usuario@example.com",
  });

  //await request(app).delete(`/api/packages/#AX102`);

  //await request(app).delete(`/api/packages/#AX105`);
});

describe("Get /api/packages", () => {
  test("should respond with a 200 status code", async () => {
    const response = await request(app).get("/api/packages");
    expect(response.statusCode).toBe(200);
  });
  test("should respond with a 404 status code if database connection fails", async () => {
    const response = await request(app).get("/api/error");
    expect(response.statusCode).toBe(404);
  });
});

describe("Post /api/packages/add-package", () => {
  test("should respond with a 201 status code", async () => {
    const packageData = {
      receiver_name: "Nombre del receptor",
      date: new DATEONLY(),
      weight: "45",
      address: "Dirección de entrega",
      status: "in-progress",
      email_id: "usuario@example.com",
    };
    const response = await request(app)
      .post("/api/packages/add-package")
      .send(packageData);
    expect(response.status).toBe(201);
  });
  test("should respond with a 500 status code if there's an error adding the package", async () => {
    const packageData = {
      receiver_name: "Nombre del receptor",
      date: new DATEONLY(),
      weight: "Peso del paquete",
      address: "Dirección de entrega",
      status: "in-progress",
      email_id: "error@example.com",
    };
    const response = await request(app)
      .post("/api/packages/add-package")
      .send(packageData);
    expect(response.statusCode).toBe(500);
  });
});

/* describe("Get /api/packages/single/:id", () => {
  test("should respond with a 200 status code", async () => {
    const packageId = 9;
    const response = await request(app).get(
      `/api/packages/single/${packageId}`
    );
    expect(response.statusCode).toBe(200);
  });
  test("should respond with a 500 status code", async () => {
    const packageId = "error";
    const response = await request(app).get(
      `/api/packages/single/${packageId}`
    );
    expect(response.statusCode).toBe(500);
  });
}); */

describe("Get /api/packages/:user_id/:status", () => {
  test("should respond with a 200 status code", async () => {
    const userId = "exampleUserId";
    const status = "in-progress";
    const response = await request(app).get(
      `/api/packages/${userId}/${status}`
    );
    expect(response.statusCode).toBe(200);
  });
  test("should respond with a 500 status code", async () => {
    const userId = "exampleUserId";
    const status = "error";
    const response = await request(app).get(
      `/api/packages/${userId}/${status}`
    );
    expect(response.statusCode).toBe(500);
  });
});
