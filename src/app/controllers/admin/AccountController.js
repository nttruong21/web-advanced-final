const Account = require("../../models/Account");
const Transaction = require("../../models/Transaction");
const {
	multipleMongooseToObject,
	mongooseToObject,
} = require("../../../utils/mongoose");

class AccountController {
	// DANH SÁCH TÀI KHOẢN ĐANG CHỜ KÍCH HOẠT
	// [GET] /admin/accounts
	index(req, res, next) {
		Account.find({ status: 0 })
			.lean()
			.then((accounts) => {
				res.render("admin/account/waiting-active-accounts", {
					layout: "admin",
					accounts,
				});
			})
			.catch(next);
	}

	// DANH SÁCH TÀI KHOẢN ĐANG CHỜ KÍCH HOẠT
	// [GET] /admin/accounts/waiting-active-accounts
	getWatingActiveAccountsView(req, res, next) {
		Account.find({ status: 0, role: 0 })
			.lean()
			.then((accounts) => {
				res.render("admin/account/waiting-active-accounts", {
					layout: "admin",
					accounts,
				});
			})
			.catch(next);
	}

	// DANH SÁCH TÀI KHOẢN ĐÃ KÍCH HOẠT
	// [GET] /admin/accounts/activated-accounts
	getActivatedAccountsView(req, res, next) {
		Account.find({ status: 1, role: 0 })
			.lean()
			.then((accounts) => {
				res.render("admin/account/activated-accounts", {
					layout: "admin",
					accounts,
				});
			})
			.catch(next);
	}

	// DANH SÁCH TÀI KHOẢN ĐÃ BỊ VÔ HIỆU HÓA
	// [GET] /admin/accounts/nullified-accounts
	getNullifiedAccountsView(req, res, next) {
		Account.find({ status: 2, role: 0 })
			.lean()
			.then((accounts) => {
				res.render("admin/account/nullified-accounts", {
					layout: "admin",
					accounts,
				});
			})
			.catch(next);
	}

	// DANH SÁCH TÀI KHOẢN ĐANG BỊ KHÓA
	// [GET] /admin/accounts/locking-accounts
	getLockingAccountsView(req, res, next) {
		Account.find({ status: 5, role: 0 })
			.lean()
			.then((accounts) => {
				res.render("admin/account/locking-accounts", {
					layout: "admin",
					accounts,
				});
			})
			.catch(next);
	}

	// CHI TIẾT TÀI KHOẢN
	// [GET] /admin/accounts/account-detail/:id
	getAccountDetailView(req, res, next) {
		const id = req.params.id;
		if (id) {
			Account.findOne({ _id: id })
				.lean()
				.then(async (account) => {
					if (account) {
						const transactions = await Transaction.find({
							senderPhone: account.phone,
						}).lean();
						// console.log(transactions);
						res.render("admin/account/account-detail", {
							layout: "admin",
							account,
							transactions,
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

	// PHÊ DUYỆT TÀI KHOẢN -> DUYỆT / HỦY
	// [POST] /admin/accounts/verify-account
	verifyAccount(req, res) {
		const { id, newStatus, oldStatus } = req.body;
		if (
			id !== undefined &&
			newStatus !== undefined &&
			oldStatus !== undefined
		) {
			// NẾU LÀ GIAO DỊCH MỞ KHÓA
			if (parseInt(oldStatus) === 5) {
				Account.findById(
					id
					// {
					// 	status: newStatus,
					// 	abnormalLogin: 0,
					// 	openLogin: undefined,
					// 	lockedAt: null,
					// 	checkFailLogin: 0,
					// 	tempStatus: null,
					// }
				)
					.then(async (acc) => {
						acc.status = newStatus;
						acc.abnormalLogin = 0;
						acc.openLogin = undefined;
						acc.lockedAt = undefined;
						acc.checkFailLogin = 0;
						acc.tempStatus = undefined;
						await acc.save({ validateBeforeSave: false });
						return res.json({ code: 1 });
					})
					.catch((error) => {
						console.log(
							">>> Had error when change account status: ",
							error
						);
						return res.json({ code: 0 });
					});
			}

			// NẾU LÀ GIAO DỊCH DUYỆT / HỦY
			else {
				Account.updateOne(
					{ _id: id },
					{
						status: newStatus,
					}
				)
					.then(() => {
						return res.json({ code: 1 });
					})
					.catch((error) => {
						console.log(
							">>> Had error when change account status: ",
							error
						);
						return res.json({ code: 0 });
					});
			}
		} else {
			res.status(500).render("500");
		}
	}
}

module.exports = new AccountController();
