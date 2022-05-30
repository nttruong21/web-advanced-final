const express = require("express");
const route = express.Router();
const userTransactionController = require("../../app/controllers/user/TransactionController");
const validator = require("../../utils/validator");
const check = require("../../middlewares/middleware");
const {
	createBuyCardTransactions,
	renderBuyCardBill,
} = require("../../app/controllers/user/BuyCards");
const {
	verifyOTP,
} = require("../../app/controllers/user/TransactionController");
const PhoneCard = require("../../app/models/PhoneCard");

route.post(
	"/deposit",
	check.checkAuth,
	validator.depositValidator,
	userTransactionController.deposit
);

route.post(
	"/withdraw",
	check.checkAuth,
	validator.withdrawValidator,
	userTransactionController.withdraw
);

route.post(
	"/send-otp",
	check.checkAuth,
	validator.transferValidator,
	userTransactionController.sendOTP
);

route.post(
	"/transfer",
	check.checkAuth,
	validator.otpValidator,
	userTransactionController.verifyOTP,
	validator.transferValidator,
	userTransactionController.transfer
);

route.post(
	"/buy-phone-card",
	check.checkAuth,
	userTransactionController.buyPhoneCard
);
route.post(
	"/phonecard",
	check.checkAuth,
	check.buyPhoneCardValidation,
	createBuyCardTransactions
);

route.get("/phonecard/:id", check.checkAuth, renderBuyCardBill);

module.exports = route;
