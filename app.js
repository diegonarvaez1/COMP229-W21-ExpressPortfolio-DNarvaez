// my 3rd party packages
let createError = require('http-errors');
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');

// authentication modules
let session = require('express-session');
let passport = require('passport');
let passportLocal = require('passport-local');
let localStrategy = passportLocal.Strategy;
let flash = require('connect-flash');


//database setup
let mongoose = require('mongoose');
let DB = require('./config/db');

//point mongoose to the DB URI
mongoose.connect(DB.URI,{ useNewUrlParser: true, useUnifiedTopology: true });
let mongodb = mongoose.connection;
mongodb.on('error', console.error.bind(console,'Connection error: '));
mongodb.once('open', ()=>{
  console.log('Connected to MongoDB..');
});

let indexRouter = require('./routes/index');
let usersRouter = require('./routes/users');
let contactsRouter = require('./routes/contact');
const { log } = require('console');

let app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public'))); //available for every folder
app.use(express.static(path.join(__dirname, 'node_modules')));

//setup express session
app.use(session({
  secret: "SomeSecret",
  saveUninitialized: false,
  resave: false
}));

//initialize flash
app.use(flash());

//initialize passport
app.use(passport.initialize());
app.use(passport.session());

//Passport user config
//create a User Model Instance
let userModel = require('./models/user');
let User = userModel.User;

//implement a User Authentication Strategy
passport.use(User.createStrategy());

//serialize and deserialize the User info
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


//routing
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/contactlist', contactsRouter);

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
  res.render('error', {title: 'Error'});
});

module.exports = app;
