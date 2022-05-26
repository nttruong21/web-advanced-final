const express = require("express");
const { engine } = require("express-handlebars");
const path = require("path");
const morgan = require("morgan");
require("dotenv").config();
const credentials = require("./cookie/credentials");
const route = require("./routes/index");
const db = require("./config/database/db");

const app = express();

db.connect();

// HTTP logger
// app.use(morgan("combined"));
// app.use(morgan("dev"));

// Use static folder
app.use(express.static(path.join(__dirname, "public")));

// Config template engine
app.engine(
    "hbs",
    engine({
        extname: "hbs",
        helpers: {
            getDateFormat: function (date) {
                return new Date(date).toLocaleDateString();
            },
            isWaitingActiveAccount: function (status) {
                return status === 0;
            },
            isLockingAccount: function (status) {
                return status === 5;
            },
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
