const {check, body} = require("express-validator");




exports.depositValidator = [
    check("cardNumber")
        .exists().withMessage("Vui lòng nhập số thẻ")
        .notEmpty().withMessage("Số thẻ không được để trống")
        .isLength({min: 6, max: 6}).withMessage("Số thẻ phải có 6 chữ số")
        .isIn(["111111","222222","333333"]).withMessage("Thẻ này không được hỗ trợ"),
        //.not().isIn(["333333"]).withMessage("Thẻ hết tiền"),

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


exports.transferValidator = () => {
    return [
        1,1
    ]
}
