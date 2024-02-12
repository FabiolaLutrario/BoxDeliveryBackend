import express from "express";
import cookieParser from "cookie-parser";
import logger from "morgan";
import cors from "cors";
import dotenv from "dotenv";
const db = require("./api/config/db.js");
const app = express();
const routes = require("./api/routes/index.routes.js");

dotenv.config();

app.use(express.json());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:3001",
    credentials: true,
  })
);
app.use("/api", routes);
app.get("/health", (_req, res) => {
  res.status(200).send("The server is up and healthy 😀");
});

db.sync({ force: false })
  .then(() => {
    app.listen(process.env.PORT_LOCAL_APP, () =>
      console.log(`Server in port `, process.env.PORT_LOCAL_APP)
    );
  })
  .catch((err: Error) => console.error(err));

module.exports = app;
