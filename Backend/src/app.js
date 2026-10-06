const express = require("express");
const morgan = require("morgan");
const initUserDB = require("./Database/user.table");
const initFlowerDB = require("./Database/flower.table");
const initPredictionDB = require("./Database/prediction.table");
const predictionRoutes = require("./routes/prediction.routes");
const authRoutes = require("./routes/auth.routes");
const cookieParser = require("cookie-parser")
const cors = require("cors");

const app = express();
initUserDB();
initFlowerDB();
initPredictionDB();

app.use(express.json());
app.use(morgan(`dev`));
app.use(cookieParser());
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
}));


app.use("api/predict", predictionRoutes);
app.use("api/auth", authRoutes);
module.exports = app;