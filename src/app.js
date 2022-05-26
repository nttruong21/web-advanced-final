const express = require('express');
const { engine } = require('express-handlebars');
const path = require('path');
const morgan = require('morgan');

const credentials = require('./cookie/credentials');

const app = express();

const routes = require('./routes/index');

// HTTP logger
// app.use(morgan("combined"));
app.use(morgan('dev'));

// Use static folder
app.use(express.static(path.join(__dirname, 'public')));

// Config template engine
app.engine(
  'hbs',
  engine({
    extname: 'hbs',
    defaultLayout: 'main',
  })
);
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'resources', 'views'));

// Add middlewares  to get post request body
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(express.json());

// Cookie
app.use(require('cookie-parser')(credentials.COOKIE_SECRET));

// Session
app.use(
  require('express-session')({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
  })
);

routes(app);

// Custom 404
app.all('*', (req, res, next) => {
  res.status(404).json({
    status: 'fail',
    message: `Can't find ${req.originalUrl} on this server!`,
  });
});

// Custom 500 error
app.use((err, req, res, next) => {
  res.status(500).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
});

module.exports = app;
