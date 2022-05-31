const Account = require("../models/account");
const catchAsync = require("../../utils/catchAsync");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const sendMail = require("../../utils/email");
const { validationResult } = require("express-validator");

// Các hàm sử dụng
// -------------------------------------------------------------------------
const response = (res, statusCode, status, message) => {
	return res.status(statusCode).json({
		status,
		message,
	});
};
const signToken = (id) =>
	jwt.sign({ id }, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_EXPIRES_IN,
	});

const randomPassword = (length) => {
	let result = "";
	const characters =
		"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	const charactersLength = characters.length;
	for (let i = 0; i < length; i++) {
		result += characters.charAt(Math.floor(Math.random() * charactersLength));
	}
	return result;
};
// end các hàm sử dụng
// -------------------------------------------------------------------------

// Đăng nhập
exports.login = catchAsync(async (req, res, next) => {
	const { username, password } = req.body;
	if (!username || !password) {
		return response(
			res,
			400,
			"fail",
			"Vui lòng nhập đầy đủ thông tin đăng nhập"
		);
	}

	const user = await Account.findOne({ username }).select(
		"+password +isChangedPassword"
	);

	if (!user) {
		return response(res, 401, "fail", "Tài khoản hoặc mật khẩu không đúng!");
	}
	// checkPassWord and checkFailLogins

	if (
		!(await user.comparePassword(password, user.password)) ||
		user.abnormalLogin >= 2
	) {
		if (user.abnormalLogin < 2) {
			user.loginFailed();
			await user.save({ validateBeforeSave: false });
		}
		if (user.abnormalLogin >= 2 || user.lockAt) {
			user.status = 5;
			await user.save({ validateBeforeSave: false });
			return response(
				res,
				401,
				"lockAcc",
				"Tài khoản đã bị khóa! Vui lòng liên hệ quản trị viên để mở khóa !"
			);
		}

		if (!user.openLogin || user.openLogin < Date.now()) {
			return response(
				res,
				401,
				"fail",
				"Tài khoản hoặc mật khẩu không đúng!"
			);
		}
	}

	if (user.openLogin > Date.now()) {
		let date = new Date(user.openLogin);
		return res.status(401).json({
			status: "fail",
			message: `Do bạn nhập sai mật khẩu 3 lần liên tiếp, tài khoản của bạn sẽ bị khóa trong 1 phút!`,
			time: `${date.getTime()}`,
		});
	}

	user.openLogin = undefined;
	user.abnormalLogin = 0;
	user.checkFailLogins = 0;
	await user.save({ validateBeforeSave: false });

	// Đăng ký token
	const token = signToken(user._id);

	const cookieOptions = {
		expires: new Date(
			Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
		),
		httpOnly: true,
		secure: true,
	};

	// Nếu đăng nhập thành công thì gửi token vào cookie
	res.cookie("jwt", token, cookieOptions);

	if (user && user.isChangedPassword === 0) {
		return res.status(200).json({
			code: 0,
			message: "Bạn chưa đổi mật khẩu!",
		});
	}

	user.password = undefined;
	req.session.account = user;

	res.status(200).json({
		status: "success",
		token,
		data: {
			user,
		},
	});
});

// Đăng ký
exports.signup = catchAsync(async (req, res, next) => {
	if (req.files.frontIdCard)
		req.body.frontIdCard = req.files.frontIdCard[0].filename;
	if (req.files.backIdCard)
		req.body.backIdCard = req.files.backIdCard[0].filename;
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(422).json({ errors: errors.array()[0].msg });
	}

	if (req.body.username) req.body.username = undefined;
	if (req.body.password) req.body.password = undefined;

	const checkMail = await Account.findOne({ email: req.body.email });
	if (checkMail) {
		return response(
			res,
			400,
			"fail",
			"Email đã được sử dụng, vui lòng chọn email khác!"
		);
	}
	
	const newUser = await Account.create(req.body);

	// random 10 number
	const username = Math.floor(Math.random() * 10000000000).toString();
	const password = randomPassword(6);
	console.log(">>> Mật khẩu đăng ký tài khoản: ", password);
	// 3) Send it to user's email

	const resetURL = `${req.protocol}://${req.get("host")}/login`;

	const message = `Tài khoản của bạn : ${username} \nMật khẩu của bạn : ${password} \nVui lòng truy cập : ${resetURL} để đăng nhập.\n`;

	try {
		await sendMail({
			email: newUser.email,
			subject: "Tài khoản và mật khẩu đăng nhập của bạn",
			message,
		});

		newUser.username = username;
		newUser.password = password;
		await newUser.save();

		res.status(200).json({
			status: "success",
			message: " sent to email!",
			newUser,
		});
	} catch (err) {
		newUser.username = undefined;
		newUser.password = undefined;
		await newUser.save({ validateBeforeSave: false });

		return response(res, 500, "fail", "Không thể gửi mail");
	}
});

