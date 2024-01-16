const express = require("express");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
// const cors = require("cors");
require("dotenv").config();
const db = require("./api/db");
const app = express();

app.use(express.json());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
/* app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
); */
/* app.use((err, req, res, next) => {
  res.status(500).send(err);
}); */

db.sync({ force: false }).then(() => {
  app.listen(process.env.PORT_LOCAL_APP, () =>
    console.log(`Server in port `, process.env.PORT_LOCAL_APP)
  );
});

module.exports = app;
