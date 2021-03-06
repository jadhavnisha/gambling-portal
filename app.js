var flash = require('express-flash');
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const models = require('./models/index');
const _ = require('underscore')

var users = require('./routes/users');
var contests = require('./routes/contests');
var index = require('./routes/index');
var games = require('./routes/games');
var contestants = require('./routes/contestants');

var app = express();
app.use(cookieParser())

app.use(session({
  name: 'server-session-cookie-id',
  secret: 'my express secret',
  saveUninitialized: true,
  resave: true,
  store: new FileStore()
}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(flash());

auth = function(req, res, next) {
  var nonSecurePaths = ['/', '/signin', '/signup', '/download'];
  if ( _.contains(nonSecurePaths, req.path) ) return next();

  if (req.session.userId){
    models.user.getById(req.session.userId)
    .then(user => {
      req.user = user;
      return next();
    });
  } else {
    req.flash('info', 'Session timeout, Please signin again.');
    res.redirect('/signin');
  }
};

onlyAdmin = function(req, res, next) {
  if (req.session.isAdmin)
      return next();
  res.send('ur not admin');
}
app.use('/',auth)
app.use('/admin', onlyAdmin)

app.use('/', users);
app.use('/', contests);
app.use('/', index);
app.use('/', games);
app.use('/', contestants);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
	console.log(err);
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
