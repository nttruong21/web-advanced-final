const mongoose = require("mongoose");

const DB = process.env.DB_CONNECTION_STRING;

const connection = mongoose
  .connect(DB, {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("Database connection successful");
  });
//   .catch((err)  được ném vào process.on("unhandledRejection") ở server.js

module.exports = connection;
