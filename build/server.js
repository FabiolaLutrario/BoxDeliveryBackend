"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const db = require("./api/config/db.js");
const app = (0, express_1.default)();
const routes = require("./api/routes/index.routes.js");
dotenv_1.default.config();
app.use(express_1.default.json());
app.use((0, morgan_1.default)("dev"));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)({
    origin: "http://localhost:3001",
    credentials: true,
}));
app.use("/api", routes);
app.get("/health", (_req, res) => {
    res.status(200).send("The server is up and healthy 😀");
});
db.sync({ force: false })
    .then(() => {
    app.listen(process.env.PORT_LOCAL_APP, () => console.log(`Server in port `, process.env.PORT_LOCAL_APP));
})
    .catch((err) => console.error(err));
module.exports = app;
