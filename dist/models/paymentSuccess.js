"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const ItemTransactionSchema = new mongoose_1.Schema({
    courseId: {
        type: mongoose_1.Types.ObjectId,
        ref: "Course",
        required: true,
    },
    paymentTransactionId: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    paidPrice: {
        type: Number,
        required: true,
    },
});
const PaymentSuccessSchema = new mongoose_1.Schema({
    status: {
        type: String,
        required: true,
        enum: ["success"],
    },
    conversationId: {
        type: String,
        required: false,
    },
    currency: {
        type: String,
        required: true,
        enum: ["TRY", "USD", "EUR"],
    },
    paymentId: {
        type: Number,
        required: true,
        unique: true,
    },
    price: {
        type: Number,
        required: true,
    },
    paidPrice: {
        type: Number,
        required: true,
    },
    ItemTransactions: [ItemTransactionSchema],
    log: {
        type: mongoose_1.Schema.Types.Mixed,
        required: true,
    },
}, {
    timestamps: true,
});
exports.default = (0, mongoose_1.model)("PaymentsSuccess", PaymentSuccessSchema);
//# sourceMappingURL=paymentSuccess.js.map