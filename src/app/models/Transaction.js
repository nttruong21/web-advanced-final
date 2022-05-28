const mongoose = require("mongoose");
const { Schema } = mongoose;

const transactionSchema = new Schema(
	{
		transactionType: { type: Number }, // 0 nạp tiền, 1 rút tiền, 2 chuyển tiền
		price: { type: Number },
		status: { type: Number }, // 0 chờ xử lý, 1 thành công, 2 hủy,
		senderPhone: { type: String },
		senderName: { type: String },
		receiverPhone: { type: String },
		message: { type: String },
		phoneCardCode: { type: String }, // Mã thẻ cào (viettel, vinaphone, mobifone)
		phoneCardQuantity: { type: Number }, // Số lượng thẻ cào
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
