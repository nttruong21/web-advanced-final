const express = require("express");
const route = express.Router();
const userAccountController = require("../../app/controllers/user/AccountController");

route.get("/template", userAccountController.template);

route.get("/", userAccountController.index);

module.exports = route;