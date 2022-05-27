const Account = require("../../models/Account");
const { multipleMongooseToObject, mongooseToObject } = require("../../../utils/mongoose");
/* User */
class AccountController {
	//[GET] /user/accounts/template
	template(req, res, next) {
		res.render("user/account/index", {
			layout: "user",
		});
	}

	//[GET] /user/accounts
	index(req, res, next) {
		res.render("user/account/index", {
			layout: "user",
		});
	}
}

module.exports = new AccountController();
