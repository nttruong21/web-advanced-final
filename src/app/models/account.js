const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const accountSchema = mongoose.Schema(
  {
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
    },
    idCardFront: {
      type: String,
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
      type: Number,
      default: 0, // ( 0 - false, 1 - true),
      select: false,
    },
    role: {
      type: String,
      default: "user",
      enum: ["user", "admin"],
    },
    passwordChangeAt: {
      type: Date,
    },
    passwordResetToken: String,
    passwordResetExpires: Date,
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

accountSchema.pre("save", function (next) {
  if (!this.password) {
    next();
  }
  // If này chỉ chạy khi password đã được thay đổi
  if (!this.isModified("password")) {
    next();
  }
  this.password = bcrypt.hashSync(this.password, 10);
  next();
});

accountSchema.methods.comparePassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

accountSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");

  // Hash token and set to resetPasswordToken field
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // console.log({ resetToken }, this.passwordResetToken);

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

const Account = mongoose.model("Account", accountSchema);

module.exports = Account;
