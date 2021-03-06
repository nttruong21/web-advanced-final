const adminAccountRoute = require("./admin/account");
const adminTransactionRoute = require("./admin/transaction");
const adminProfileRoute = require("./admin/profile");
const siteRoute = require("./site");
const accountRoute = require("./account");
const userAccountRoute = require("./user/account");
const userTransactionRoute = require("./user/transaction");
const middlewares = require("../middlewares/middleware");

function route(app) {
	// Tương tự các route như account, ... sẽ khai báo ở đây

	// Admin
	app.use(
		"/admin/profile",
		middlewares.checkAuthAdmin,
		middlewares.checkAdminAuth,
		adminProfileRoute
	);

	app.use(
		"/admin/accounts",
		middlewares.checkAuthAdmin,
		middlewares.checkAdminAuth,
		adminAccountRoute
	);
	app.use(
		"/admin/transactions",
		middlewares.checkAuthAdmin,
		middlewares.checkAdminAuth,
		adminTransactionRoute
	);

	// Client
	app.use("/", siteRoute);
	app.use("/api/accounts", accountRoute);

	// User
	app.use("/accounts", userAccountRoute);
	app.use("/transactions", userTransactionRoute);

	// 404, 500
	app.use((req, res) => {
		res.render("404", { layout: false });
	});

	app.use((err, req, res, next) => {
		console.error(err.message);
		res.render("500", { layout: false });
	});
}

module.exports = route;
