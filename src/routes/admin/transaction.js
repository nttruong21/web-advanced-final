const express = require("express");
const route = express.Router();
const adminTransactionController = require("../../app/controllers/admin/TransactionController");

route.get(
    "/waiting-approve-transactions",
    adminTransactionController.getWatingApproveTransactionsView
);
route.get(
    "/approved-transactions",
    adminTransactionController.getApproveTransactionsView
);
route.get(
    "/canceled-transactions",
    adminTransactionController.getCanceledTransactionsView
);

module.exports = route;
