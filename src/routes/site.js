const express = require("express");
const route = express.Router();
const siteController = require("../app/controllers/SiteController");
const middleware = require("../middlewares/middleware");

route.get("/login", siteController.login);
route.get("/signUp", siteController.signUpUser);
route.get("/forgotPassword", siteController.forgotPassword);
route.get("/resetPassword", siteController.resetPassword);

route.use(middleware.isLoggedIn);
route.get("/changePasswordFirst", siteController.changePasswordFirst);

route.get("/", siteController.index);

module.exports = route;
