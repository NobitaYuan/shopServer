var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors')

// 导入路由————————————————————————————————————————————————————————————————
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

// 导入商品路由
var productRouter = require('./routes/proAPI/products')
var cartRouter = require('./routes/proAPI/cart')

// 导入用户路由
var registerRouter = require('./routes/userAPI/register')
var loginRouter = require('./routes/userAPI/login')
// express
var app = express();

// 允许跨域及其他设置——————————————————————————————————————————————————————
app.use(cors())

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


// 使用路由——————————————————————————————————————————————————————————————
app.use('/', indexRouter);
app.use('/users', usersRouter);

// 商品路由
app.use('/proapi/pro',productRouter)
// 购物车接口
app.use('/proapi/cart',cartRouter)

// 用户接口
app.use('/userapi/register',registerRouter)
app.use('/userapi/login',loginRouter)


// catch 404 and forward to error handler———————————————————————————————
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
