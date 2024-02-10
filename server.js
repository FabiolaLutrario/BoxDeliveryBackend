const express = require("express");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");
require("dotenv").config();
const db = require("./api/models/db.js");
const app = express();
const routes = require("./api/routes/index.routes.js");

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
app.get("/health", (req, res) => {
  res.status(200).send("The server is up and healthy 😀");
});

db.sync({ force: true })
  .then(() => {
    app.listen(process.env.PORT_LOCAL_APP, () =>
      console.log(`Server in port `, process.env.PORT_LOCAL_APP)
    );
  })
  .catch((err) => console.error(err));

module.exports = app;
