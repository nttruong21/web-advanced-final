const mongoose = require("mongoose");
const { Schema } = mongoose;

const accountSchema = new Schema(
    {
        name: { type: String },
        email: { type: String },
        birthday: { type: Date },
        phone: { type: String },
        address: { type: String },
        username: { type: String },
        password: { type: String },
        balance: { type: Number },
        frontIdCard: { type: String },
        backIdCard: { type: String },
        status: { type: String },
        abnormalLogin: { type: String },
        isChangedPassword: { type: String },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Account", accountSchema);
