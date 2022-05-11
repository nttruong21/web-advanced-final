const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const accountSchema = mongoose.Schema({
  phone: {
    type: String,
    required: [true, "Vui lòng cung cấp số điện thoại"],
    unique: true,
  },
  email: {
    type: String,
    required: [true, "Vui lòng cung cấp email"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Vui lòng cung cấp email hợp lệ"],
  },
  name: {
    type: String,
    required: [true, "Vui lòng cung cấp tên"],
  },
  birthday: {
    type: Date,
    required: [true, "Vui lòng cung cấp ngày sinh"],
  },
  address: {
    type: String,
    required: [true, "Vui lòng cung cấp địa chỉ"],
  },
  idCardBack: {
    type: String,
    required: [true, "Vui lòng cung cấp chứng minh nhân dân mặt sau"],
  },
  idCardFront: {
    type: String,
    required: [true, "Vui lòng cung cấp chứng minh nhân dân mặt trước"],
  },
  status: {
    type: Number,
    default: 0, // (chờ xác minh - 0, đã xác minh - 1,
    // đã vô hiệu hóa - 2, chờ cập nhật - 3, tạm khóa - 4, khóa - 5)
  },
  abnormalLogin: {
    type: Number,
    default: 0, // ( 0 - false, 1 - true),
  },
  username: {
    type: String,
  },
  password: {
    type: String,
    select: false,
  },
  balance: {
    type: Number,
    default: 0,
  },
  isChangedPassword: {
    type: Boolean,
    default: false, // ( 0 - false, 1 - true),
    select: false,
  },
  role: {
    type: String,
    default: "user",
    enum: ["user", "admin"],
  },
});

accountSchema.pre("save", function (next) {
  if (!this.password) {
    next();
  }
  if (!this.isModified("password")) {
    next();
  }
  this.password = bcrypt.hashSync(this.password, 10);
  next();
});

accountSchema.methods.comparePassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

const Account = mongoose.model("Account", accountSchema);

module.exports = Account;