const Account = require("../../models/Account");

/* User */
class AccountController {
	async getNameByPhone(req, res) {
		const { phone } = req.body;
		const acc = await Account.findOne({ phone: phone , role: 0 });
		if (acc) {
			return res.json({
				status: "success",
				message: "Tìm thấy tên của số điện thoại",
				data: acc.name,
			});
		} else {
			return res.json({
				status: "fail",
				message: "Không tìm thấy tên của số điện thoại",
				data: "",
			});
		}
	}
}

module.exports = new AccountController();
