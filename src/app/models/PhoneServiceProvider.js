const mongoose = require("mongoose");
const { Schema } = mongoose;

const phoneServiceProviderSchema = new Schema(
    {
        phoneServiceProviderCode: { type: String },
        phoneServiceProviderName: { type: String },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model(
    "phoneServiceProvider",
    phoneServiceProviderSchema
);
