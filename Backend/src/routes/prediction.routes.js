const express = require("express");
const upload = require("../middleware/predict.middleware");
const predictRoutes = express.Router();
const predictController = require("../controllers/predict.controller");



predictRoutes.post("/", upload.single("file"), predictController.predictController);

module.exports = predictRoutes;