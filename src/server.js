const express = require("express");
const { engine } = require("express-handlebars");
const path = require("path");
const morgan = require("morgan");
require("dotenv").config();
const credentials = require("./cookie/credentials");
const route = require("./routes/index");
const db = require("./config/database/db");

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
			// KIỂM TRA CÓ PHẢI GIAO DỊCH RÚT TIỀN
			isWithdrawalTransaction: function (type) {
				return type === 1;
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
			getDateString: function (lockDateTime) {
				// return lockDateTime.toLocaleDateString("vi-VI");
				var dateTimeString =
					lockDateTime.getUTCFullYear() +
					"/" +
					("0" + (lockDateTime.getUTCMonth() + 1)).slice(-2) +
					"/" +
					("0" + lockDateTime.getUTCDate()).slice(-2) +
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

// Route
route(app);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
	console.log(`>>> App listening on port ${PORT}`);
});
