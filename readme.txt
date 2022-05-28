npm start
npm run watch





-	Giao dịch: 
o	id: string
o	transactionType: int -> loại giao dịch (nạp tiền - 0, rút tiền - 1, chuyển tiền - 2, nhận tiền - 3, mua thẻ điện thoại - 4)
o	createdAt: date -> ngày thực hiện
o	price: double -> số tiền
o	status: int -> trạng thái (chờ duyệt - 0, đã duyệt - 1, bị hủy - 2)
o	senderPhone: string -> sdt người gửi
o	receiverPhone: string -> sdt người nhận
o	message: string -> lời nhắn
o	phoneCardCode: string -> mã thẻ điện thoại
o	phoneCardQuantity: int -> số lượng mã thẻ điện thoại (<= 5)
o	transactionFee: double -> phí giao dịch


-----Giao dịch nạp tiền
----- POST nạp tiền


----- Giao dịch rút tiền
-----  POST rút tiền
cardNumber: số thẻ
cardExpirationDate: ngày hết hạn
cvv: mã thẻ
price: số tiền rút
message: ghi chú

-------- Tài khoản--
trừ tiền nếu < 5tr, còn lại đéo trừ ( chờ duyệt)
TH: Nếu tài khoản đã rút hết tiền và vẫn còn lệnh chờ duyệt rút tiền --> auto hủy
Chưa xử lí giới hạn 2 lần rút tiền mỗi ngày
-- ----
transactionType:
price:
status
senderPhone: 
senderName: 
message:
transactionFee:
cardNumber:
cardExpirationDate:
cvv:
------ Nạp tiền
------ Giao dịch nạp tiền
transactionType
price
status
senderPhone
senderName
cardNumber
cardExpirationDate
cvv