const express = require("express");
const authRouter = express.Router();
const authController = require("../controllers/auth.controller");



authRouter.post("/register", authController.registerController);

authRouter.post("/login", authController.loginController);

authRouter.post("/logout", authController.logOutController);

authRouter.get("/get-me", authController.getMeController);


module.exports = authRouter;
