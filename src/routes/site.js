const express = require("express");
const route = express.Router();
const siteController = require("../app/controllers/SiteController");

route.get("/", siteController.index);
route.get("/login", siteController.login);
route.get("/signUp", siteController.signUpUser);
route.get("/changePasswordFirst", siteController.changePasswordFirst);
route.get("/forgotPassword", siteController.forgotPassword);
route.get("/resetPassword", siteController.resetPassword);

module.exports = route;
