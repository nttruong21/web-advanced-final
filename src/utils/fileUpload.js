const multer = require("multer");
const path = require("path");
//set storage Engine
const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, "./src/public/uploads");
	},
	filename: function (req, file, cb) {
		cb(
			null,
			file.fieldname + "-" + Date.now() + path.extname(file.originalname)
		);
	},
});
// Init upload
const upload = multer({ storage: storage, limits: 20 });
const multipleUpload = upload.fields([
	{ name: "frontIdCard", maxCount: 1 },
	{ name: "backIdCard", maxCount: 1 },
]);
module.exports = multipleUpload;
