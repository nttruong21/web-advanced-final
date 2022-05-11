const Account = require("../models/account");
const catchAsync = require("../../utils/catchAsync");
const jwt = require("jsonwebtoken");
const sendMail = require("../../utils/email");

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

exports.login = catchAsync(async (req, res, next) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return next(new AppError("Please provide username and password", 400));
  }
  const user = await Account.findOne({ username }).select("+password");
  if (!user || !(await user.comparePassword(password, user.password))) {
    return next(new AppError("Invalid username or password", 401));
  }
  user.password = undefined;
  const token = signToken(user._id);
  res.status(200).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
});

const randomPassword = (length) => {
  let result = "";
  const characters = "abcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

exports.signup = catchAsync(async (req, res, next) => {
  if (req.body.username) req.body.username = undefined;
  if (req.body.password) req.body.password = undefined;
  const newUser = await Account.create(req.body);

  // random 10 number
  const username = Math.floor(Math.random() * 10000000000).toString();
  const password = randomPassword(6);
  // 3) Send it to user's email

  const resetURL = `${req.protocol}://${req.get("host")}/login`;

  const message = `Tài khoản của bạn : ${username} \n
  Mật khẩu của bạn : ${password} \n
  Vui lòng truy cập : ${resetURL} để đăng nhập.\n`;

  newUser.username = username;
  newUser.password = password;
  await newUser.save();

  try {
    await sendMail({
      email: newUser.email,
      subject: "Tài khoản và mật khẩu đăng nhập của bạn",
      message,
    });

    res.status(200).json({
      status: "success",
      message: " sent to email!",
      newUser,
    });
  } catch (err) {
    newUser.username = undefined;
    newUser.password = undefined;
    await newUser.save({ validateBeforeSave: false });

    return next(
      new AppError("Lỗi trong quá trình gửi mail . Vui lòng thử lại!", 500)
    );
  }
});
