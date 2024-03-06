import supertest from "supertest";
import app from "../server";
import dotenv from "dotenv";
import db from "../api/config/db.config";
import User from "../api/models/User.models";
import { createToken } from "../api/config/tokens";
dotenv.config({ path: ".env" });

const api = supertest(app);

type user = {
  id: number;
  email: string;
  name: string;
  last_name: string;
  profile_photo: string;
  is_admin: boolean;
  token: string | null;
};

beforeAll(async () => {
  const res = await api.get("/health");
  expect(res.status).toBe(200);
  expect(res.text).toEqual("The server is up and healthy 😀");

  try {
    await User.create({
      email: "notconfirmed@gmail.com",
      name: "Manuela",
      last_name: "Pedraza",
      password: "password",
      is_confirmed: false,
    });
    await User.create({
      email: "confirmed@gmail.com",
      name: "Diego",
      last_name: "Torres",
      password: "password",
      is_confirmed: true,
    });
    await User.create({
      email: "userTest1@gmail.com",
      name: "userTest",
      last_name: "testing",
      password: "HelloWorld123",
    });
    await User.create({
      email: "userTest2@gmail.com",
      name: "userTest2",
      last_name: "testing2",
      password: "HelloWorld123",
    });
    await User.create({
      email: "userTest3@gmail.com",
      name: "userTest3",
      last_name: "testing3",
      password: "HelloWorld123",
      is_admin: true,
      is_confirmed: true,
    });
    /*     await api.post("/api/users/register").send({
      email: "notconfirmed@gmail.com",
      name: "Manuela",
      last_name: "Pedraza",
      password: "password",
      is_confirmed: false,
    });
    await api.post("/api/users/register").send({
      email: "confirmed@gmail.com",
      name: "Diego",
      last_name: "Torres",
      password: "password",
      is_confirmed: true,
    });
    await api.post("/api/users/register").send({
      email: "userTest1@gmail.com",
      name: "userTest",
      last_name: "testing",
      password: "HelloWorld123",
    });
    await api.post("/api/users/register").send({
      email: "userTest2@gmail.com",
      name: "userTest2",
      last_name: "testing2",
      password: "HelloWorld123",
    });
    await api.post("/api/users/register").send({
      email: "userTest3@gmail.com",
      name: "userTest3",
      last_name: "testing3",
      password: "HelloWorld123",
      is_admin: true,
      is_confirmed: true,
    }); */
  } catch (error) {
    console.error("Error setting up test data:", error);
  }
});

afterAll(async () => {
  const emailsToDelete = [
    "notconfirmed@gmail.com",
    "confirmed@gmail.com",
    "newuser@gmail.com",
    "userTest1@gmail.com",
    "userTest2@gmail.com",
    "userTest3@gmail.com",
  ];
  try {
    await User.destroy({
      where: {
        email: emailsToDelete,
      },
    });
    await db.close();
  } catch (error) {
    console.error("Error destroying test data:", error);
  }
});

describe("testing endpoint for register", () => {
  test("should create a user", async () => {
    const res = await api.post("/api/users/register").send({
      email: "newuser@gmail.com",
      name: "Benajamin",
      last_name: "Peña",
      password: "password",
    });
    expect(res.status).toBe(201);
  });

  test("should return an error message if account already exists", async () => {
    const res = await api.post("/api/users/register").send({
      email: "newuser@gmail.com",
      name: "Benjamin",
      last_name: "Peña",
      password: "password",
    });
    expect(res.status).toBe(500);
    expect(res.text).toEqual(
      "Error: Account already associated with this email"
    );
  });

  test("should return an error because of missing properties", async () => {
    const res = await api.post("/api/users/register").send({
      email: "anotheruser@gmail.com",
      // name: "Benito",
      last_name: "Maltrera",
      password: "password",
    });
    expect(res.status).toBe(500);
  });
});

describe("testing endpoint for login", () => {
  test("should not be allowed to log in with an incorrect user", async () => {
    const res = await api.post("/api/users/login").send({
      email: "nonexistent@gmail.com",
      password: "password",
    });
    expect(res.text).toBe("Error: No account associated with that email");
  });

  test("should return an error if password is incorrect", async () => {
    const res = await api.post("/api/users/login").send({
      email: "notconfirmed@gmail.com",
      password: "wrongpassword",
    });
    expect(res.text).toBe("Error: Incorrect password, try again");
  });

  test("should return an error if account is not confirmed", async () => {
    const res = await api.post("/api/users/login").send({
      email: "notconfirmed@gmail.com",
      password: "password",
    });
    expect(res.text).toBe(
      "Error: Please confirm your account before trying to log in"
    );
  });
  test("should login with everything in order", async () => {
    const res = await api.post("/api/users/login").send({
      email: "confirmed@gmail.com",
      password: "password",
    });
    expect(res.status).toBe(200);
    expect(res.headers["set-cookie"]).toBeDefined();
  });
});

