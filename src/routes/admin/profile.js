const express = require("express");
const route = express.Router();
const adminProfileController = require("../../app/controllers/admin/ProfileController");
const middlewares = require("../../middlewares/middleware");

route.use(middlewares.isLoggedIn);

route.get("/", adminProfileController.index);

module.exports = route;
