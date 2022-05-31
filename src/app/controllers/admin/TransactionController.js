const Transaction = require("../../models/Transaction");
const Account = require("../../models/account");
const sendMail = require("../../../utils/email");

class TransactionController {
	// DANH SÁCH GIAO DỊCH ĐANG CHỜ DUYỆT
	// [GET] /admin/transactions/waiting-approve-transactions
	getWatingApproveTransactionsView(req, res, next) {
		Transaction.find({
			status: 0,
			price: { $gte: 5000000 },
			$or: [{ transactionType: 1 }, { transactionType: 2 }],
		})
			.lean()
			.then((transactions) => {
				res.render("admin/transaction/waiting-approve-transactions", {
					layout: "admin",
					transactions,
				});
			})
			.catch(next);
	}

	// DANH SÁCH GIAO DỊCH ĐÃ ĐƯỢC DUYỆT
	// [GET] /admin/transactions/approved-transactions
	getApproveTransactionsView(req, res, next) {
		Transaction.find({
			status: 1,
			price: { $gte: 5000000 },
			$or: [{ transactionType: 1 }, { transactionType: 2 }],
		})
			.lean()
			.then((transactions) => {
				res.render("admin/transaction/approved-transactions", {
					layout: "admin",
					transactions,
				});
			})
			.catch(next);
	}

	// DANH SÁCH GIAO DỊCH ĐÃ HỦY
	// [GET] /admin/transactions/canceled-transactions
	getCanceledTransactionsView(req, res, next) {
		Transaction.find({
			status: 2,
			price: { $gte: 5000000 },
			$or: [{ transactionType: 1 }, { transactionType: 2 }],
		})
			.lean()
			.then((transactions) => {
				res.render("admin/transaction/canceled-transactions", {
					layout: "admin",
					transactions,
				});
			})
			.catch(next);
	}

	// CHI TIẾT GIAO DỊCH
	// [GET] /admin/transactions/transaction-detail/:id
	getTransactionDetailView(req, res, next) {
		const id = req.params.id;
		if (id) {
			Transaction.findOne({ _id: id })
				.lean()
				.then((transaction) => {
					if (transaction) {
						res.render("admin/transaction/transaction-detail", {
							layout: "admin",
							transaction,
						});
					} else {
						res.status(404).render("404");
					}
				})
				.catch(next);
		} else {
			res.status(500).render("500");
		}
	}

	// PHÊ DUYỆT GIAO DỊCH RÚT TIỀN
	// [POST] /admin/transactions/verify-withdrawal-transaction
	verifyWithdrawalTransaction(req, res) {
		const { id, status, senderPhone, price, transactionFee } = req.body;

		if (id && status && senderPhone && price && transactionFee) {
			// DUYỆT
			if (parseInt(status) === 1) {
				const realPrice = Math.round(price * (1 + transactionFee / 100));

				// THỰC HIỆN UPDATE STATUS, UPDATE BALANCE
				const updateTransactionStatus = async () => {
					return await Transaction.updateOne(
						{ _id: id },
						{ status: parseInt(status) }
					);
				};
				const getAccountByPhone = async (senderPhone) => {
					return await Account.findOne({ phone: senderPhone });
				};
				const updateAccountBalance = async (realPrice) => {
					try {
						const account = await getAccountByPhone(senderPhone);
						const newBalance = parseInt(account.balance - realPrice);

						// console.log(">>> Real price:", realPrice);
						// console.log(">>> New balance:", newBalance);

						if (newBalance < 0) {
							return Transaction.updateOne({ _id: id }, { status: 2 });
						} else {
							return Account.updateOne(
								{ phone: senderPhone },
								{ balance: newBalance }
							);
						}
					} catch (error) {
						console.log(
							">>> Có lỗi ở dòng 112, TransactionController.js"
						);
					}
				};

				Promise.all([
					updateTransactionStatus(),
					updateAccountBalance(realPrice),
				])
					.then(() => {
						return res.json({
							code: 1,
							message: "Duyệt giao dịch thành công",
						});
					})
					.catch(() => {
						return res.json({
							code: 0,
							message: "Duyệt giao dịch thất bại",
						});
					});
			}
			// HỦY
			else if (parseInt(status) === 2) {
				// THỰC HIỆN UPDATE STATUS
				Transaction.updateOne({ _id: id }, { status: parseInt(status) })
					.then(() => {
						return res.json({
							code: 1,
							message: "Duyệt giao dịch thành công",
						});
					})
					.catch(() => {
						return res.json({
							code: 0,
							message: "Duyệt giao dịch thất bại",
						});
					});
			}
		} else {
			res.status(500).render("500");
		}
	}

