class SiteController {
  index(req, res) {
    res.render("home");
  }

  login(req, res) {
    res.render("test");
  }

  registerUser(req, res) {
    res.render("register");
  }

  changePasswordFirst(req, res) {
    res.render("change_password_first");
  }

  resetPassword(req, res) {
    res.render("reset_password");
  }
}

module.exports = new SiteController();
