const mongoose = require("mongoose");
const { Schema } = mongoose;

const otpSchema = new Schema(
	{
		otp: {
			type: String,
		},
		phone: {
			type: String,
		},
		email: {
			type: String,
		},
		expiredAt: {
			type: Date,
			default: Date.now() + 60 * 1000,
		},
	},
	{
		timestamps: true,
	}
);
module.exports = mongoose.model("OTP", otpSchema);
