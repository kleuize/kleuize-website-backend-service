"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const quizSchema = new mongoose_1.Schema({
    score: { type: Number },
    quizId: { type: String },
}, { timestamps: true });
const completedSchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.Types.ObjectId,
        ref: "User",
    },
    course: {
        type: mongoose_1.Types.ObjectId,
        ref: "Course",
    },
    quiz: [quizSchema],
}, { timestamps: true });
exports.default = (0, mongoose_1.model)("Completed", completedSchema);
//# sourceMappingURL=completed.js.map