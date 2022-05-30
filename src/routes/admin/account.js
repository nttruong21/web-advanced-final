const express = require("express");
const route = express.Router();
const adminAccountController = require("../../app/controllers/admin/AccountController");
const middlewares = require("../../middlewares/middleware");

route.get("/", adminAccountController.index);
route.get(
	"/waiting-active-accounts",
	adminAccountController.getWatingActiveAccountsView
);
route.get(
	"/activated-accounts",
	adminAccountController.getActivatedAccountsView
);
route.get(
	"/nullified-accounts",
	adminAccountController.getNullifiedAccountsView
);
route.get("/locking-accounts", adminAccountController.getLockingAccountsView);
route.get("/account-detail/:id", adminAccountController.getAccountDetailView);
route.post("/verify-account", adminAccountController.verifyAccount);

module.exports = route;
