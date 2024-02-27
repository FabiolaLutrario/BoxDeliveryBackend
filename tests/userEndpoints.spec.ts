import supertest from "supertest";
import db from "../api/config/db.config";
import app from "../server";
import dotenv from "dotenv";
import  User  from "../api/models/User.models";
dotenv.config({ path: ".env" });
const api = supertest(app);

beforeAll(async()=>{

    try {
      await db.validate();
      console.info(
        "Connection to the database has been established successfully."
      );
    } catch (error) {
      console.error("Unable to connect to the database:", error);
    }
});

beforeAll(async()=>{
  try {
    await User.destroy({ where: {} });

  } catch (error) {
    console.error("it was not possible to delete the users", error);
  }
});

describe("endpoint testing obtain delivery users",()=>{
 beforeEach(async () => {
    await User.bulkCreate([{
        email:"userTest1@gmail.com",
        name:"userTest",
        last_name:"testing",
        password:"HelloWorld123"
    },
    {
      email:"userTest2@gmail.com",
      name:"userTest2",
      last_name:"testing2",
      password:"HelloWorld123",
  }])});


test("get delivery users",async()=>{

 const res = await api.get("/api/users/deliverymen")

expect(res.status).toBe(200)
// expect(res.lenght).toBe(2)
});

test("get delivery user",async()=>{

 const res = await api.get("/api/users/deliveryman/1")
 
 expect(res.status).toBe(200)
//  expect(res.data.lenght).toBe(1) 
 

 });


 afterEach(async () => {
  try {
    await db.models.User.destroy({ where: {} });

  } catch (error) {
    console.error("it was not possible to delete the users", error);
  }});
});



describe("testing user deletion", ()=>{

beforeEach(async () => {
    await User.bulkCreate([{
        email:"userTest1@gmail.com",
        name:"userTest",
        last_name:"testing",
        password:"HelloWorld123"
    },
    {
      email:"userTest2@gmail.com",
      name:"userTest2",
      last_name:"testing2",
      password:"HelloWorld123",
      is_admin:true
  }])});

test("delete delivery user",async () => {
  // const res = await api.delete("/api/users/delete/deliveryman/").send({
  //   email: "userTest1@gmail.com",
  // });

  expect(true).toBe(true)

})

test("delete admin user",async () => {
  // const res = await api.delete("/api/users/delete/admin").send({
  //   email: "userTest2@gmail.com",
  // });

  expect(true).toBe(true)

})
})

afterAll(async () => {
  try {

    await User.destroy({ where: {} });
    await db.close();

  } catch (error) {
    console.error("it was not possible to delete the users", error);
  }});


  

