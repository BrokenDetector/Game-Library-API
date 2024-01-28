require("dotenv").config();
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const indexRouter = require("./routes/index");
const rateLimit = require("express-rate-limit");
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
const app = express();

const swaggerDocument = YAML.load("./utils/swagger.yaml");
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Set up mongoose connection
const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
const mongoDB = process.env.DATABASE_URL;

main().catch((err) => console.log(err));
async function main() {
    await mongoose.connect(mongoDB);
}

app.set("trust proxy", 2);

const limiter = rateLimit({
    windowMs: 5 * 60 * 1000,
    max: 100,
});

app.use(limiter);

app.use(
    helmet({
        crossOriginResourcePolicy: { policy: "cross-origin" },
    })
);
app.use(cors());
app.use(express.urlencoded({ extended: true }));

app.use(logger("common"));
app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/api", indexRouter);
app.get("/", function (req, res, next) {
    res.send("Game Library API. Docs: /api/docs");
});

app.use(function (req, res, next) {
    res.status(404).json({ error: "Page not found." });
});

// error handler
app.use(function (err, req, res, next) {
    console.error(err.stack);
    res.status(500).json({ error: "Internal server error." });
});

module.exports = app;
