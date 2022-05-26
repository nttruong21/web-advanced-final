const express = require("express");
const route = express.Router();
const siteController = require("../app/controllers/SiteController");

route.get("/", siteController.index);
route.get("/login", siteController.login);
route.get("/register", siteController.registerUser);
route.get("/changePasswordFirst", siteController.changePasswordFirst);
route.get("/resetPassword", siteController.resetPassword);
route.get("/test", siteController.test);

module.exports = route;
