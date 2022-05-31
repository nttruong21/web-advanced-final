const PhoneCard = require("../../models/PhoneCard");
const Transaction = require("../../models/Transaction");

const getPhoneCard = (cardType) => {
	let phoneCardCode = 0;
	if (cardType === "Viettel") {
		phoneCardCode =
			1111100000 + Math.floor(Math.random() * (99999 - 10000 + 1)) + 10000;
	} else if (cardType === "Mobiphone") {
		phoneCardCode =
			2222200000 + Math.floor(Math.random() * (99999 - 10000 + 1)) + 10000;
	} else if (cardType === "Vinaphone") {
		phoneCardCode =
			3333300000 + Math.floor(Math.random() * (99999 - 10000 + 1)) + 10000;
	}
	return phoneCardCode;
};
module.exports.createBuyCardTransactions = async (req, res, next) => {
	const trans = await new Transaction();
	trans.transactionType = 4;
	trans.status = 1;
	trans.senderPhone = req.session.account.phone;
	trans.senderName = req.session.account.name;
	trans.transactionFee = 0;

	const cardQuantity = parseInt(req.body.phoneCardQuantity);
	trans.phoneCardQuantity = cardQuantity;
	trans.price = cardQuantity * parseInt(req.body.price);
	for (let i = 0; i < cardQuantity; i++) {
		let card = await new PhoneCard({
			phoneCardCode: getPhoneCard(req.body.phoneServiceProviderCode),
			price: req.body.price,
			phoneServiceProviderCode: req.body.phoneServiceProviderCode,
		});
		trans.phoneCardCode.push(card);
		await card.save();
	}
	await trans.save();
	// console.log(trans.id);
	req.flash("success", "Mua thẻ điện thoại thành công thành công");
	res.redirect(`/transactions/phonecard/${trans._id}`);
};

module.exports.renderBuyCardBill = async (req, res, next) => {
	let cardInfo = {};
	const trans = await Transaction.findById(req.params.id).populate(
		"phoneCardCode"
	);

	let cardCode = [];
	trans.phoneCardCode.forEach((num) => {
		cardCode.push(num.phoneCardCode);
	});
	cardInfo.code = cardCode;
	cardInfo.cardProvider = trans.phoneCardCode[0].phoneServiceProviderCode;
	cardInfo.cardType = trans.phoneCardCode[0].price;

	cardInfo.price = trans.price;

	res.render(`user/transaction/phoneCardBill`, {
		cardInfo: cardInfo,
		layout: "user",
	});
};
