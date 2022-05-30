const express = require("express");
const route = express.Router();
const userTransactionController = require("../../app/controllers/user/TransactionController");
const validator = require("../../utils/validator");


route.post("/deposit", validator.depositValidator, userTransactionController.deposit);

route.post("/withdraw", validator.withdrawValidator, userTransactionController.withdraw);

route.post("/send-otp", validator.transferValidator, userTransactionController.sendOTP);

route.post("/transfer", validator.otpValidator, userTransactionController.verifyOTP, validator.transferValidator, userTransactionController.transfer);

route.post("/buy-phone-card", userTransactionController.buyPhoneCard);

route.get("/transfer/verify-otp", userTransactionController.getViewVerifyOTP);

route.get("/get-otp", userTransactionController.sendOTP);

module.exports = route;
