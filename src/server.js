require("dotenv").config();

// Show lỗi hệ thống hỏng và ngắt kết nối
process.on("uncaughtException", (err) => {
  console.log(`Uncaught exception: ${err.message}`);
  process.exit(1);
});
// Ví dụ như
// const x = 1;
// x = 2;

const app = require("./app");

// Gọi kết nói database
const db = require("./config/database/db");

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}.`);
});

//  Lỗi khi kết nối database sai
process.on("unhandledRejection", (err) => {
  console.log(`Unhandled rejection: ${err.message}`);
  //   Đóng server và thoát tiến trình
  server.close(() => process.exit(1));
});
