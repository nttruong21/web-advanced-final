const express = require("express");
const router = express.Router();
const middleware = require("../middlewares/middleware");
const authController = require("../app/controllers/authController");
const fileUpload = require("../utils/fileUpload");
const validator = require("../utils/validator");
router.patch("/resetPassword/:token", authController.resetPassword);
router.post("/forgotPassword", authController.forgotPassword);

router.post("/login", authController.login);
router.post(
	"/signup",
	fileUpload,
	function (req, res, next) {
		req.body.frontIdCard = req.files.frontIdCard[0].filename;
		req.body.backIdCard = req.files.backIdCard[0].filename;
		next();
	},
	validator.registerValidator,
	authController.signup
);

// API change password
router.use(middleware.protect);
router.patch("/changePassword", authController.changePassword);
module.exports = router;
