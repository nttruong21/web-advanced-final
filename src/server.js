require("dotenv").config();

const app = require("./app");

const db = require("./config/database/db");

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}.`);
});

//  Lỗi khi kết nối database sai
process.on("unhandledRejection", (err) => {
  console.log(`Unhandled rejection: ${err.message}`);
  server.close(() => process.exit(1));
});
