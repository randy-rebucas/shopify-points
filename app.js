var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
var indexRouter = require('./routes/index');
var installRouter = require('./routes/install');

var exphbs = require("express-handlebars");
var app = express();

// view engine setup
app.engine("hbs", exphbs({
  defaultLayout: "main",
  extname: ".hbs",
  helpers: {
    select: function (value, options) {
      return (value == this.value) ? 'selected="selected"' : '';
    },
    bar: function () { return 'BAR!'; }
  },
  // helpers: require("./helpers/hbs-helpers.js").helpers, // same file that gets used on our client
  partialsDir: "views/partials/", // same as default, I just like to be explicit
  layoutsDir: "views/layouts/" // same as default, I just like to be explicit
}));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(cors());

app.use('/', indexRouter);
app.use('/install', installRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
