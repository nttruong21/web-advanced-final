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
        status: { // 0 - sử dụng được, 1 là hết hạn
            type: Number,
        },
        
        expiredAt: {
            type: Date,
            default: Date.now() + 60*1000,
        }
    },
    {
        timestamps: true,
    }
);

// if createAt - expiredAt <= 0 => auto status = 1



module.exports = mongoose.model("OTP", otpSchema);