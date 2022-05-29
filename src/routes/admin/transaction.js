const express = require("express");
const route = express.Router();
const adminTransactionController = require("../../app/controllers/admin/TransactionController");

// DANH SÁCH GIAO DỊCH ĐANG CHỜ DUYỆT
route.get(
    "/waiting-approve-transactions",
    adminTransactionController.getWatingApproveTransactionsView
);
// DANH SÁCH GIAO DỊCH ĐÃ ĐƯỢC DUYỆT
route.get(
    "/approved-transactions",
    adminTransactionController.getApproveTransactionsView
);
// DANH SÁCH GIAO DỊCH ĐÃ HỦY
route.get(
    "/canceled-transactions",
    adminTransactionController.getCanceledTransactionsView
);
// CHI TIẾT GIAO DỊCH
route.get(
    "/transaction-detail/:id",
    adminTransactionController.getTransactionDetailView
);
// PHÊ DUYỆT GIAO DỊCH RÚT TIỀN
route.post(
    "/verify-withdrawal-transaction",
    adminTransactionController.verifyWithdrawalTransaction
);
// GIAO DỊCH CHUYỂN TIỀN
route.post(
    "/verify-transfer-transaction",
    adminTransactionController.verifyTransferTransaction
);

module.exports = route;
