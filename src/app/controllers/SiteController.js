class SiteController {
	//   index(req, res) {
	//     if (!req.session.account) {
	//       return res.redirect("/login");
	//     } else {
	//       return res.render("home");
	//     }
	//   }

	login(req, res) {
		res.render("login");
	}

	signUpUser(req, res) {
		res.render("sign-up");
	}

	changePasswordFirst(req, res) {
		res.render("change_password_first");
	}

	resetPassword(req, res) {
		res.render("reset_password");
	}

	forgotPassword(req, res) {
		res.render("forgotPassword");
	}
}

module.exports = new SiteController();
