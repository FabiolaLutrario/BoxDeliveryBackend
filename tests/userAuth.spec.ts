// import supertest from "supertest";
// import db from "../api/config/db.config";
// import app from "../server";
// import dotenv from "dotenv";
// dotenv.config({ path: ".env" });

// const api = supertest(app);

// beforeAll(async () => {
//   const res = await api.get("/health");
//   expect(res.status).toBe(200);
//   expect(res.text).toEqual("The server is up and healthy 😀");
// });

// beforeAll(async () => {
//   try {
//     await db.validate();
//     console.info(
//       "Connection to the database has been established successfully."
//     );
//   } catch (error) {
//     console.error("Unable to connect to the database:", error);
//   }
// });
// afterAll(async () => {
//   await api.delete("/api/users/delete/deliveryman").send({
//     email: "newuser@gmail.com",
//   });
//   await api.delete("/api/users/delete/deliveryman").send({
//     email: "notconfirmed@gmail.com",
//   });
//   await api.delete("/api/users/delete/deliveryman").send({
//     email: "confirmed@gmail.com",
//   });
// });

// describe("testing endpoints for register", () => {
//   beforeAll(async () => {
//     await api.delete("/api/users/delete/deliveryman").send({
//       email: "newuser@gmail.com",
//     });
//   });

//   test("should create a user", async () => {
//     const res = await api.post("/api/users/register").send({
//       email: "newuser@gmail.com",
//       name: "Benajamin",
//       last_name: "Peña",
//       password: "password",
//       is_admin: false,
//       is_confirmed: true,
//     });
//     expect(res.status).toBe(201);
//     expect(res.text).toEqual("Created!");
//   });

//   test("should return an error message if account already exists", async () => {
//     const res = await api.post("/api/users/register").send({
//       email: "newuser@gmail.com",
//       name: "Benjamin",
//       last_name: "Peña",
//       password: "password",
//       is_admin: false,
//       is_confirmed: true,
//     });
//     expect(res.status).toBe(500);
//     expect(res.text).toEqual(
//       "Error: Account already associated with this email"
//     );
//   });

//   test("should return an error because of missing properties", async () => {
//     const res = await api.post("/api/users/register").send({
//       email: "anotheruser@gmail.com",
//       // name: "Benito",
//       last_name: "Maltrera",
//       password: "password",
//       is_admin: false,
//       is_confirmed: true,
//     });
//     expect(res.status).toBe(500);
//   });
// });

// describe("testing endpoints for login", () => {
//   beforeAll(async () => {
//     await api.post("/api/users/register").send({
//       email: "notconfirmed@gmail.com",
//       name: "Manuela",
//       last_name: "Pedraza",
//       password: "password",
//       is_admin: false,
//       is_confirmed: false,
//     });
//     await api.post("/api/users/register").send({
//       email: "confirmed@gmail.com",
//       name: "Diego",
//       last_name: "Torres",
//       password: "password",
//       is_admin: false,
//       is_confirmed: true,
//     });
//   });

//   test("should not be allowed to log in with an incorrect user.", async () => {
//     const res = await api.post("/api/users/login").send({
//       email: "nonexistent@gmail.com",
//       password: "password",
//     });
//     expect(res.text).toBe("Error: No account associated with that email");
//   });

//   test("should return an error if password is incorrect", async () => {
//     const res = await api.post("/api/users/login").send({
//       email: "notconfirmed@gmail.com",
//       password: "wrongpassword",
//     });
//     expect(res.text).toBe("Error: Incorrect password, try again");
//   });

//   test("should return an error if account is not confirmed", async () => {
//     const res = await api.post("/api/users/login").send({
//       email: "notconfirmed@gmail.com",
//       password: "password",
//     });
//     expect(res.text).toBe(
//       "Error: Please confirm your account before trying to log in"
//     );
//   });
//   test("should login with everything in order", async () => {
//     const res = await api.post("/api/users/login").send({
//       email: "confirmed@gmail.com",
//       password: "password",
//     });
//     expect(res.text).toBe("You are now logged in!");
//     expect(res.headers["set-cookie"]).toBeDefined();
//   });
// });

// describe("testing logout endpoint", () => {
//   test("should return a status 200", async () => {
//     const res = await api.post("/api/users/logout");
//     expect(res.status).toBe(200);
//   });
// });
