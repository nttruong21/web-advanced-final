const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

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
  address: {
    type: String,
    required: [true, "Please provide an address"],
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
    // enum: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  },
  password: {
    type: String,
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

userSchema.pre("save", function (next) {
  if (!this.password) {
    next();
  }
  if (!this.isModified("password")) {
    next();
  }
  this.password = bcrypt.hashSync(this.password, 10);
  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
