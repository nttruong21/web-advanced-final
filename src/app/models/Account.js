const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const moment = require("moment-timezone");

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
		frontIdCard: {
			type: String,
		},
		backIdCard: {
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
			type: Number,
			default: 0, // 0 - user, 1 - admin
			enum: [0, 1],
		},
		passwordChangeAt: {
			type: Date,
		},
		passwordResetToken: String,
		passwordResetExpires: {
			type: Date,
		},
		checkFailLogins: { type: Number, default: 0 },
		openLogin: { type: Date },
		passwordResetExpires: Date,
		lockedAt: { type: Date },
	},
	{
		timestamps: true,
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	}
);

accountSchema.pre("save", async function (next) {
	if (!this.password) {
		next();
	}
	// If này chỉ chạy khi password đã được thay đổi
	if (!this.isModified("password")) {
		next();
	}
	this.password = await bcrypt.hash(this.password, 10);

	next();
});
accountSchema.pre("save", function (next) {
	// console.log(this.abnormalLogin, this.checkFailLogins);
	if (this.abnormalLogin === 2 && this.checkFailLogins === 0) {
		const dateVietNam = moment.tz(Date.now(), "Asia/Ho_Chi_Minh");
		this.lockedAt = dateVietNam;
		next();
	}
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

	// date vietnamese
	const dateVietNam = moment.tz(Date.now(), "Asia/Ho_Chi_Minh");
	this.passwordResetExpires = dateVietNam + 10 * 60 * 1000;

	return resetToken;
};

accountSchema.methods.loginFailed = function () {
	if (this.checkFailLogins < 3) {
		this.checkFailLogins++;
	} else if (this.checkFailLogins === 3) {
		const dateVietNam = moment.tz(Date.now(), "Asia/Ho_Chi_Minh");
		this.openLogin = dateVietNam + 30 * 1000;
		this.checkFailLogins = 0;
		this.abnormalLogin++;
	}
};

module.exports = mongoose.model("Account", accountSchema);