const mongoose = require("mongoose");
const { Schema } = mongoose;
const PhoneCard = require("./PhoneCard");

const transactionSchema = new Schema(
	{
		transactionType: { type: Number }, // 0 nạp tiền, 1 rút tiền, 2 chuyển tiền, 3 mua thẻ điện thoại
		price: { type: Number },
		status: { type: Number }, // 0 chờ duyệt, 1 thành công, 2 hủy,
		senderPhone: { type: String },
		senderName: { type: String },
		receiverPhone: { type: String },
		receiverName: { type: String },
		message: { type: String },
		phoneCardCode: [{ type: Schema.Types.ObjectId, ref: "PhoneCard" }], // Thẻ cào
		phoneCardQuantity: { type: Number }, // Số lượng thẻ cào (<=5)
		transactionFee: { type: Number },
		isFeeForSender: { type: Number }, // 0 người gửi, 1 người nhận
		cardNumber: { type: String },
		cardExpirationDate: { type: Date },
		cvv: { type: String },
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model("Transaction", transactionSchema);
