//  Custom lỗi của ứng dụng
class AppError extends Error {
  constructor(message, statusCode) {
    //   Gọi contructor Error truyền lỗi message
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error"; // fail là không có , error là lỗi hệ thống
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor); // <=> this.stack , show stack trace
  }
}
module.exports = AppError;
