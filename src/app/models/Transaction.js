const mongoose = require("mongoose");
const { Schema } = mongoose;

const transactionSchema = new Schema(
    {
        transactionType: { type: Number },
        price: { type: Number },
        status: { type: Number },
        senderPhone: { type: String },
        senderName: { type: String },
        receiverPhone: { type: String },
        cardNumber: { type: String },
        cardExpirationDate: { type: Date },
        cvv: { type: String },
        message: { type: String },
        phoneCardCode: { type: String },
        phoneCardQuantity: { type: Number },
        transactionFee: { type: Number },
        isFeeForSender: { type: Number },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Transaction", transactionSchema);
