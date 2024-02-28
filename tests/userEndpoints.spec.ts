/* import supertest from "supertest";
import db from "../api/config/db.config";
import app from "../server";
import dotenv from "dotenv";
import User from "../api/models/User.models";

dotenv.config({ path: ".env" });

const api = supertest(app);

beforeAll(async () => {
  try {
    await db.validate();
    console.info(
      "Connection to the database has been established successfully."
    );
    await User.destroy({ where: {} }); // Limpiar la base de datos antes de insertar datos de prueba
    await User.bulkCreate([
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
        is_admin:true,
        is_confirmed:true
      }
    ]);
  } catch (error) {
    console.error("Error setting up test data:", error);
  }
});

describe("endpoint testing obtain delivery users", () => {

  test("get delivery users", async () => {
    const res = await api.get("/api/users/deliverymen/");
    expect(res.statusCode).toBe(200);
  });

  test("get delivery user", async () => {
    const res = await api.get("/api/users/deliveryman/1");
    expect(res.statusCode).toBe(200);
  });
});


describe("testing user deletion", ()=>{

test("delete delivery user",async () => {
  const res = await api.delete("/api/users/delete/deliveryman").send({
    email: "userTest1@gmail.com",
  });

  expect(res.status).toBe(200)

})

test("error when deleting an unregistered delivery driver",async () => {
  const res = await api.delete("/api/users/delete/deliveryman").send({
    email: "user@gmail.com",
  });

  expect(res.status).toBe(500)

})

test("delete admin user",async () => {
  const res = await api.delete("/api/users/delete/admin").send({
    email: "userTest3@gmail.com",
  });
  expect(res.status).toBe(200)

})
})


afterAll(async () => {
  try {

    await User.destroy({ where: {} });
    await db.close();
    
  } catch (error) {
    console.error("it was not possible to delete the users", error);
  }});

 */
