import express from "express";
import cookieParser from "cookie-parser";
import logger from "morgan";
import cors from "cors";
import dotenv from "dotenv";
import db from "./api/config/db.config";
const app = express();
import routes from "./api/routes/index.routes";

dotenv.config();

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

db.sync({ force: false })
  .then(() => {
    app.listen(
      process.env.PORT_PROD_APP,
      () => console.log(`Server in port `, process.env.PORT_PROD_APP) // eslint-disable-line
    );
  })
  .catch((err: Error) => console.error(err)); // eslint-disable-line

export default app;
