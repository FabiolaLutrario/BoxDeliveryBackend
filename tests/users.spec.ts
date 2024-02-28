import supertest from "supertest";
import app from "../server";
import dotenv from "dotenv";
import db from "../api/config/db.config";
import User from "../api/models/User.models";
dotenv.config({ path: ".env" });

const api = supertest(app);

beforeAll(async () => {
  const res = await api.get("/health");
  expect(res.status).toBe(200);
  expect(res.text).toEqual("The server is up and healthy 😀");

  try {
    await User.bulkCreate([
      {
        email: "userTest1@gmail.com",
        name: "userTest",
        last_name: "testing",
        password: "HelloWorld123",
      },
      {
        email: "userTest2@gmail.com",
        name: "userTest2",
        last_name: "testing2",
        password: "HelloWorld123",
      },
      {
        email: "userTest3@gmail.com",
        name: "userTest3",
        last_name: "testing3",
        password: "HelloWorld123",
        is_admin: true,
        is_confirmed: true,
      },
    ]);
  } catch (error) {
    console.error("Error setting up test data:", error);
  }
});

afterAll(async () => {
  try {
    await api.delete("/api/users/delete/deliveryman").send({
      email: "newuser@gmail.com",
    });
    await api.delete("/api/users/delete/deliveryman").send({
      email: "notconfirmed@gmail.com",
    });
    await api.delete("/api/users/delete/deliveryman").send({
      email: "confirmed@gmail.com",
    });
    await api.delete("/api/users/delete/deliveryman").send({
      email: "userTest1@gmail.com",
    });
    await api.delete("/api/users/delete/deliveryman").send({
      email: "userTest2@gmail.com",
    });
    await api.delete("/api/users/delete/admin").send({
      email: "userTest3@gmail.com",
    });
    await db.close();
  } catch (error) {
    console.error("Error setting up test data:", error);
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
  beforeAll(async () => {
    await api.post("/api/users/register").send({
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
  });

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
    expect(res.text).toBe("You are now logged in!");
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
    type user = {
      id: number;
      email: string;
      name: string;
      last_name: string;
      profile_photo: string;
      is_admin: boolean;
      token: string | null;
    };

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
    expect(res.status).toBe(200);
  });
});

describe("endpoint testing obtain delivery users", () => {
  test("get delivery users", async () => {
    const res = await api.get("/api/users/deliverymen/");
    expect(res.statusCode).toBe(200);
  });
});

describe("endpoint testing obtain single user", () => {
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
    const res = await api.get(`/api/users/single/${id}`);
    expect(res.statusCode).toBe(200);
  });
});

describe("testing user deletion", () => {
  test("delete delivery user", async () => {
    const res = await api.delete("/api/users/delete/deliveryman").send({
      email: "userTest1@gmail.com",
    });

    expect(res.status).toBe(200);
  });

  test("error when deleting an unregistered delivery driver", async () => {
    const res = await api.delete("/api/users/delete/deliveryman").send({
      email: "user@gmail.com",
    });

    expect(res.status).toBe(500);
  });

  test("delete admin user", async () => {
    const res = await api.delete("/api/users/delete/admin").send({
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
    expect(res.status).toBe(401);
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
