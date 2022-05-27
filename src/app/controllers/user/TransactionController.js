const Transaction = require("../../models/Transaction");

class TransactionController {
	//[GET] /user/transactions/deposit
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
}

module.exports = new TransactionController();
