const Transaction = require("../../models/Transaction");

module.exports.renderHistory = async (req, res, next) => {
	let trans = await Transaction.find({
		$or: [
			{ senderPhone: req.session.account.phone },
			{ receiverPhone: req.session.account.phone },
		],
	}).lean();
	await trans.forEach((tran) => {
		if (
			tran.transactionType === 2 &&
			tran.receiverPhone === req.session.account.phone
		) {
			tran.transactionType = 3;
		}
	});
	trans = await trans.filter(function (tran) {
		return !(
			tran.transactionType === 3 &&
			(tran.status === 0 || tran.status === 2) &&
			tran.receiverPhone === req.session.account.phone
		);
	});

	res.render(`user/transaction/history`, {
		trans: trans,
		layout: "user",
	});
};

module.exports.renderHistoryDetail = async (req, res, next) => {
	const trans = await Transaction.findById(req.params.id)
		.populate("phoneCardCode")
		.lean();
        if (
            trans.transactionType === 2 &&
            trans.receiverPhone === req.session.account.phone
        ) {
            trans.transactionType = 3;
        }
	res.render(`user/transaction/historyDetail`, {
		trans: trans,
		layout: "user",
	});
};
