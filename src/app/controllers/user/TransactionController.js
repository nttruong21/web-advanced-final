const Transaction = require("../../models/Transaction");
const Credit = require("../../models/Credit");
const PhoneCard = require("../../models/PhoneCard");
const Account = require("../../models/Account");
const OTP = require("../../models/OTP");
const { validationResult } = require("express-validator");
const sendMail = require("../../../utils/email");
class TransactionController {
	//[POST] /transactions/deposit
	async deposit(req, res) {
		const errors = await validationResult(req);
		if (!errors.isEmpty()) {
			console.log(req.body);
			return res.status(400).json({
				status: "fail",
				message: errors.array()[0].msg,
				//message: errors.array(),
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
					acc.balance = Number(acc.balance) + Number(price);
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
							/* return res.status(200).json({
								status: "success",
								message: "Nạp tiền thành công",
							}); */
							return res.render("user/bill/deposit", {
								layout: "user",
								title: "Giao dịch nạp tiền",
								name: req.session.account.name,
								username: req.session.account.username,
								phone: req.session.account.phone,
								cardNumber: credit.cardNumber,
								createdAt: depositTransaction.createdAt,
								price: price,
								status: "Thành công",
							});
						}
						// Thẻ 111111
					} else if (credit.cardNumber === "111111") {
						await depositTransaction.save();
						await acc.save();
						return res.render("user/bill/deposit", {
							layout: "user",
							title: "Giao dịch nạp tiền",
							name: req.session.account.name,
							username: req.session.account.username,
							phone: req.session.account.phone,
							cardNumber: credit.cardNumber,
							createdAt: depositTransaction.createdAt,
							price: price,
							status: "Thành công",
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
			return res.status(400).json({
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
			// Kiểm tra số giao dịch rút tiền hôm nay >= 2 thì không cho rút
			if (numberDepositTransactionToday >= 2) {
				return res.status(400).json({
					status: "fail",
					message: "Mỗi ngày chỉ được thực hiện tối đa 2 giao dịch rút tiền.",
				});
			}
			// Số dư < số tiền rút + phí giao dịch 5%
			if (acc.balance < price * 1.05) {
				return res.status(500).json({
					status: "fail",
					message: "Số dư không đủ để thực hiện giao dịch",
				});
			}
			// Khởi tạo giao dịch
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
			if (Number(price) >= 5000000) {
				withdrawTransaction.status = 0;
			} else {
				withdrawTransaction.status = 1;
				acc.balance = Number(acc.balance) - Number(price) * 1.05;
				await acc.save();
			}
			await withdrawTransaction.save((err, transaction) => {
				if (err) {
					return res.status(500).json({
						status: "fail",
						message: "Giao dịch rút tiền không thành công",
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
		}
	}
	//[POST] /transactions/transfer
	async transfer(req, res) {
		const errors = await validationResult(req);
		if (!errors.isEmpty()) {
			console.log(req.body);
			return res.status(400).json({
				status: "fail",
				//message: errors.array()[0].msg,
				message: errors.array(),
			});
		} else {
			const { receiverPhone, price, message, isFeeForSender } = await req.body;
			const sender = await Account.findOne({ _id: req.session.account._id });
			const receiver = await Account.findOne({ phone: receiverPhone });
			const transferTransaction = await new Transaction({
				transactionType: 2,
				price: price,
				status: 0,
				senderPhone: sender.phone,
				senderName: sender.name,
				receiverPhone: receiver.phone,
				message: message,
				transactionFee: 5,
				isFeeForSender: isFeeForSender,
			});

			if (price >= 5000000) {
				transferTransaction.status = 0;
			} else {
				transferTransaction.status = 1;
				if (isFeeForSender === 0) {
					sender.balance = Number(sender.balance) - Number(price) * 1.05;
					receiver.balance = Number(receiver.balance) + Number(price);
				} else {
					sender.balance = Number(sender.balance) - Number(price);
					receiver.balance = Number(receiver.balance) + Number(price) * 0.95;
				}
				await sender.save();
				await receiver.save();
			}
			await transferTransaction.save((err, transaction) => {
				if (err) {
					return res.status(500).json({
						status: "fail",
						message: "Giao dịch chuyển tiền không thành công",
					});
				}
				// Nếu số tiền chuyển >= 5tr -> Chờ
				if (transferTransaction.status === 0) {
					return res.status(200).json({
						status: "success",
						message: "Giao dịch chuyển tiền của bạn đang được xử lý",
					});
				}
				// Nếu số tiền chuyển < 5tr -> thành công
				return res.status(200).json({
					status: "success",
					message: "Giao dịch chuyển tiền thành công",
				});
			});
		}
	}
	//[POST] /transactions/buy-phone-card
	buyPhoneCard(req, res) {
		res.json({
			success: true,
			session: req.session.account,
		});
	}

	//[POST] /transactions/send-otp - gửi otp
	async sendOTP(req, res) {
		const errors = await validationResult(req);
		if (!errors.isEmpty()) {
			console.log(req.body);
			return res.status(400).json({
				status: "fail",
				//message: errors.array()[0].msg,
				message: errors.array(),
			});
		} else {
			const generateOTP = await Math.floor(100000 + Math.random() * 900000);
			const otp = await new OTP({
				phone: req.session.account.phone,
				otp: generateOTP,
				status: 0,
				email: req.session.account.email,
			});
			await otp.save();
			req.session._id_otp = otp._id;
			console.log(`Mã OTP của bạn là: ${generateOTP}`);
			const message = `Mã OTP xác thực có hiệu lực trong vòng 1 phút.\nMã OTP của bạn là : ${generateOTP}.\n `;
			await sendMail({
				email: req.session.account.email,
				subject: "Mã OTP xác thực giao dịch nạp tiền",
				message,
			});
		}
		res.json({
			success: true,
			req: req.body,
			req: req.session,
		});
	}
	//[POST] /transactions//transfer - midleware xác thực otp
	async verifyOTP(req, res, next) {
		const errors = await validationResult(req);
		if (!errors.isEmpty()) {
			console.log(req.body);
			return res.status(400).json({
				status: "fail",
				//message: errors.array()[0].msg,
				message: errors.array(),
			});
		} else {
			const otp = await req.body.otp;
			if (req.session._id_otp) {
				const otp_db = await OTP.findOne({ _id: req.session._id_otp });
				const current = await new Date();
				const expire = await new Date(otp_db.expiredAt);
				if (expire.getTime() < current.getTime() && otp_db.otp == otp) {
					return res.status(400).json({
						status: "fail",
						message: "Mã OTP đã hết hạn. Nhấn gửi lại mã OTP để nhận mã OTP mới",
					});
				} else {
					if (otp_db.otp == otp) {
						req.session._id_otp = null;
						return next();
					} else {
						return res.json({
							status: "fail",
							message: "Mã OTP không chính xác",
						});
					}
				}
			} else {
				return res.json({
					status: "fail",
					message: "Bạn chưa gửi mã OTP. Vui lòng nhấn gửi mã OTP để nhận mã OTP mới",
				});
			}
		}
	}
}

module.exports = new TransactionController();
