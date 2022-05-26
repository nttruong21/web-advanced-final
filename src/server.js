require("dotenv").config();

const app = require("./app");

const db = require("./config/database/db");

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}.`);
});
