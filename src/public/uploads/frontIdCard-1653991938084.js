const Account = require('../models/account');
const catchAsync = require('../../utils/catchAsync');
const { promisify } = require('util');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const sendMail = require('../../utils/email');

// Các hàm sử dụng
// -------------------------------------------------------------------------
const response = (res, statusCode, status, message) => {
  return res.status(statusCode).json({
    status,
    message,
  });
};
const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

const randomPassword = (length) => {
  let result = '';
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};
// end các hàm sử dụng
// -------------------------------------------------------------------------

// Bảo vệ routes
exports.protect = catchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }
  if (!token) {
    response(
      res,
      401,
      'fail',
      'Bạn chưa đăng nhập! Xin vui lòng đăng nhập để tiếp tục'
    );
  }

  // Verify token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // Check if user still exists
  const account = await Account.findById(decoded.id).select(
    '+isChangedPassword'
  );

  if (!account) {
    response(res, 401, 'fail', 'Tài khoản có token này không tồn tại!');
  }
  // Grant access to protected route
  req.account = account;
  // Check if user changed password after the token was issued
  if (account.isChangedPassword === 0) {
    response(res, 401, 'fail', 'Bạn chưa đổi mật khẩu!');
  }

  next();
});

// Đăng nhập
exports.login = catchAsync(async (req, res, next) => {
  const { username, password } = req.body;
  if (!username || !password) {
    response(res, 400, 'fail', 'Vui lòng nhập đầy đủ thông tin đăng nhập');
  }

  const user = await Account.findOne({ username }).select('+password');

  if (!user || !(await user.comparePassword(password, user.password))) {
    response(res, 401, 'fail', 'Tài khoản hoặc mật khẩu không đúng!');
  }
  user.password = undefined;

  // Đăng ký token
  const token = signToken(user._id);

  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: true,
  };

  // Nếu đăng nhập thành công thì gửi token vào cookie
  res.cookie('jwt', token, cookieOptions);

  res.status(200).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
});

// Đăng ký
exports.signup = catchAsync(async (req, res, next) => {
  if (req.body.username) req.body.username = undefined;
  if (req.body.password) req.body.password = undefined;
  const newUser = await Account.create(req.body);

  // random 10 number
  const username = Math.floor(Math.random() * 10000000000).toString();
  const password = randomPassword(6);
  // 3) Send it to user's email

  const resetURL = `${req.protocol}://${req.get('host')}/login`;

  const message = `Tài khoản của bạn : ${username} \n
  Mật khẩu của bạn : ${password} \n
  Vui lòng truy cập : ${resetURL} để đăng nhập.\n`;

  try {
    await sendMail({
      email: newUser.email,
      subject: 'Tài khoản và mật khẩu đăng nhập của bạn',
      message,
    });

    res.status(200).json({
      status: 'success',
      message: ' sent to email!',
      newUser,
    });
  } catch (err) {
    newUser.username = undefined;
    newUser.password = undefined;
    await newUser.save({ validateBeforeSave: false });

    response(res, 500, 'fail', 'Không thể gửi mail');
  }
  newUser.username = username;
  newUser.password = password;
  await newUser.save();
});

// forgot password
exports.forgotPassword = catchAsync(async (req, res, next) => {
  // 1) Get account based on POSTed email
  const account = await Account.findOne({ email: req.body.email });
  if (!account) {
    response(res, 404, 'fail', 'Email không tồn tại');
  }

  // 2) Tạo chuỗi token ngẫu nhiên
  const resetToken = account.createPasswordResetToken();
  await account.save({ validateBeforeSave: false });

  // 3) Send it to user's email
  const resetURL = `${req.protocol}://${req.get(
    'host'
  )}/resetPassword/${resetToken}`;

  const message = `Bạn đã quên mật khẩu? Hãy gửi nhập lại mật khẩu của bạn mới tại đây: 
  ${resetURL}.\nNếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.`;

  try {
    await sendMail({
      email: account.email,
      subject: 'Mã đặt lại mật khẩu của bạn có giá trong 10 phút',
      message,
    });

    response(res, 200, 'success', 'Đã gửi mail');
  } catch (err) {
    account.passwordResetToken = undefined;
    account.passwordResetExpires = undefined;
    await account.save({ validateBeforeSave: false });

    response(res, 500, 'fail', 'Không thể gửi mail');
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  // 1) Get user based on the token
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const account = await Account.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  // 2) If token has not expired, and there is user, set the new password
  if (!account) {
    response(res, 400, 'fail', 'Mã đặt lại mật khẩu đã hết hạn');
  }

  account.password = req.body.password;
  account.passwordResetToken = undefined;
  account.passwordResetExpires = undefined;
  await account.save();

  // 3) Update changedPasswordAt property for the user
  response(res, 200, 'success', 'Đã đặt lại mật khẩu thành công');
});
