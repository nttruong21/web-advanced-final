const express = require("express");
const route = express.Router();
const userTransactionController = require("../../app/controllers/user/TransactionController");
const validator = require("../../utils/validator");

route.post("/deposit", validator.depositValidator,userTransactionController.deposit);

route.post("/withdraw", validator.withdrawValidator, userTransactionController.withdraw);

route.post("/transfer", userTransactionController.transfer);

route.post("/buy-phone-card", userTransactionController.buyPhoneCard);

module.exports = route;
