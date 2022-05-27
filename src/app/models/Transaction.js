const mongoose = require("mongoose");
const { Schema } = mongoose;

const transactionSchema = new Schema(
    {
        transactionType: { type: Number },
        price: { type: Number },
        status: { type: Number },// 0 nạp tiền, 1 rút tiền, 2 chuyển tiền
        senderPhone: { type: String },
        senderName: { type: String },
        receiverPhone: { type: String },
        message: { type: String },
        phoneCardCode: { type: String },// Mã thẻ cào (viettel, vinaphone, mobifone)
        phoneCardQuantity: { type: Number },// Số lượng thẻ cào
        transactionFee: { type: String },
        isFeeForSender: { type: Number },// 0 người gửi, 1 người nhận
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Transaction", transactionSchema);