// forgot password
exports.forgotPassword = catchAsync(async (req, res, next) => {
	// 1) Get account based on POSTed email
	const account = await Account.findOne({ email: req.body.email });
	if (!account) {
		return response(res, 404, "fail", "Email không tồn tại");
	}

	// 2) Tạo chuỗi token ngẫu nhiên
	const resetToken = account.createPasswordResetToken();
	await account.save({ validateBeforeSave: false });

	// 3) Send it to user's email
	const resetURL = `${req.protocol}://${req.get(
		"host"
	)}/resetPassword/${resetToken}`;

	const message = `Bạn đã quên mật khẩu? Hãy gửi nhập lại mật khẩu của bạn mới tại đây: 
  ${resetURL}.\nNếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.`;

	try {
		await sendMail({
			email: account.email,
			subject: "Mã đặt lại mật khẩu của bạn có giá trong 10 phút",
			message,
		});

		return response(res, 200, "success", "Đã gửi mail");
	} catch (err) {
		account.passwordResetToken = undefined;
		account.passwordResetExpires = undefined;
		await account.save({ validateBeforeSave: false });

		return response(res, 500, "fail", "Không thể gửi mail");
	}
});

exports.resetPassword = catchAsync(async (req, res, next) => {
	// 1) Get user based on the token
	const hashedToken = crypto
		.createHash("sha256")
		.update(req.params.token)
		.digest("hex");

	const account = await Account.findOne({
		passwordResetToken: hashedToken,
		passwordResetExpires: { $gt: Date.now() },
	});

	// 2) If token has not expired, and there is user, set the new password
	if (!account) {
		return response(res, 400, "fail", "Mã đặt lại mật khẩu đã hết hạn");
	}

	account.password = req.body.password;
	account.passwordResetToken = undefined;
	account.passwordResetExpires = undefined;
	await account.save();

	// 3) Update changedPasswordAt property for the user
	return response(res, 200, "success", "Đã đặt lại mật khẩu thành công");
});

// Đổi mật khẩu
exports.changePassword = catchAsync(async (req, res, next) => {
	const { newPassword } = req.body;
	const account = await Account.findById(req.account.id).select("+password");
	// Check new password > 6 characters
	if (newPassword.length < 6) {
		return response(res, 400, "fail", "Mật khẩu phải có ít nhất 6 ký tự");
	}

	account.password = req.body.newPassword;
	account.isChangedPassword = 1;
	await account.save();

	return response(res, 200, "success", "Đổi mật khẩu thành công");
});

//  Đăng xuất
exports.logout = catchAsync(async (req, res, next) => {
	req.session.destroy();
	res.cookie("jwt", "loggedout", {
		expires: new Date(Date.now() + 10 * 1000),
		httpOnly: true,
	});

	return response(res, 200, "success", "Đăng xuất thành công");
});

exports.changeIdCard = catchAsync(async (req, res, next) => {
	if (req.files.frontIdCard)
		req.body.frontIdCard = req.files.frontIdCard[0].filename;
	if (req.files.backIdCard)
		req.body.backIdCard = req.files.backIdCard[0].filename;
	const account = await Account.findByIdAndUpdate(
		req.account.id,
		{
			$set: req.body,
		},
		{
			new: true,
			runValidators: true,
		}
	);
	account.status = 0;
	await account.save({ validateBeforeSave: false });

	return res.status(200).json({
		status: "success",
		data: account,
	});
});
//change password me
exports.changePasswordMe = catchAsync(async (req, res, next) => {
	const { password, newPassword } = req.body;
	console.log(password, newPassword);
	const account = await Account.findById(req.account.id).select("+password");

	// Check new password > 6 characters
	if (req.body.newPassword < 6) {
		return response(res, 400, "fail", "Mật khẩu phải có ít nhất 6 ký tự");
	}
	if (!(await account.comparePassword(password, account.password))) {
		return response(res, 400, "fail", "Mật khẩu hiện tại không đúng");
	}

	account.password = newPassword;
	await account.save({ validateBeforeSave: false });

	return response(res, 200, "success", "Đổi mật khẩu thành công");
});
