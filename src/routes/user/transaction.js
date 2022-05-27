const express = require("express");
const route = express.Router();
const userAccountController = require("../../app/controllers/user/TransactionController");

route.get("/deposit", userAccountController.deposit);
route.get("/withdraw", userAccountController.withdraw);
route.get("/transfer", userAccountController.transfer);
route.get("/buy-phone-card", userAccountController.buyPhoneCard);
route.get("/history", userAccountController.history);

module.exports = route;
