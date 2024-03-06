import db from "../api/config/db.config";
import { server } from "../server";
import dotenv from "dotenv";
dotenv.config({ path: ".env" });

afterAll(async () => {
  try {
    await db.close();
    server.close();
  } catch (error) {
    console.error("Error closing db or server:", error);
  }
});

describe("Database Connection", () => {
  test("should connect to the database successfully", async () => {
    try {
      // Conecta a la base de datos
      await db.authenticate();
      console.info(
        "Connection to the database has been established successfully."
      );
      // Cierra la conexión
      await db.close();
    } catch (error) {
      // Si se produce un error, muestra el mensaje de error
      console.error("Unable to connect to the database:", error);
    }
  });
});
