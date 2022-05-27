const express = require("express");
const route = express.Router();
const userTransactionController = require("../../app/controllers/user/TransactionController");

route.post("/deposit", userTransactionController.deposit);

route.post("/withdraw", userTransactionController.withdraw);

route.post("/transfer", userTransactionController.transfer);

route.post("/buy-phone-card", userTransactionController.buyPhoneCard);

module.exports = route;
