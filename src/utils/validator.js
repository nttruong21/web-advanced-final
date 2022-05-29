const {check, body} = require("express-validator");
const Account = require("../app/models/Account");


exports.depositValidator = [
    check("cardNumber")
        .exists().withMessage("Vui lòng nhập số thẻ")
        .notEmpty().withMessage("Số thẻ không được để trống")
        .isLength({min: 6, max: 6}).withMessage("Số thẻ phải có 6 chữ số")
        .isIn(["111111","222222","333333"]).withMessage("Thẻ này không được hỗ trợ"),

    check("cardExpirationDate")
        .exists().withMessage("Vui lòng nhập ngày hết hạn thẻ")
        .notEmpty().withMessage("Vui lòng nhập ngày hết hạn thẻ")
        .isDate().withMessage("Ngày hết hạn thẻ không hợp lệ")
        .isIn(["2022-10-10", "2022-11-11", "2022-12-12"]).withMessage("Ngày hết hạn thẻ không chính xác"),  
    check("cvv")
        .exists().withMessage("Vui lòng nhập mã CVV")
        .notEmpty().withMessage("Vui lòng nhập mã CVV")
        .isLength({min: 3, max: 3}).withMessage("Mã CVV phải có 3 chữ số")
        .isNumeric().withMessage("Mã CVV không hợp lệ")
        .isIn([411,443,577]).withMessage("Mã CVV không chính xác"),

    check("price")
        .exists().withMessage("Vui lòng nhập số tiền nạp")
        .notEmpty().withMessage("Vui lòng nhập số tiền nạp")
        .isNumeric().withMessage("Số tiền nạp không hợp lệ (Phải là số nguyên)")
        .isInt({min: 1000}).withMessage("Số tiền nạp tối thiểu là 1000 vnđ"),

];

exports.withdrawValidator = [
    check("cardNumber")
        .exists().withMessage("Vui lòng nhập số thẻ")
        .notEmpty().withMessage("Số thẻ không được để trống")
        .isLength({min: 6, max: 6}).withMessage("Số thẻ phải có 6 chữ số")
        .isIn(["111111","222222","333333"]).withMessage("Thông tin thẻ không hợp lệ")
        .not().isIn(["222222","333333"]).withMessage("Thẻ này không được hỗ trợ để rút tiền"),

    check("cardExpirationDate")
        .exists().withMessage("Vui lòng nhập ngày hết hạn thẻ")
        .notEmpty().withMessage("Vui lòng nhập ngày hết hạn thẻ")
        .isDate().withMessage("Ngày hết hạn thẻ không hợp lệ")
        .custom((value, {req}) => {
            const date1 = new Date(value);
            const date2 = new Date("10/10/2022");
            if(date1.getDate() === date2.getDate()){
                return true;
            }
            throw new Error("Ngày hết hạn thẻ không chính xác");
        }),

    check("cvv")
        .exists().withMessage("Vui lòng nhập mã CVV")
        .notEmpty().withMessage("Vui lòng nhập mã CVV")
        .isLength({min: 3, max: 3}).withMessage("Mã CVV phải có 3 chữ số")
        .isNumeric().withMessage("Mã CVV không hợp lệ")
        .isIn([411]).withMessage("Mã CVV không hợp lệ"),

    check("price")
        .exists().withMessage("Vui lòng nhập số tiền rút")
        .notEmpty().withMessage("Vui lòng nhập số tiền rút")
        .isNumeric().withMessage("Số tiền rút không hợp lệ")
        .isInt({min: 50000}).withMessage("Số tiền rút tối thiểu là 50,000 vnđ")
        .isDivisibleBy(50000).withMessage("Số tiền rút phải là bội số của 50,000 đồng"),

    check("message")
        .exists().withMessage("Vui lòng nhập lời nhắn")
        .notEmpty().withMessage("Vui lòng nhập lời nhắn")
        .isLength({min: 1, max: 100}).withMessage("Lời nhắn phải có từ 1 đến 100 ký tự"),
        
];


exports.transferValidator = [
    check("receiverPhone")
        .exists().withMessage("Vui lòng nhập số điện thoại người nhận")
        .notEmpty().withMessage("Vui lòng nhập số điện thoại người nhận")
        .isNumeric().withMessage("Số điện thoại không hợp lệ")
        // Kiểm tra số điện thoại có tồn tại trong hệ thống hay không và không trùng với của admin
        .custom((value, {req}) => {
            return Account.findOne({phone: value, role: 0}).then(account => {
                if(account){
                    if(account.status === 0){ // Tài khoản chưa kích hoạt cmnd
                        throw new Error("Tài khoản người nhận chưa đươc kích hoạt nên không thể nhận tiền. Vui lòng thử lại sau!")
                    }else if(account.status === 2){ // Tài khoản bị vô hiệu hóa
                        throw new Error("Tài khoản người nhận đã bị vô hiệu hóa nên không thể nhận tiền. Vui lòng thử lại sau!")
                    }else {

                        return true;
                    }
                }
                throw new Error("Không tìm thấy số điện thoại ngưởi nhận");
            }
        )})
        // Kiểm tra số điện thoại có trùng với sdt đang dùng hay không
        .custom((value, {req}) => {
            if(value !== req.session.account.phone){
              return true
            }
            throw new Error("Số điện thoại người nhận không được trùng với số điện thoại của bạn");
        }),
    
    check("price")
        .exists().withMessage("Vui lòng nhập số tiền chuyển")
        .notEmpty().withMessage("Vui lòng nhập số tiền chuyển")
        .isNumeric().withMessage("Số tiền chuyển không hợp lệ")
        .isInt({min: 1000}).withMessage("Số tiền chuyển tối thiểu là 1000 vnđ và phải số nguyên")
        //Kiểm tra số dư có đủ để chuyển hay không
        .custom(async (value, {req}) => { 
            const acc = await Account.findOne({phone: req.session.account.phone}).exec() ;
            if(acc){
                if(Number(acc.balance) >= Number(value)){
                    return true;
                }
                throw new Error("Số dư của bạn không đủ để chuyển tiền");
            }
            throw new Error("Không tìm thấy tài khoản của bạn");
        }),

    check("message")
        .exists().withMessage("Vui lòng nhập lời nhắn")
        .notEmpty().withMessage("Vui lòng nhập lời nhắn")
        .isLength({min: 1, max: 100}).withMessage("Lời nhắn phải có từ 1 đến 100 ký tự"),

    check("isFeeForSender")
        .exists().withMessage("Vui lòng chọn người trả phí giao dịch")
        .notEmpty().withMessage("Vui lòng chọn người trả phí giao dịch")
        .isIn([0, 1]).withMessage("Người trả phí giao dịch không hợp lệ")
        // Kiểm tra số dư xem có đủ tiền để trả phí giao dịch không nếu người gửi trả phí 
        .custom(async (value, {req}) => {
            const account = await Account.findOne({phone: req.session.account.phone});
            if(req.body.price ){
                console.log(req.body.isFeeForSender)
                if(req.body.isFeeForSender == 1){
                    if(Number(account.balance) < Number(req.body.price ) * 1.05){
                        throw new Error("Số dư của bạn không đủ để trả phí giao dịch");
                    }
                }
            }
            return true;
        }),

];


exports.otpValidator = [
    check("otp")
        .exists().withMessage("Vui lòng nhập mã otp")
        .notEmpty().withMessage("Vui lòng nhập mã otp")
        .isLength({min: 6, max: 6}).withMessage("Mã otp phải có 6 số")
        .isNumeric().withMessage("Mã otp không hợp lệ"),

];