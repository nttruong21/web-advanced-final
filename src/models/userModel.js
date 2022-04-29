const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = mongoose.Schema({
  phone: {
    type: String,
    required: [true, "Please provide an phone number"],
    unique: true,
  },
  email: {
    type: String,
    required: [true, "Please provide an email"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Please provide a valid email"],
  },
  name: {
    type: String,
    required: [true, "Please provide an name"],
  },
  birthday: {
    type: Date,
    required: [true, "Please provide an birthday"],
  },
  idCardBack: {
    type: String,
    required: [true, "Please provide an idCardBack"],
  }, // hình ảnh Chứng minh nhân dân mặt sau
  idCardFront: {
    type: String,
    required: [true, "Please provide an idCardFront"],
  }, // hình ảnh Chứng minh nhân dân mặt trước
  status: {
    type: Number,
    default: 0, // (chờ xác minh - 0, đã xác minh - 1,
    // đã vô hiệu hóa - 2, chờ cập nhật - 3, tạm khóa - 4, khóa - 5)
  },
  abnormalLogin: {
    // lỗi đăng nhập nhiều lần
    type: Number,
    default: 0, // ( 0 - false, 1 - true),
  },
  username: {
    type: String,
    required: [true, "Please provide an username"],
  },
  password: {
    type: String,
    required: [true, "Please provide an password"],
    //only 6 characters
    min: [6, "Password must be at least 6 characters"],
  },
  passwordConfirm: {
    type: String,
    required: [true, "Please confirm your password"],
    validate: {
      // This only works on SAVE
      validator: function (el) {
        return el === this.password;
      },
      message: "Passwords are not the same",
    },
  },
  balance: {
    type: Number,
    default: 0,
  },
  isChangedPassword: {
    type: Boolean,
    default: false, // ( 0 - false, 1 - true),
  },
  role: {
    type: String,
    default: "user",
    enum: ["user", "admin"],
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
