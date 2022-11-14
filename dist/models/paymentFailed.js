"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const PaymentFailedSchema = new mongoose_1.Schema({
    status: {
        type: String,
        required: true,
        enum: ["failure"],
    },
    conversationId: {
        type: String,
        required: false,
    },
    errorCode: {
        type: String,
        required: true,
    },
    errorMessage: {
        type: String,
        required: true,
    },
    log: {
        type: mongoose_1.Schema.Types.Mixed,
        required: true,
    },
}, { timestamps: true });
exports.default = (0, mongoose_1.model)("PaymentFailed", PaymentFailedSchema);
//# sourceMappingURL=paymentFailed.js.map