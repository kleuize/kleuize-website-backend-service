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
exports.studentCount = exports.instructorCourses = exports.currentInstructor = exports.getAccountStatus = exports.makeInstructor = void 0;
const user_1 = __importDefault(require("../models/user"));
const course_1 = __importDefault(require("../models/course"));
const query_string_1 = __importDefault(require("query-string"));
const stripe_1 = __importDefault(require("stripe"));
const config = {};
const stripes = new stripe_1.default.Stripe(process.env.STRIPE_SECRET, config);
const makeInstructor = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // 1. find user from db
        const user = yield user_1.default.findById(req.auth._id).exec();
        console.log("user", user);
        if (!user.stripe_account_id) {
            const account = yield stripes.accounts.create({ type: "standard" });
            // console.log('ACCOUNT => ', account.id)
            user.stripe_account_id = account.id;
            user.save();
        }
        let accountLink = yield stripes.accountLinks.create({
            account: user.stripe_account_id,
            refresh_url: process.env.STRIPE_REDIRECT_URL,
            return_url: process.env.STRIPE_REDIRECT_URL,
            type: "account_onboarding",
        });
        // 3. create account link based on account id (for frontend to complete onboarding)
        // 4. pre-fill any info such as email (optional), then send url resposne to frontend
        accountLink = Object.assign(accountLink, {
            "stripe_user[email]": user.email,
        });
        // 5. then send the account link as response to fronend
        res.send(`${accountLink.url}?${query_string_1.default.stringify(accountLink)}`);
    }
    catch (err) {
        console.log("MAKE INSTRUCTOR ERR ", err);
    }
});
exports.makeInstructor = makeInstructor;
const getAccountStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield user_1.default.findById(req.auth._id).exec();
        const account = yield stripes.accounts.retrieve(user.stripe_account_id);
        // console.log("ACCOUNT => ", account);
        if (!account.charges_enabled) {
            return res.status(401).send("Unauthorized");
        }
        else {
            const statusUpdated = yield user_1.default.findByIdAndUpdate(user._id, {
                stripe_seller: account,
                $addToSet: { role: "Instructor" },
            }, { new: true })
                .select("-password")
                .exec();
            res.json(statusUpdated);
        }
    }
    catch (err) {
        console.log(err);
    }
});
exports.getAccountStatus = getAccountStatus;
const currentInstructor = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let user = yield user_1.default.findById(req.auth._id).select("-password").exec();
        console.log("CURRENT INSTRUCTOR => ", user);
        if (!user.role.includes("Instructor")) {
            return res.sendStatus(403);
        }
        else {
            res.json({ ok: true });
        }
    }
    catch (err) {
        console.log(err);
    }
});
exports.currentInstructor = currentInstructor;
const instructorCourses = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const courses = yield course_1.default.find({ instructor: req.auth._id })
            .sort({ createdAt: -1 })
            .exec();
        res.json(courses);
    }
    catch (err) {
        console.log(err);
    }
});
exports.instructorCourses = instructorCourses;
const studentCount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield user_1.default.find({ courses: req.auth.courseId })
            .select("_id")
            .exec();
        res.json(users);
    }
    catch (err) {
        console.log(err);
    }
});
exports.studentCount = studentCount;
//# sourceMappingURL=instructor.js.map