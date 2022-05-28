const Transaction = require("../../models/Transaction");
const Credit = require("../../models/Credit");
const PhoneCard = require("../../models/PhoneCard");
const Account = require("../../models/Account");

const { validationResult } = require("express-validator");

class TransactionController {
	//[POST] /transactions/deposit
	async deposit(req, res) {
		const errors = await validationResult(req);
		if (!errors.isEmpty()) {
			console.log(req.body);
			return res.status(422).json({
				status: "fail",
				//message: errors.array()[0].msg,
				message: errors.array(),
			});
		} else {
			const { cardNumber, cardExpirationDate, cvv, price } = await req.body;

			let checkDate = false;
			let checkCVV = false;

			const date = await new Date(cardExpirationDate);
			const credit = await Credit.findOne({ cardNumber: cardNumber });
			console.log(credit.cardExpirationDate.getDate());
			console.log(date.getDate());

			if (credit.cardExpirationDate.getDate() === date.getDate()) {
				checkDate = true;
			}
			if (credit.cvv === cvv) {
				checkCVV = true;
			}
			// Kiểm tra ngày hết hạn
			if (checkDate) {
				// Kiểm tra mã cvv
				if (checkCVV) {
					const acc = await Account.findOne({ _id: req.session.account._id });
					const depositTransaction = await new Transaction({
						transactionType: 0,
						price: price,
						status: 1,
						senderPhone: acc.phone,
						senderName: acc.name,
						cardNumber: credit.cardNumber,
						cardExpirationDate: credit.cardExpirationDate,
						cvv: credit.cvv,
					});
					acc.balance += price;
					// Thẻ 333333
					if (credit.cardNumber === "333333") {
						return res.status(400).json({
							status: "fail",
							message: "Thẻ hết tiền",
						});
						// Thẻ 222222
					} else if (credit.cardNumber === "222222") {
						if (price > 1000000) {
							res.status(400).json({
								status: "fail",
								message: "Số tiền nạp tối đa là 1 triệu trên 1 lần",
							});
						} else {
							await depositTransaction.save();
							await acc.save();
							return res.status(200).json({
								status: "success",
								message: "Nạp tiền thành công",
							});
						}
						// Thẻ 111111
					} else if (credit.cardNumber === "111111") {
						await depositTransaction.save();
						await acc.save();
						return res.status(200).json({
							status: "success",
							message: "Nạp tiền thành công",
						});
					}
				} else {
					return res.status(400).json({
						status: "fail",
						message: "Mã CVV không đúng",
					});
				}
			} else {
				return res.status(400).json({
					status: "fail",
					message: "Ngày hết hạn thẻ không chính xác",
				});
			}
		}
	}
	//[POST] /transactions/withdraw
	async withdraw(req, res) {
		const errors = await validationResult(req);
		if (!errors.isEmpty()) {
			console.log(req.body);
			return res.status(422).json({
				status: "fail",
				//message: errors.array()[0].msg,
				message: errors.array(),
			});
		} else {
			const { cardNumber, cardExpirationDate, cvv, message, price } = req.body;
			const acc = await Account.findOne({ _id: req.session.account._id });
			let numberDepositTransactionToday = await Transaction.count({ phone: req.session.account.phone, createdAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) } })
				.where("transactionType")
				.equals(1);
			console.log("Số giao dịch rút tiền hôm nay: " + numberDepositTransactionToday);
			if(numberDepositTransactionToday >= 2){
				return res.status(400).json({
					status: "fail",
					message: "Mỗi ngày chỉ được thực hiện tối đa 2 giao dịch rút tiền."
				})
			}
			// Số dư < số tiền rút + phí giao dịch 5%
			if (acc.balance < price * 1.05) {
				return res.status(500).json({
					status: "fail",
					message: "Số dư không đủ để thực hiện giao dịch",
				});
			}

			let withdrawTransaction = await new Transaction({
				transactionType: 1,
				price: price,
				status: 0,
				senderPhone: acc.phone,
				senderName: acc.name,
				message: message,
				transactionFee: 5,
				cardNumber: cardNumber,
				cardExpirationDate: cardExpirationDate,
				cvv: cvv,
			});
			// Số tiền rút >= 5tr -> chờ
			if (price >= 5000000) {
				withdrawTransaction.status = 0;
			} else {
				withdrawTransaction.status = 1;
				acc.balance -= price * 1.05;
				await acc.save();
			}
			await withdrawTransaction.save((err, transaction) => {
				if (err) {
					return res.status(500).json({
						status: "fail",
						message: "Giao dịch Rút tiền không thành công",
					});
				}
				// Nếu số tiền rút >= 5tr -> Chờ
				if (withdrawTransaction.status === 0) {
					return res.status(200).json({
						status: "success",
						message: "Giao dịch rút tiền của bạn đang được xử lý",
					});
				}
				// Nếu số tiền rút < 5tr -> thành công
				return res.status(200).json({
					status: "success",
					message: "Giao dịch Rút tiền thành công",
				});
			});
			/* 		return res.json({
			success: true,
			session: req.session.account,
			req: req.body,
		}); */
		}
	}
	//[POST] /transactions/transfer
	transfer(req, res) {
		res.json({
			success: true,
			session: req.session.account,
		});
	}
	//[POST] /transactions/buy-phone-card
	buyPhoneCard(req, res) {
		res.json({
			success: true,
			session: req.session.account,
		});
	}
}

module.exports = new TransactionController();
