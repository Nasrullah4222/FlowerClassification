const express = require("express");
const morgan = require("morgan");
const initUserDB = require("./Database/user.table");
const initFlowerDB = require("./Database/flower.table");
const initPredictionDB = require("./Database/prediction.table");

const app = express();
initUserDB();
initFlowerDB();
initPredictionDB();

app.use(express.json);
app.use(morgan(`dev`));
module.exports = app;