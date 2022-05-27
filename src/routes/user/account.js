const express = require("express");
const route = express.Router();
const userAccountController = require("../../app/controllers/user/AccountController");
const middleware = require("../../middlewares/middleware");
const router = require("../account");
route.get("/template", userAccountController.template);

route.use(middleware.isLoggedIn);
route.get("/", userAccountController.index);

module.exports = route;
