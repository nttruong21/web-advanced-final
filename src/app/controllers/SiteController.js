class SiteController {
	login(req, res) {
		res.render("login");
	}

	signUpUser(req, res) {
		res.render("sign-up");
	}

	changePasswordFirst(req, res) {
		res.render("change_password_first");
	}

	resetPassword(req, res) {
		res.render("reset_password");
	}

	forgotPassword(req, res) {
		res.render("forgotPassword");
	}

	deposit(req, res) {
		res.render("user/transaction/deposit", {
			layout: "user",
		});
	}
	//[GET] /user/transactions/withdraw
	withdraw(req, res) {
		res.render("user/transaction/withdraw", {
			layout: "user",
		});
	}
	//[GET] /user/transactions/transfer
	transfer(req, res) {
		res.render("user/transaction/transfer", {
			layout: "user",
		});
	}
	//[GET] /user/transactions/buy-phone-card
	buyPhoneCard(req, res) {
		res.render("user/transaction/buy-phone-card", {
			layout: "user",
		});
	}
	//[GET] /user/transactions/history
	history(req, res) {
		res.render("user/transaction/history", {
			layout: "user",
		});
	}

	//[GET] /user/accounts/template
	template(req, res, next) {
		res.render("user/account/index", {
			layout: "user",
		});
	}

	//[GET] /user/accounts
	index(req, res, next) {
		if (!req.session.account) {
			return res.redirect("/login");
		}
		res.render("user/account/index", {
			layout: "user",
		});
	}
}

module.exports = new SiteController();
