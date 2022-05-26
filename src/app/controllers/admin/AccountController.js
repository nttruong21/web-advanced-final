const Account = require("../../models/Account");
const {
    multipleMongooseToObject,
    mongooseToObject,
} = require("../../../utils/mongoose");

class AccountController {
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

    // [GET] /admin/accounts/waiting-active-accounts
    getWatingActiveAccountsView(req, res, next) {
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

    // [GET] /admin/accounts/activated-accounts
    getActivatedAccountsView(req, res, next) {
        Account.find({ status: 1 })
            .lean()
            .then((accounts) => {
                res.render("admin/account/activated-accounts", {
                    layout: "admin",
                    accounts,
                });
            })
            .catch(next);
    }

    // [GET] /admin/accounts/nullified-accounts
    getNullifiedAccountsView(req, res, next) {
        Account.find({ status: 2 })
            .lean()
            .then((accounts) => {
                res.render("admin/account/nullified-accounts", {
                    layout: "admin",
                    accounts,
                });
            })
            .catch(next);
    }

    // [GET] /admin/accounts/locking-accounts
    getLockingAccountsView(req, res, next) {
        Account.find({ status: 5 })
            .lean()
            .then((accounts) => {
                res.render("admin/account/locking-accounts", {
                    layout: "admin",
                    accounts,
                });
            })
            .catch(next);
    }

    // [GET] /admin/accounts/account-detail/:id
    getAccountDetailView(req, res, next) {
        const id = req.params.id;
        if (id) {
            Account.findOne({ _id: id })
                .lean()
                .then((account) => {
                    if (account) {
                        res.render("admin/account/account-detail", {
                            layout: "admin",
                            account,
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

    // [POST] /admin/accounts/verify-account
    verifyAccount(req, res) {
        const id = req.body.id;
        const status = parseInt(req.body.status);
        if (id && status) {
            Account.updateOne({ _id: id }, { status })
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
        } else {
            res.status(500).render("500");
        }
    }
}

module.exports = new AccountController();