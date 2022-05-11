const siteRoute = require("./site");
const accountRoute = require("./accountRoutes");
function route(app) {
  // Tương tự các route như account, ... sẽ khai báo ở đây
  app.use("/", siteRoute);
  app.use("/api/accounts", accountRoute);
}

module.exports = route;
