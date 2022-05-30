const express = require("express");
const router = express.Router();
const middleware = require("../middlewares/middleware");
const authController = require("../app/controllers/authController");
const fileUpload = require("../utils/fileUpload");
const validator = require("../utils/validator");
const { check } = require("express-validator");
const { route } = require("express/lib/application");
router.patch("/resetPassword/:token", authController.resetPassword);
router.post("/forgotPassword", authController.forgotPassword);

router.post("/login", authController.login);
router.get("/logout", authController.logout);
router.post(
	"/signup",
	fileUpload,
	validator.registerValidator,
	authController.signup
);

// API change password
router.use(middleware.protect);
router.patch("/changePassword", authController.changePassword);
module.exports = router;
