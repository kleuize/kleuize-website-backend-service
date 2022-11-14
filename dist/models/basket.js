"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const BasketSchema = new mongoose_1.Schema({
    completed: {
        type: Boolean,
        default: false,
        required: true,
    },
    buyer: {
        type: mongoose_1.Types.ObjectId,
        ref: "User",
        required: true,
    },
    products: {
        type: [mongoose_1.Types.ObjectId],
        ref: "Course",
        required: true,
    },
    currency: {
        type: String,
        required: true,
        default: "TRY",
        enum: ["TRY", "USD", "EUR"],
    },
}, { timestamps: true });
exports.default = (0, mongoose_1.model)("Basket", BasketSchema);
//# sourceMappingURL=basket.js.map