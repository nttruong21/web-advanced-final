const express = require("express");
const { engine } = require("express-handlebars");
require("dotenv").config();
const credentials = require("./cookie/credentials");

const app = express();

// Config template engine
app.engine(
    "hbs",
    engine({
        extname: "hbs",
        defaultLayout: "main",
    })
);
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views"));

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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}.`);
});
