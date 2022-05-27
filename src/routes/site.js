const express = require("express");
const route = express.Router();
const middleware = require("../middlewares/middleware");
const siteController = require("../app/controllers/SiteController");

route.get("/login", siteController.login);
route.get("/signUp", siteController.signUpUser);
route.get("/forgotPassword", siteController.forgotPassword);
route.get("/resetPassword", siteController.resetPassword);

route.get("/changePasswordFirst", siteController.changePasswordFirst);

module.exports = route;
