const mongoose = require("mongoose");
const { Schema } = mongoose;

const transactionSchema = new Schema(
    {
        transactionType: { type: Number },
        price: { type: Number },
        status: { type: Number },
        senderPhone: { type: String },
        receiverPhone: { type: String },
        message: { type: String },
        phoneCardCode: { type: String },
        phoneCardQuantity: { type: Number },
        transactionFee: { type: String },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Transaction", transactionSchema);
