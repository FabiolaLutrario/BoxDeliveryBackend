import supertest from "supertest";
import app from "../server";
import db from "../api/config/db.config";
import { DATEONLY } from "sequelize";

const api = supertest(app);
let createdPackage1Id: string;

beforeAll(async () => {
  try {
    await api.post("/api/users/register").send({
      email: "usuario@example.com",
      name: "Marcos",
      last_name: "Pérez",
      password: "password",
      is_confirmed: true,
    });
  } catch (error) {
    console.error("Error setting up test data:", error);
  }
});

afterAll(async () => {
  try {
    await api.delete("/api/users/delete/deliveryman").send({
      email: "usuario@example.com",
    });
    await api.delete(`/api/packages/package/${createdPackage1Id}`);
    await db.close();
  } catch (error) {
    console.error("Error cleaning up test data:", error);
  }
});

describe("Get /api/packages", () => {
  test("should respond with a 200 status code", async () => {
    const response = await api.get("/api/packages/");
    expect(response.statusCode).toBe(200);
  });
});

describe("Post /api/packages/add-package", () => {
  test("should respond with a 201 status code", async () => {
    type user = {
      id: number;
      email: string;
      name: string;
      last_name: string;
      profile_photo: string;
      is_admin: boolean;
      token: string | null;
    };
    const responseUser = await api.get(
      `/api/users/single-by-email/usuario@example.com`
    );
    const userResult = responseUser.body as user;
    const userId = userResult.id;

    const packageData = {
      receiver_name: "Nombre del receptor",
      date: new DATEONLY(),
      weight: 45,
      address: "Dirección de entrega",
      status: "in-progress",
      user_id: userId,
    };
    const response = await api
      .post("/api/packages/add-package")
      .send(packageData);
    expect(response.status).toBe(201);

    createdPackage1Id = response.body.id;
  });
  test("should respond with a 500 status code if there's an error adding the package", async () => {
    const packageData = {
      receiver_name: "Nombre del receptor",
      date: new DATEONLY(),
      weight: "Peso del paquete",
      address: "Dirección de entrega",
      status: "in-progress",
      user_id: 2564515247845145,
    };
    const response = await api
      .post("/api/packages/add-package")
      .send(packageData);
    expect(response.statusCode).toBe(500);
  });
});

/* describe("Get /api/packages/single/:id", () => {
  test("should respond with a 200 status code", async () => {
    const response = await api.get(
      `/api/packages/single/${createdPackage1Id}`
    );
    expect(response.statusCode).toBe(200);
  });
  test("should respond with a 404 status code", async () => {
    const packageId = "error";
    const response = await api.get(
      `/api/packages/single/${packageId}`
    );
    expect(response.statusCode).toBe(404);
  });
}); */

describe("Get /api/packages/:user_id/:status", () => {
  test("should respond with a 200 status code", async () => {
    type user = {
      id: number;
      email: string;
      name: string;
      last_name: string;
      profile_photo: string;
      is_admin: boolean;
      token: string | null;
    };
    const responseUser = await api.get(
      `/api/users/single-by-email/usuario@example.com`
    );
    const userResult = responseUser.body as user;
    const userId = userResult.id;
    const status = "in-progress";
    const response = await api.get(`/api/packages/${userId}/${status}`);
    expect(response.statusCode).toBe(200);
  });
  test("should respond with a 500 status code", async () => {
    const userId = 1541584854848484;
    const status = "error";
    const response = await api.get(`/api/packages/${userId}/${status}`);
    expect(response.statusCode).toBe(500);
  });
});
