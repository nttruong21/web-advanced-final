const express = require("express");
const { engine } = require("express-handlebars");
const path = require("path");
const morgan = require("morgan");
require("dotenv").config();
const credentials = require("./cookie/credentials");
const route = require("./routes/index");
const db = require("./config/database/db");
const flash = require("connect-flash");
const app = express();

// CONNECT TO DATABASE
db.connect();

// HTTP logger
// app.use(morgan("combined"));
app.use(morgan("dev"));

// Use static folder
app.use(express.static(path.join(__dirname, "public")));

// Config template engine
app.engine(
	"hbs",
	engine({
		extname: "hbs",
		helpers: {
			getDateFormat: function (date) {
				return new Date(date).toLocaleDateString("vi-VN");
			},
			// KIỂM TRA CÓ PHẢI TÀI KHOẢN ĐANG CHỜ KÍCH HOẠT
			isWaitingActiveAccount: function (status) {
				return status === 0;
			},
			// KIỂM TRA CÓ PHẢI TÀI KHOẢN ĐANG BỊ KHÓA
			isLockingAccount: function (status) {
				return status === 5;
			},
			// KIỂM TRA CÓ PHẢI GIAO DỊCH ĐANG CHỜ DUYỆT
			isWaitingApproveTransaction: function (status) {
				return status === 0;
			},
			// KIỂM TRA CÓ PHẢI GIAO DỊCH NẠP TIỀN
			isRechargeTransaction: function (type) {
				return type === 0;
			},
			// KIỂM TRA CÓ PHẢI GIAO DỊCH RÚT TIỀN
			isWithdrawalTransaction: function (type) {
				return type === 1;
			},
			// KIỂM TRA CÓ PHẢI GIAO DỊCH CHUYỂN TIỀN
			isTransferTransaction: function (type) {
				return type === 2;
			},
			// KIỂM TRA CÓ PHẢI GIAO DỊCH MUA THẺ ĐIỆN THOẠI
			isByPhoneCardTransaction: function (type) {
				return type === 4;
			},
			// KIỂM TRA CÓ PHẢI GIAO DỊCH TRÊN 5.000.000
			isHasToApproveTransaction: function (price) {
				return parseInt(price) >= 5000000 ? true : false;
			},
			// RENDER TRANSACTION HISTORY
			// RETURN TYPE
			renderTransactionType: function (transactionType) {
				if (transactionType === 0) {
					transactionType = "Nạp tiền";
				} else if (transactionType === 1) {
					transactionType = "Rút tiền";
				} else if (transactionType === 2) {
					transactionType = "Chuyển tiền";
				} else if (transactionType === 3) {
					transactionType = "Nhận tiền";
				} else if (transactionType === 4) {
					transactionType = "Mua thẻ điện thoại";
				}

				return transactionType;
			},
			// RETURN DATE
			renderTransactionDate: function (date) {
				date = new Date(date);
				dateTransform =
					date.getHours() +
					":" +
					date.getMinutes() +
					" - " +
					date.getDate() +
					"/" +
					date.getMonth() +
					"/" +
					date.getFullYear();
				return dateTransform;
			},
			// RETURN STATUS
			renderTransactionStatusText: function (status) {
				if (status === 0) {
					status = "Chờ duyệt";
				} else if (status === 1) {
					status = "Đã duyệt";
				} else if (status === 2) {
					status = "Bị hủy";
				}
				return status;
			},
			getPhoneCardProviderName: function (trans) {
				return trans.phoneCardCode[0].phoneServiceProviderCode;
			},
			getPhoneCardType: function (trans) {
				return trans.phoneCardCode[0].price;
			},
			// RENDER HISTORY DETAIL
			renderHistoryDetail: function (trans) {
				switch (trans.transactionType) {
					case 0:
						return `<p class="text-primary font-weight-bold mb-0">Đang chờ kích hoạt</p>`;
					case 1:
						return `<p class="text-success font-weight-bold mb-0">Đã kích hoạt</p>`;
					case 2:
						return `<p class="text-danger font-weight-bold mb-0">Đã bị vô hiệu hóa</p>`;
					case 3:
						return `<p class="text-warning font-weight-bold mb-0">Đang bị khóa</p>`;
					case 4:
						return `<p class="text-warning font-weight-bold mb-0">Đang bị khóa</p>`;
				}
			},
			renderHistoryDetailFee: function (fee) {
				switch (fee) {
					case 0:
						return `Người nhận`;
					case 1:
						return `Người gửi`;
				}
			},
			// RENDER TRẠNG THÁI TÀI KHOẢN
			renderAccountStatus: function (status) {
				switch (status) {
					case 0:
						return `<p class="text-primary font-weight-bold mb-0">Đang chờ kích hoạt</p>`;
					case 1:
						return `<p class="text-success font-weight-bold mb-0">Đã kích hoạt</p>`;
					case 2:
						return `<p class="text-danger font-weight-bold mb-0">Đã bị vô hiệu hóa</p>`;
					case 5:
						return `<p class="text-warning font-weight-bold mb-0">Đang bị khóa</p>`;
				}
			},
			// RENDER TRẠNG THÁI GIAO DỊCH
			renderTransactionStatus: function (status) {
				switch (status) {
					case 0:
						return `<p class="text-primary font-weight-bold mb-0">Đang chờ duyệt</p>`;
					case 1:
						return `<p class="text-success font-weight-bold mb-0">Đã duyệt</p>`;
					case 2:
						return `<p class="text-danger font-weight-bold mb-0">Đã hủy</p>`;
				}
			},
			getDateTimeString: function (lockDateTime) {
				// return lockDateTime.toLocaleDateString("vi-VI");
				// var dateTimeString =
				// 	lockDateTime.getUTCFullYear() +
				// 	"/" +
				// 	("0" + (lockDateTime.getUTCMonth() + 1)).slice(-2) +
				// 	"/" +
				// 	("0" + lockDateTime.getUTCDate()).slice(-2) +
				// 	" " +
				// 	("0" + lockDateTime.getUTCHours()).slice(-2) +
				// 	":" +
				// 	("0" + lockDateTime.getUTCMinutes()).slice(-2) +
				// 	":" +
				// 	("0" + lockDateTime.getUTCSeconds()).slice(-2);
				var dateTimeString =
					("0" + lockDateTime.getUTCDate()).slice(-2) +
					"/" +
					("0" + (lockDateTime.getUTCMonth() + 1)).slice(-2) +
					"/" +
					lockDateTime.getUTCFullYear() +
					" " +
					("0" + lockDateTime.getUTCHours()).slice(-2) +
					":" +
					("0" + lockDateTime.getUTCMinutes()).slice(-2) +
					":" +
					("0" + lockDateTime.getUTCSeconds()).slice(-2);
				return dateTimeString;
			},
			getTransactionTypeString: function (type) {
				switch (parseInt(type)) {
					case 0:
						return "Nạp tiền";
					case 1:
						return "Rút tiền";
					case 2:
						return "Chuyển tiền";
					case 3:
						return "Nhận tiền";
					case 4:
						return "Mua thẻ điện thoại";
				}
			},
			getPriceString: function (price) {
				return parseInt(price).toLocaleString("vi-VN", {
					style: "currency",
					currency: "VND",
				});
			},
			// Helpers if equal
			ifEqual: function (value1, value2, options) {
				if (value1 === value2) {
					return options.fn(this);
				}
				return options.inverse(this);
			},
			// Helpers if not equal
			renderHistoryDetailFee: function (fee) {
                switch (fee) {
                    case 0:
                        return `Người nhận`;
                    case 1:
                        return `Người gửi`;
                }
            },
		},
	})
);
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "resources", "views"));

// Add middlewares  to get post request body
app.use(
	express.urlencoded({
		extended: true,
	})
);

app.use(express.json());

// Cookie
app.use(require("cookie-parser")(credentials.COOKIE_SECRET));

// Session
app.use(
	require("express-session")({
		secret: "keyboard cat",
		resave: false,
		saveUninitialized: true,
	})
);
// Flash
app.use(flash());
app.use((req, res, next) => {
	res.locals.success = req.flash("success");
	res.locals.error = req.flash("error");
	next();
});
// Route
route(app);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
	console.log(`>>> App listening on port ${PORT}`);
});
