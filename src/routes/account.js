const express = require("express");
const router = express.Router();
const middleware = require("../middlewares/middleware");
const authController = require("../app/controllers/authController");

router.patch("/resetPassword/:token", authController.resetPassword);
router.post("/forgotPassword", authController.forgotPassword);

router.post("/login", authController.login);
router.post("/signup", authController.signup);
router.use(middleware.protect);
// API change password
router.patch("/changePassword", authController.changePassword);
module.exports = router;
