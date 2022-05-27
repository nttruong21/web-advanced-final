const Transaction = require("../../models/Transaction");
const Credit = require("../../models/Credit");
const PhoneCard = require("../../models/PhoneCard");
class TransactionController {
	//[POST] /user/transactions/deposit
	deposit(req, res) {
		res.send(req.session.account);
	}
	//[POST] /user/transactions/withdraw
	withdraw(req, res) {
		res.json({
			success: true,
			session: req.session.account,
		});
	}
	//[POST] /user/transactions/transfer
	transfer(req, res) {
		res.json({
			success: true,
			session: req.session.account,
		});
	}
	//[POST] /user/transactions/buy-phone-card
	buyPhoneCard(req, res) {
		res.json({
			success: true,
			session: req.session.account,
		});
	}
}

module.exports = new TransactionController();
