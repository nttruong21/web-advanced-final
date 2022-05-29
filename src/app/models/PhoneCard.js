const mongoose = require("mongoose");
const { Schema } = mongoose;

const phoneCardSchema = new Schema(
	{
		phoneCardCode: { type: String },
		price: { type: Number },
		phoneServiceProviderCode: { type: String },
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model("PhoneCard", phoneCardSchema);
