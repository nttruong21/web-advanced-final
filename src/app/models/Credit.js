const mongoose = require("mongoose");
const { Schema } = mongoose;

const creditSchema = new Schema(
    {
        cardNumber: { type: Number },
        cardExpirationDate: { type: Date },
        cvv: { type: String },
        note: { type: String },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Credit", creditSchema);
