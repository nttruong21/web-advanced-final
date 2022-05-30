const express = require("express");
const route = express.Router();
const userAccountController = require("../../app/controllers/user/AccountController");


route.post("/phone", userAccountController.getNameByPhone);

module.exports = route;
