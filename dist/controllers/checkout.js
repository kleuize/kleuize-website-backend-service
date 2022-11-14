"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.chechoutInitialize = exports.chechoutController = void 0;
//@ts-ignore
const Checkout = __importStar(require("../services/iyzipay/methods/currentPaymentMethod/checkout.ts"));
const user_1 = __importDefault(require("../models/user"));
const Course_1 = __importDefault(require("../models/Course"));
//@ts-ignore
const iyzipay_1 = __importDefault(require("iyzipay"));
const nanoid_1 = require("nanoid");
const completePayments_1 = require("../utils/completePayments");
const chechoutController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let result = yield Checkout.getFormPayment({
        locale: "tr",
        converSationId: (0, nanoid_1.nanoid)(),
        token: req.body.token,
    });
    yield (0, completePayments_1.CompletePayment)(result);
    res.json(result);
});
exports.chechoutController = chechoutController;
const chechoutInitialize = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { city, country, address, zipCode, courseId } = req.body;
    let user = yield user_1.default.findById(req.auth._id).exec();
    //@ts-ignore
    const course = yield Course_1.default.find({ courseId });
    const paidPrice = course.price * 1.2;
    const data = {
        locale: "tr",
        conversationId: (0, nanoid_1.nanoid)(),
        price: course.price,
        paidPrice: paidPrice,
        currency: "TRY",
        installment: "1",
        paymentChannel: iyzipay_1.default.PAYMENT_CHANNEL.WEB,
        enabledInstallments: [1, 2, 3, 6, 9],
        paymentGroup: iyzipay_1.default.PAYMENT_GROUP.PRODUCT,
        callbackUrl: `http://localhost:5000/checkout/complete/payment`,
        buyer: {
            id: user._id,
            name: user.name,
            surname: user.surName,
            email: user.email,
            identityNumber: " 74300864791",
            registrationAddress: address,
            ip: "85.127.1.1",
            city: city,
            country: country,
            zipCode: zipCode,
        },
        shippingAddress: {
            contactName: user.name + " " + user.surName,
            city: city,
            country: country,
            address: address,
            zipCode: zipCode,
        },
        billingAddress: {
            contactName: user.name + " " + user.surName,
            city: city,
            country: country,
            address: address,
            zipCode: zipCode,
        },
        basketItems: {
            id: course._id,
            name: course.name,
            category1: course.category,
            itemType: iyzipay_1.default.BASKET_ITEM_TYPE.VIRTUAL,
            price: course.price,
        },
    };
    let result = yield Checkout.initializeCheckoutPayment(data);
    console.log(result);
    //@ts-ignore
    res.json(result.chechoutFormContent);
    const html = `<!DOCTYPE html>
<html>
<head>
<title>Ödeme Yap</title>
<meta charset="UTF-8" />

</head>
</html>
`;
});
exports.chechoutInitialize = chechoutInitialize;
// ${result?.checkoutFormContent}
//# sourceMappingURL=checkout.js.map