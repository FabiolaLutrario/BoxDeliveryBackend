import express from "express";
import cookieParser from "cookie-parser";
import logger from "morgan";
import cors from "cors";
import dotenv from "dotenv";
import db from "./api/config/db.config";
const app = express();
import http from "http";
import routes from "./api/routes/index.routes";
import path from "path";
import fs from "fs";
import swaggerUI from "swagger-ui-express";
dotenv.config();

// Lee el contenido del archivo swagger.json
const swaggerJsonPath = path.join(__dirname, "swagger.json");
let swaggerJson = fs.readFileSync(swaggerJsonPath, "utf8");

// Realiza la sustitución de la variable de entorno en el contenido del archivo
const PORT_LOCAL_APP = process.env.PORT_LOCAL_APP || "5000";
swaggerJson = swaggerJson.replace(
  /\$\{process\.env\.PORT_LOCAL_APP\}/g,
  PORT_LOCAL_APP
);

// Convierte el JSON modificado en un objeto
const swaggerSpec = JSON.parse(swaggerJson);
app.use(express.json());
app.use(logger("dev"));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:3001",
    credentials: true,
  })
);
app.get("/health", (_req, res) => {
  res.status(200).send("The server is up and healthy 😀");
});
app.use("/api", routes);

// Ruta para la documentación de Swagger
app.use("/api-doc", swaggerUI.serve, swaggerUI.setup(swaggerSpec));

let server: http.Server;

db.sync({ force: false })
  .then(() => {
    server = app.listen(
      process.env.PORT_LOCAL_APP,
      () => console.log(`Server in port `, process.env.PORT_LOCAL_APP) // eslint-disable-line
    );
  })
  .catch((err: Error) => console.error(err));

export { app, server };
