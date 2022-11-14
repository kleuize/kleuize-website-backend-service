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
exports.userCourses = exports.stripeSuccess = exports.paidEnrollment = exports.freeEnrollment = exports.checkEnrollment = exports.allQuiz = exports.courses = exports.unpublishCourse = exports.publishCourse = exports.updateLesson = exports.removeLesson = exports.update = exports.createQuiz = exports.addLesson = exports.getQuiz = exports.read = exports.create = exports.removeImage = exports.uploadImage = void 0;
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const course_1 = __importDefault(require("../models/course"));
var slugify = require('slugify');
const nanoid_1 = require("nanoid");
const user_1 = __importDefault(require("../models/user"));
const stripe_1 = __importDefault(require("stripe"));
const config = {};
const stripes = new stripe_1.default.Stripe(process.env.STRIPE_SECRET, config);
const awsConfig = {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
    apiVersion: process.env.AWS_API_VERSION,
};
const S3 = new aws_sdk_1.default.S3(awsConfig);
const uploadImage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // console.log(req.body);
    try {
        const { image } = req.body;
        if (!image)
            return res.status(400).send("No image");
        // prepare the image
        //@ts-ignore
        const base64Data = new Buffer.from(image.replace(/^data:image\/\w+;base64,/, ""), "base64");
        const type = image.split(";")[0].split("/")[1];
        // image params
        const params = {
            Bucket: "kleuize-bucket",
            Key: `${(0, nanoid_1.nanoid)()}.${type}`,
            Body: base64Data,
            ACL: "public-read",
            ContentEncoding: "base64",
            ContentType: `image/${type}`,
        };
        // upload to s3
        S3.upload(params, (err, data) => {
            if (err) {
                console.log(err);
                return res.sendStatus(400);
            }
            console.log(data);
            res.send(data);
        });
    }
    catch (err) {
        console.log(err);
    }
});
exports.uploadImage = uploadImage;
const removeImage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { image } = req.body;
        // image params
        const params = {
            Bucket: image.Bucket,
            Key: image.Key,
        };
        // send remove request to s3
        S3.deleteObject(params, (err, data) => {
            if (err) {
                console.log(err);
                res.sendStatus(400);
            }
            res.send({ ok: true });
        });
    }
    catch (err) {
        console.log(err);
    }
});
exports.removeImage = removeImage;
const create = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // console.log("CREATE COURSE", req.body);
    // return;
    try {
        const alreadyExist = yield course_1.default.findOne({
            slug: slugify(req.body.name.toLowerCase()),
        });
        if (alreadyExist)
            return res.status(400).send("Title is taken");
        const course = yield new course_1.default(Object.assign({ slug: slugify(req.body.name), instructor: req.auth._id }, req.body)).save();
        res.json(course);
    }
    catch (err) {
        console.log(err);
        return res.status(400).send("Course create failed. Try again.");
    }
});
exports.create = create;
const read = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const course = yield course_1.default.findOne({ slug: req.params.slug })
            .populate("instructor", "_id name")
            .exec();
        res.json(course);
    }
    catch (err) {
        console.log(err);
    }
});
exports.read = read;
const getQuiz = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const course = yield course_1.default.findOne({ slug: req.params.slug })
            .populate("lessons", "quiz")
            .exec();
        res.json(course);
    }
    catch (err) {
        console.log(err);
    }
});
exports.getQuiz = getQuiz;
const addLesson = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { slug, instructorId } = req.params;
        const { lessonTitle } = req.body;
        if (req.auth._id != instructorId) {
            return res.status(400).send("Unauthorized");
        }
        const updated = yield course_1.default.findOneAndUpdate({ slug }, {
            $push: {
                lessons: {
                    lessonTitle,
                    slug: slugify(lessonTitle),
                },
            },
        }, { new: true })
            .populate("instructor", "_id name")
            .exec();
        res.json(updated);
    }
    catch (err) {
        console.log(err);
        return res.status(400).send("Add lesson failed");
    }
});
exports.addLesson = addLesson;
const createQuiz = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { slug, instructorId, lessonId } = req.params;
        const { quizTitle, questions, selectedAnswers } = req.body;
        if (req.auth._id != instructorId) {
            return res.status(400).send("Unauthorized");
        }
        for (let i = 0; i < questions.length; i++) {
            const question = questions[i];
            // Looping through quesion's answers
            let { answers } = question;
            // If none of the answers was selected as the correct answer, we select the first one as the correct one
            let noSelectedAnswer = false;
            for (let j = 0; j < answers.length; j++) {
                const answer = answers[j];
                // If the selected answer id is included in the selectedAnswers array, we make it correct
                if (selectedAnswers.includes(answer.id)) {
                    noSelectedAnswer = true;
                    answers[j].isCorrect = true;
                }
            }
            if (!noSelectedAnswer) {
                answers[0].isCorrect = true;
            }
        }
        const updated = yield course_1.default.findOneAndUpdate({ slug }, {
            $push: {
                "lessons.$[lessons].quiz": {
                    quizTitle,
                    questions,
                    slug: slugify(quizTitle),
                },
            },
        }, {
            arrayFilters: [
                {
                    "lessons._id": lessonId,
                },
            ],
        }).exec();
        res.json(updated);
    }
    catch (err) {
        console.log(err);
        return res.status(400).send("Add quiz failed");
    }
});
exports.createQuiz = createQuiz;
const update = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { slug } = req.params;
        const course = yield course_1.default.findOne({ slug }).exec();
        // console.log("COURSE FOUND => ", course);
        if (req.auth._id != course.instructor._id) {
            return res.status(400).send("Unauthorized");
        }
        const updated = yield course_1.default.findOneAndUpdate({ slug }, req.body, {
            new: true,
        }).exec();
        res.json(updated);
    }
    catch (err) {
        console.log(err);
        return res.status(400).send(err.message);
    }
});
exports.update = update;
const removeLesson = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { slug, lessonId } = req.params;
    const course = yield course_1.default.findOne({ slug }).exec();
    if (req.auth._id != course.instructor) {
        return res.status(400).send("Unauthorized");
    }
    const deletedCourse = yield course_1.default.findByIdAndUpdate(course._id, {
        $pull: { lessons: { _id: lessonId } },
    }).exec();
    res.json({ ok: true });
});
exports.removeLesson = removeLesson;
const updateLesson = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("UPDATE LESSON", req.body);
        const { slug } = req.params;
        const { lessonId, lessonTitle } = req.body;
        const course = yield course_1.default.findOne({ slug }).select("instructor").exec();
        if (course.instructor._id != req.auth._id) {
            return res.status(400).send("Unauthorized");
        }
        const updated = yield course_1.default.findOneAndUpdate({ "lessons._id": lessonId }, {
            $set: {
                "lessons.$.lessonTitle": lessonTitle,
                "lessons.$.slug": slugify(lessonTitle),
            },
        }, { new: true }).exec();
        console.log("updated", updated);
        res.json({ ok: true });
    }
    catch (err) {
        console.log(err);
        return res.status(400).send("Update lesson failed");
    }
});
exports.updateLesson = updateLesson;
const publishCourse = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { courseId } = req.params;
        const course = yield course_1.default.findById(courseId).select("instructor").exec();
        if (course.instructor._id != req.auth._id) {
            return res.status(400).send("Unauthorized");
        }
        const updated = yield course_1.default.findByIdAndUpdate(courseId, { published: true }, { new: true }).exec();
        res.json(updated);
    }
    catch (err) {
        console.log(err);
        return res.status(400).send("Publish course failed");
    }
});
exports.publishCourse = publishCourse;
const unpublishCourse = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { courseId } = req.params;
        const course = yield course_1.default.findById(courseId).select("instructor").exec();
        if (course.instructor._id != req.auth._id) {
            return res.status(400).send("Unauthorized");
        }
        const updated = yield course_1.default.findByIdAndUpdate(courseId, { published: false }, { new: true }).exec();
        res.json(updated);
    }
    catch (err) {
        console.log(err);
        return res.status(400).send("Unpublish course failed");
    }
});
exports.unpublishCourse = unpublishCourse;
const courses = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const all = yield course_1.default.find({ published: true })
        .populate("instructor", "_id name")
        .exec();
    res.json(all);
});
exports.courses = courses;
const allQuiz = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const allquiz = yield course_1.default.find({ published: false || true })
        .populate("lessons", "quiz")
        .exec();
    res.json(allquiz);
});
exports.allQuiz = allQuiz;
const checkEnrollment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { courseId } = req.params;
    // find courses of the currently logged in user
    const user = yield user_1.default.findById(req.auth._id).exec();
    // check if course id is found in user courses array
    let ids = [];
    let length = user.courses && user.courses.length;
    for (let i = 0; i < length; i++) {
        ids.push(user.courses[i].toString());
    }
    res.json({
        status: ids.includes(courseId),
        course: yield course_1.default.findById(courseId).exec(),
    });
});
exports.checkEnrollment = checkEnrollment;
const freeEnrollment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // check if course is free or paid
        const course = yield course_1.default.findById(req.params.courseId).exec();
        if (course.paid)
            return;
        const result = yield user_1.default.findByIdAndUpdate(req.auth._id, {
            $addToSet: { courses: course._id },
        }, { new: true }).exec();
        console.log(result);
        res.json({
            message: "Congratulations! You have successfully enrolled",
            course,
        });
    }
    catch (err) {
        console.log("free enrollment err", err);
        return res.status(400).send("Enrollment create failed");
    }
});
exports.freeEnrollment = freeEnrollment;
const paidEnrollment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // check if course is free or paid
        const course = yield course_1.default.findById(req.params.courseId)
            .populate("instructor")
            .exec();
        if (!course.paid)
            return;
        // application fee 30%
        const fee = (course.price * 38) / 100;
        // create stripe session
        const session = yield stripes.checkout.sessions.create({
            payment_method_types: ["card"],
            mode: "payment",
            // purchase details
            line_items: [
                {
                    price_data: {
                        currency: "usd",
                        product_data: { name: course.name },
                        // currency: "usd",
                        //@ts-ignore
                        unit_amount: Math.round(course.price.toFixed(2) * 100),
                    },
                    quantity: 1,
                },
            ],
            // charge buyer and transfer remaining balance to seller (after fee)
            payment_intent_data: {
                //@ts-ignore
                application_fee_amount: Math.round(fee.toFixed(2) * 100),
                transfer_data: {
                    //@ts-ignore
                    destination: course.instructor.stripe_account_id,
                },
            },
            // redirect url after successful payment
            success_url: `${process.env.STRIPE_SUCCESS_URL}/${course._id}`,
            cancel_url: process.env.STRIPE_CANCEL_URL,
        });
        console.log("SESSION ID => ", session);
        yield user_1.default.findByIdAndUpdate(req.auth._id, {
            stripeSession: session,
        }).exec();
        res.send(session.id);
    }
    catch (err) {
        console.log("PAID ENROLLMENT ERR", err);
        return res.status(400).send("Enrollment create failed");
    }
});
exports.paidEnrollment = paidEnrollment;
const stripeSuccess = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // find course
        const course = yield course_1.default.findById(req.params.courseId).exec();
        // get user from db to get stripe session id
        const user = yield user_1.default.findById(req.auth._id).exec();
        // if no stripe session return
        //@ts-ignore
        if (!user.stripeSession.id)
            return res.sendStatus(400);
        // retrieve stripe session
        const session = yield stripes.checkout.sessions.retrieve(
        //@ts-ignore
        user.stripeSession.id);
        console.log("STRIPE SUCCESS", session);
        // if session payment status is paid, push course to user's course []
        if (session.payment_status === "paid") {
            yield user_1.default.findByIdAndUpdate(user._id, {
                $addToSet: { courses: course._id },
                $set: { stripeSession: {} },
            }).exec();
        }
        res.json({ success: true, course });
    }
    catch (err) {
        console.log("STRIPE SUCCESS ERR", err);
        res.json({ success: false });
    }
});
exports.stripeSuccess = stripeSuccess;
const userCourses = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_1.default.findById(req.auth._id).exec();
    const courses = yield course_1.default.find({ _id: { $in: user.courses } })
        .populate("instructor", "_id name")
        .exec();
    res.json(courses);
});
exports.userCourses = userCourses;
function asyncHandler(arg0) {
    throw new Error("Function not implemented.");
}
//# sourceMappingURL=course.js.map