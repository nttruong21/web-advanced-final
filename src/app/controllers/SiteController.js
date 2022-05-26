class SiteController {
  index(req, res) {
    res.render("home");
  }

  login(req, res) {
    res.render("login");
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

  forgotPassword(req, res) {
    res.render("forgotPassword");
  }
}

module.exports = new SiteController();
