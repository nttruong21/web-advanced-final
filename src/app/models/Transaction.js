const mongoose = require("mongoose");
const { Schema } = mongoose;

const transactionSchema = new Schema(
    {
        phoneServiceProviderCode: { type: String },
        phoneServiceProviderName: { type: String },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Transaction", transactionSchema);
