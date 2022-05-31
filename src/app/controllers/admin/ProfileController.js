const Account = require("../../models/account");
const Transaction = require("../../models/Transaction");

class ProfileController {
	// [GET] /admin/profile
	index(req, res) {
		res.render("admin/profile", {
			layout: "admin",
			account: req.session.account,
		});
	}
}

module.exports = new ProfileController();
