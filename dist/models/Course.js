"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const answerSchema = new mongoose_1.Schema({
    text: {
        type: String,
        required: [true, "Please add a text!"],
        trim: true,
        maxlength: [50, "Text can not be more than 50 characters"],
    },
    isCorrect: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });
const questionSchema = new mongoose_1.Schema({
    content: {
        type: String,
        trim: true,
        minlength: 3,
        maxlength: 320,
        required: true,
    },
    answers: {
        type: [answerSchema],
        validate: {
            validator: (value) => {
                return value && value.length === 4;
            },
            message: "Answers length should be 4!",
        },
    },
}, { timestamps: true });
const quizSchema = new mongoose_1.Schema({
    quizTitle: {
        type: String,
        trim: true,
        minlength: 3,
        maxlength: 320,
        required: true,
    },
    questions: {
        type: [questionSchema],
        validate: {
            validator: (value) => {
                return value && value.length >= 1 && value.length <= 10;
            },
            message: "Questions length should be between 1 and 10!",
        },
    },
}, { timestamps: true });
const lessonSchema = new mongoose_1.Schema({
    lessonTitle: {
        type: String,
        trim: true,
        minlength: 3,
        maxlength: 320,
        required: true,
    },
    slug: {
        type: String,
        lowercase: true,
    },
    quiz: [quizSchema],
    free_preview: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });
const courseSchema = new mongoose_1.Schema({
    name: {
        type: String,
        trim: true,
        minlength: 3,
        maxlength: 320,
        required: true,
    },
    slug: {
        type: String,
        lowercase: true,
    },
    description: {
        type: {},
        minlength: 200,
        required: true,
    },
    price: {
        type: Number,
        default: 9.99,
    },
    image: {},
    category: String,
    published: {
        type: Boolean,
        default: false,
    },
    paid: {
        type: Boolean,
        default: true,
    },
    instructor: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    lessons: [lessonSchema],
}, { timestamps: true });
exports.default = (0, mongoose_1.model)("Course", courseSchema);
//# sourceMappingURL=Course.js.map