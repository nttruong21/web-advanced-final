const jwt = require("jsonwebtoken");
const catchAsync = require("../utils/catchAsync");
const { promisify } = require("util");
const Account = require("../app/models/account");
const Transaction = require("../app/models/Transaction");

const { reverse } = require("dns");

const response = (res, statusCode, status, message) => {
	return res.status(statusCode).json({
		status,
		message,
	});
};
// Bảo vệ routes
exports.protect = catchAsync(async (req, res, next) => {
	let token;
	if (
		req.headers.authorization &&
		req.headers.authorization.startsWith("Bearer")
	) {
		token = req.headers.authorization.split(" ")[1];
	} else if (req.cookies.jwt) {
		token = req.cookies.jwt;
	}
	if (!token) {
		return response(
			res,
			401,
			"fail",
			"Bạn chưa đăng nhập! Xin vui lòng đăng nhập để tiếp tục"
		);
	}

	// Verify token
	const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

	// Check if user still exists
	const account = await Account.findById(decoded.id).select(
		"+isChangedPassword"
	);

	if (!account) {
		return response(
			res,
			401,
			"fail",
			"Tài khoản có token này không tồn tại!"
		);
	}
	// Grant access to protected route
	req.account = account;

	next();
});

// check đã đăng nhập chưa
exports.isLoggedIn = async (req, res, next) => {
	if (req.cookies.jwt) {
		try {
			const decoded = await promisify(jwt.verify)(
				req.cookies.jwt,
				process.env.JWT_SECRET
			);
			const account = await Account.findById(decoded.id)
				.lean()
				.select("+isChangedPassword");
			if (!account) {
				return next();
			}

			res.locals.account = account;
			req.session.account = account;

			return next();
		} catch (err) {
			return next();
		}
	}
	// return res.redirect("/login");
	next();
};
// Kiểm tra đăng nhập với session
exports.checkAuth = catchAsync(async (req, res, next) => {
	if (res.locals.account && (res.locals.account.status === 0 || res.locals.account.status === 3)) {
		return res.render("warning");
	}
	if (res.locals.account && res.locals.account.status !== 0) {
		return next();
	} else if (req.session.account && (req.session.account.status === 0 || req.session.account.status === 3 )) {
		return res.render("warning");
	} else if (req.session.account && req.session.account.status !== 0) {
		return next();
	}
	return res.redirect("/login");
});

exports.checkAuthAdmin = catchAsync(async (req, res, next) => {
	if (req.session.account) {
		return next();
	}
	return res.redirect("/login");
});

exports.bodyFile = (req, res, next) => {
	req.body.frontIdCard = req.files.frontIdCard[0].filename;
	req.body.backIdCard = req.files.backIdCard[0].filename;
	next();
};

// Buy Phone Card Validation

exports.buyPhoneCardValidation = catchAsync(async (req, res, next) => {
	const { phoneCardQuantity, price, phoneServiceProviderCode } = req.body;
	const account = await Account.findOne({ _id: req.session.account._id });

	if (account.balance < phoneCardQuantity * price) {
		req.flash("error", "Mua thẻ thất bại: Số dư không đủ!");
		return res.redirect("/transactions/buy-phone-card");
	}
	if (
		phoneCardQuantity === "" ||
		price === "" ||
		phoneServiceProviderCode === ""
	) {
		req.flash(
			"error",
			"Mua thẻ thất bại: Thông tin mua thẻ điện thoại trống!"
		);
		return res.redirect("/transactions/buy-phone-card");
	}
	if (
		phoneCardQuantity > 5 ||
		phoneCardQuantity <= 0 ||
		(price !== "10000" &&
			price !== "20000" &&
			price !== "50000" &&
			price !== "100000") ||
		(phoneServiceProviderCode !== "Viettel" &&
			phoneServiceProviderCode !== "Mobiphone" &&
			phoneServiceProviderCode !== "Vinaphone")
	) {
		req.flash(
			"error",
			"Mua thẻ thất bại: Thông tin mua thẻ điện thoại không hợp lệ!"
		);
		return res.redirect("/transactions/buy-phone-card");
	}
	next();
});
exports.checkHistoryDetail = async (req, res, next) => {
	const { id } = req.params;
	const trans = await Transaction.findById(id);
	if (
		trans.receiverPhone !== req.session.account.phone &&
		trans.senderPhone !== req.session.account.phone
	) {
		req.flash(
			"error",
			"Bạn không có quyền để truy cập vào trang lịch sử giao dịch này!"
		);
		return res.redirect("/transactions/history");
	}
	next();
};
exports.checkAdminAuth = (req, res, next) => {
	console.log(">>> Role: ", req.session.account.role);
	res.locals.accountName = req.session.account.name;
	if (
		req.session.account.role !== undefined &&
		parseInt(req.session.account.role) === 1
	) {
		return next();
	}
	return res.redirect("/not-permission");
};
