const express = require("express");
const router = express.Router();

const authController = require("../app/controllers/authController");

router.patch("/resetPassword/:token", authController.resetPassword);
router.post("/forgotPassword", authController.forgotPassword);

router.post("/login", authController.login);
router.post("/signup", authController.signup);
router.get("/test", authController.protect);

module.exports = router;
