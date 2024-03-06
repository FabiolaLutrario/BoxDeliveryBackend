import supertest from "supertest";
import { app, server } from "../server";
import db from "../api/config/db.config";
import User from "../api/models/User.models";
import Package from "../api/models/Package.models";
import { DATEONLY } from "sequelize";
import { createToken } from "../api/config/tokens";

const api = supertest(app);
let createdPackage1Id: string;

beforeAll(async () => {
  try {
    await User.create({
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
    await Package.destroy({
      where: {
        id: createdPackage1Id,
      },
    });
    await User.destroy({
      where: {
        email: "usuario@example.com",
      },
    });
    await db.close();
    server.close();
  } catch (error) {
    console.error("Error cleaning up test data:", error);
  }
});

describe("Get /api/packages", () => {
  const adminToken = createToken({
    email: "admin@example.com",
    is_admin: true,
  });
  test("should respond with a 200 status code", async () => {
    const response = await api
      .get("/api/packages/")
      .set("Cookie", `authToken=${adminToken}`);
    expect(response.statusCode).toBe(200);
  });
});

describe("Post /api/packages/add-package", () => {
  const authToken = createToken({
    email: "user@example.com",
  });
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
      status: "ongoing",
      user_id: userId,
    };
    const response = await api
      .post("/api/packages/add-package")
      .set("Cookie", `authToken=${authToken}`)
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
      status: "ongoing",
      user_id: 2564515247845145,
    };
    const response = await api
      .post("/api/packages/add-package")
      .set("Cookie", `authToken=${authToken}`)
      .send(packageData);
    expect(response.statusCode).toBe(500);
  });
});

describe("Get /api/packages/single/:id", () => {
  const authToken = createToken({
    email: "user@example.com",
  });
  test("should respond with a 200 status code", async () => {
    const response = await api
      .get(`/api/packages/single/${createdPackage1Id}`)
      .set("Cookie", `authToken=${authToken}`);
    expect(response.statusCode).toBe(200);
  });
  test("should respond with a 404 status code", async () => {
    const packageId = "error";

    const response = await api
      .get(`/api/packages/single/${packageId}`)
      .set("Cookie", `authToken=${authToken}`);
    expect(response.statusCode).toBe(404);
  });
});

describe("Get /api/packages/:user_id/:status", () => {
  const authToken = createToken({
    email: "user@example.com",
  });
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
    const status = "ongoing";
    const response = await api
      .get(`/api/packages/${userId}/${status}`)
      .set("Cookie", `authToken=${authToken}`);
    expect(response.statusCode).toBe(200);
  });
  test("should respond with a 500 status code", async () => {
    const userId = 1541584854848484;
    const status = "error";
    const response = await api
      .get(`/api/packages/${userId}/${status}`)
      .set("Cookie", `authToken=${authToken}`);
    expect(response.statusCode).toBe(500);
  });
});