	// PHÊ DUYỆT GIAO DỊCH CHUYỂN TIỀN
	// [POST] /admin/transactions/verify-transfer-transaction
	verifyTransferTransaction(req, res) {
		const {
			id,
			status,
			senderPhone,
			senderName,
			receiverName,
			receiverPhone,
			receiverEmail,
			price,
			transactionFee,
			isFeeForSender,
			message,
		} = req.body;

		if (
			id &&
			status &&
			senderPhone &&
			receiverPhone &&
			price &&
			transactionFee
		) {
			// DUYỆT
			if (parseInt(status) === 1) {
				// GET REAL PRICE OF TRANSACTION (INCLUDE FEE)
				const fee = (parseInt(price) * parseInt(transactionFee)) / 100;

				// console.log(">>> Fee: ", fee);

				// UPDATE TRANSACTION STATUS
				const updateTransactionStatus = async () => {
					return await Transaction.updateOne(
						{ _id: id },
						{ status: parseInt(status) }
					);
				};

				// GET ACCOUNT BY PHONE NUMBER
				const getAccountByPhone = async (phone) => {
					return await Account.findOne({ phone });
				};

				// UPDATE SENDER ACCOUNT BALANCE
				const updateSenderAccountBalance = async (price) => {
					try {
						const senderAccount = await getAccountByPhone(senderPhone);

						const newBalanceOfSender =
							parseInt(isFeeForSender) === 1
								? parseInt(senderAccount.balance) - price - fee
								: parseInt(senderAccount.balance) - price;
						// console.log(
						//     ">>> New balance of sender:",
						//     newBalanceOfSender
						// );

						if (newBalanceOfSender < 0) {
							return Transaction.updateOne({ _id: id }, { status: 2 });
						} else {
							return Account.updateOne(
								{ phone: senderPhone },
								{ balance: newBalanceOfSender }
							);
						}
					} catch (error) {
						console.log(
							">>> Có lỗi ở dòng 112, TransactionController.js"
						);
					}
				};

				// UPDATE RECEIVER ACCOUNT BALANCE
				const updateReceiverAccountBalance = async (price) => {
					try {
						const receiverAccount = await getAccountByPhone(
							receiverPhone
						);
						const newBalanceOfReceiver =
							parseInt(isFeeForSender) === 1
								? parseInt(receiverAccount.balance) + price
								: parseInt(receiverAccount.balance) + price - fee;

						// console.log(">>> Real price:", realPrice);
						// console.log(">>> New balance:", newBalance);

						return Account.updateOne(
							{ phone: receiverPhone },
							{ balance: newBalanceOfReceiver }
						);
					} catch (error) {
						console.log(
							">>> Có lỗi ở dòng 112, TransactionController.js"
						);
					}
				};

				//
				Promise.all([
					updateTransactionStatus(),
					updateSenderAccountBalance(price),
					updateReceiverAccountBalance(price),
				])
					.then(async () => {
						console.log(">>> Send mail to: ", receiverEmail);
						try {
							const priceString = parseInt(price).toLocaleString(
								"vi-VN",
								{
									style: "currency",
									currency: "VND",
								}
							);
							const emailMessage = `Biên lai chuyển tiền
											\n Họ tên người gửi: ${senderName}
											\n Số điện thoại người gửi: ${senderPhone}
											\n Họ tên người nhận: ${receiverName}
											\n Số điện thoại người nhận: ${receiverPhone}
											\n Số tiền: ${priceString}
											\n Lời nhắn: ${message}
  											`;
							await sendMail({
								email: receiverEmail,
								subject: "Giao dịch chuyển tiền",
								message: emailMessage,
							});
						} catch (error) {
							console.log(">>> Có lỗi khi gửi email: ", error);
						}

						return res.json({
							code: 1,
							message: "Duyệt giao dịch chuyển tiền thành công",
						});
					})
					.catch(() => {
						return res.json({
							code: 0,
							message: "Duyệt giao dịch chuyển tiền thất bại",
						});
					});
			}
			// HỦY
			else if (parseInt(status) === 2) {
				// THỰC HIỆN UPDATE STATUS
				Transaction.updateOne({ _id: id }, { status: parseInt(status) })
					.then(() => {
						return res.json({
							code: 1,
							message: "Duyệt giao dịch chuyển tiền thành công",
						});
					})
					.catch(() => {
						return res.json({
							code: 0,
							message: "Duyệt giao dịch chuyển tiền thất bại",
						});
					});
			}
		} else {
			res.status(500).render("500");
		}
	}
}

module.exports = new TransactionController();
