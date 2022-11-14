"use strict";
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
exports.CompletePayment = void 0;
const mongoose_1 = require("mongoose");
const basket_1 = __importDefault(require("../models/basket"));
const paymentFailed_1 = __importDefault(require("../models/paymentFailed"));
const paymentSuccess_1 = __importDefault(require("../models/paymentSuccess"));
const { ObjectId } = mongoose_1.Types;
const CompletePayment = (result) => __awaiter(void 0, void 0, void 0, function* () {
    if ((result === null || result === void 0 ? void 0 : result.status) === "success") {
        yield basket_1.default.updateOne({
            //@ts-ignore
            _id: ObjectId(result === null || result === void 0 ? void 0 : result.basketId),
        }, {
            $set: {
                completed: true,
            },
        });
        yield paymentSuccess_1.default.create({
            status: result.status,
            cartId: result === null || result === void 0 ? void 0 : result.basketId,
            conversationId: result === null || result === void 0 ? void 0 : result.conversationId,
            currency: result === null || result === void 0 ? void 0 : result.currency,
            paymentId: result === null || result === void 0 ? void 0 : result.paymentId,
            price: result === null || result === void 0 ? void 0 : result.price,
            paidPrice: result === null || result === void 0 ? void 0 : result.paidPrice,
            itemTransactions: result === null || result === void 0 ? void 0 : result.itemTransactions.map((item) => {
                return {
                    itemId: item === null || item === void 0 ? void 0 : item.itemId,
                    paymentTransactionId: item === null || item === void 0 ? void 0 : item.paymentTransactionId,
                    price: item === null || item === void 0 ? void 0 : item.price,
                    paidPrice: item === null || item === void 0 ? void 0 : item.paidPrice,
                };
            }),
            log: result,
        });
    }
    else {
        yield paymentFailed_1.default.create({
            status: result === null || result === void 0 ? void 0 : result.status,
            conversationId: result === null || result === void 0 ? void 0 : result.conversationId,
            errorCode: result === null || result === void 0 ? void 0 : result.errorCode,
            errorMessage: result === null || result === void 0 ? void 0 : result.errorMessage,
            log: result,
        });
    }
});
exports.CompletePayment = CompletePayment;
//# sourceMappingURL=completePayments.js.map