const express = require("express");
const route = express.Router();
const userAccountController = require("../../app/controllers/user/AccountController");
const middleware = require("../../middlewares/middleware");
const router = require("../account");

module.exports = route;
