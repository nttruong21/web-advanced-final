const siteRoute = require("./site");

function route(app) {
    // Tương tự các route như account, ... sẽ khai báo ở đây
    app.use("/", siteRoute);
}

module.exports = route;
