const jwt = require("jsonwebtoken");
const catchAsync = require("../utils/catchAsync");
const { promisify } = require("util");
const Account = require("../app/models/Account");

const response = (res, statusCode, status, message) => {
	return res.status(statusCode).json({
		status,
		message,
	});
};
// Bảo vệ routes
exports.protect = catchAsync(async (req, res, next) => {
	let token;
	if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
		token = req.headers.authorization.split(" ")[1];
	} else if (req.cookies.jwt) {
		token = req.cookies.jwt;
	}
	if (!token) {
		return response(res, 401, "fail", "Bạn chưa đăng nhập! Xin vui lòng đăng nhập để tiếp tục");
	}

	// Verify token
	const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

	// Check if user still exists
	const account = await Account.findById(decoded.id).select("+isChangedPassword");

	if (!account) {
		return response(res, 401, "fail", "Tài khoản có token này không tồn tại!");
	}
	// Grant access to protected route
	req.account = account;

	next();
});

// check đã đăng nhập chưa
exports.isLoggedIn = catchAsync(async (req, res, next) => {
	if (req.cookies.jwt) {
		const decoded = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRET);
		const account = await Account.findById(decoded.id).lean().select("+isChangedPassword");
		if (!account) {
			return next();
		}

		res.locals.account = account;
		req.session.account = account;

		return next();
	}
	next();
});