describe("testing endpoint for confirm email after register user", () => {
  test("should return an error if the token is null", async () => {
    const res = await api.put("/api/users/confirm-email/:token").send();
    expect(res.status).toBe(401);
  });

  test("should return an error if the token is incorrect", async () => {
    const invalidToken = "unTokenIncorrecto";
    const res = await api
      .put(`/api/users/confirm-email/${invalidToken}`)
      .send();
    expect(res.status).toBe(401);
  });

  test("should successfully confirm the users's email", async () => {
    const response = await api.get(
      `/api/users/single-by-email/newuser@gmail.com`
    );
    const userResponse = response.body as user;
    const token: string | null = userResponse.token;
    const res = await api.put(`/api/users/confirm-email/${token}`);
    expect(res.status).toBe(200);
    expect(res.text).toBe("Usuario newuser@gmail.com confirmado");
  });
});

describe("testing logout endpoint", () => {
  test("should return a status 200", async () => {
    const res = await api.post("/api/users/logout");
    expect(res.status).toBe(204);
  });
});

describe("endpoint testing obtain delivery men users", () => {
  const adminToken = createToken({
    email: "admin@example.com",
    is_admin: true,
  });
  test("get delivery users", async () => {
    const res = await api
      .get("/api/users/deliverymen/")
      .set("Cookie", `authToken=${adminToken}`);
    expect(res.statusCode).toBe(200);
  });
});

describe("endpoint testing obtain single user", () => {
  const adminToken = createToken({
    email: "admin@example.com",
    is_admin: true,
  });
  test("get user", async () => {
    type user = {
      id: number;
      email: string;
      name: string;
      last_name: string;
      profile_photo: string;
      is_admin: boolean;
      token: string | null;
    };
    const getUserResponse = await api.get(
      `/api/users/single-by-email/userTest1@gmail.com`
    );
    const userResult = getUserResponse.body as user;
    const id: number | null = userResult.id;
    const res = await api
      .get(`/api/users/single/${id}`)
      .set("Cookie", `authToken=${adminToken}`);
    expect(res.statusCode).toBe(200);
  });
});

describe("testing user deletion", () => {
  const adminToken = createToken({
    email: "admin@example.com",
    is_admin: true,
  });

  test("delete delivery user", async () => {
    const res = await api
      .delete("/api/users/delete/deliveryman")
      .set("Cookie", `authToken=${adminToken}`)
      .send({
        email: "userTest1@gmail.com",
      });

    expect(res.status).toBe(200);
  });

  test("error when deleting an unregistered delivery driver", async () => {
    const adminToken = createToken({
      email: "admin@example.com",
      is_admin: true,
    });
    const res = await api
      .delete("/api/users/delete/deliveryman")
      .set("Cookie", `authToken=${adminToken}`)
      .send({
        email: "user@gmail.com",
      });

    expect(res.status).toBe(500);
  });

  test("delete admin user", async () => {
    const adminToken = createToken({
      email: "admin@example.com",
      is_admin: true,
    });
    const res = await api
      .delete("/api/users/delete/admin")
      .set("Cookie", `authToken=${adminToken}`)
      .send({
        email: "userTest3@gmail.com",
      });
    expect(res.status).toBe(200);
  });
});

describe("testing restore-password endpoint", () => {
  test("should return a status 200", async () => {
    const res = await api.put("/api/users/restore-password").send({
      email: "confirmed@gmail.com",
    });
    expect(res.status).toBe(200);
  });

  test("should return an error if the email is incorrect", async () => {
    const res = await api.put("/api/users/restore-password").send({
      email: "incorrectEmail@gmail.com",
    });
    expect(res.status).toBe(404);
  });
});

describe("testing validate-token to restore password", () => {
  test("should return a status 200", async () => {
    type user = {
      email: string;
      name: string;
      last_name: string;
      profile_photo: string;
      is_admin: boolean;
      token: string | null;
    };

    const response = await api.get(
      `/api/users/single-by-email/confirmed@gmail.com`
    );
    const userResponse = response.body as user;
    const token: string | null = userResponse.token;
    const res = await api.get(`/api/users/validate-token/${token}`);
    expect(res.status).toBe(200);
  });

  test("should return an error if the token is incorrect", async () => {
    const token = "invalid";
    const res = await api.get(`/api/users/validate-token/${token}`);
    expect(res.status).toBe(500);
  });
});

describe("testing overwrite-password endpoint", () => {
  test("should return a status 200", async () => {
    type user = {
      email: string;
      name: string;
      last_name: string;
      profile_photo: string;
      is_admin: boolean;
      token: string | null;
    };

    const response = await api.get(
      `/api/users/single-by-email/confirmed@gmail.com`
    );
    const userResponse = response.body as user;
    const token: string | null = userResponse.token;
    const res = await api
      .post(`/api/users/overwrite-password/${token}`)
      .send({ password: "112233" });
    expect(res.status).toBe(200);
  });

  test("should return an error if the token is incorrect", async () => {
    const token = "invalid";
    const res = await api
      .post(`/api/users/overwrite-password/${token}`)
      .send({ password: "112233" });
    expect(res.status).toBe(500);
  });
});
