const Transaction = require("../../models/Transaction");

class TransactionController {
    // [GET] /admin/transactions/waiting-approve-transactions
    getWatingApproveTransactionsView(req, res, next) {
        Transaction.find({ status: 0 })
            .lean()
            .then((transactions) => {
                res.render("admin/transaction/waiting-approve-transactions", {
                    layout: "admin",
                    transactions,
                });
            })
            .catch(next);
    }

    // [GET] /admin/transactions/approved-transactions
    getApproveTransactionsView(req, res, next) {
        Transaction.find({ status: 1 })
            .lean()
            .then((transactions) => {
                res.render("admin/transaction/approved-transactions", {
                    layout: "admin",
                    transactions,
                });
            })
            .catch(next);
    }

    // [GET] /admin/transactions/canceled-transactions
    getCanceledTransactionsView(req, res, next) {
        Transaction.find({ status: 2 })
            .lean()
            .then((transactions) => {
                res.render("admin/transaction/canceled-transactions", {
                    layout: "admin",
                    transactions,
                });
            })
            .catch(next);
    }
}

module.exports = new TransactionController();
