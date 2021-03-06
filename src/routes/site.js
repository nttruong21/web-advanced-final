const express = require("express");
const route = express.Router();
const middleware = require("../middlewares/middleware");
const siteController = require("../app/controllers/SiteController");

route.use(middleware.isLoggedIn);

route.get("/", (req, res) => {
	res.redirect("/login");
});

route.get("/login", siteController.login);

route.get("/signUp", siteController.signUpUser);

route.get("/forgotPassword", siteController.forgotPassword);

route.get("/resetPassword/:token", siteController.resetPassword);

route.get("/changePasswordFirst", siteController.changePasswordFirst);

route.use("/transactions", middleware.checkAuth);

route.get("/accounts", siteController.index);

route.get("/accounts/template", siteController.template);

route.get("/transactions/deposit", siteController.deposit);

route.get("/transactions/withdraw", siteController.withdraw);

route.get("/transactions/transfer", siteController.transfer);

route.get("/transactions/buy-phone-card", siteController.buyPhoneCard);

// route.get("/transactions/history", siteController.history);

route.get("/not-permission", siteController.getNotPermissionView);

module.exports = route;
