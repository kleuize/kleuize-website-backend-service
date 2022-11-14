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
exports.resetPassword = exports.forgotPassword = exports.currentUser = exports.logout = exports.login = exports.register = void 0;
const user_1 = __importDefault(require("../models/user"));
const jwt = __importStar(require("jsonwebtoken"));
const auth_1 = require("../utils/auth");
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const awsConfig = {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
    apiVersion: process.env.AWS_API_VERSION,
};
const SES = new aws_sdk_1.default.SES(awsConfig);
function generateUID() {
    // I generate the UID from two parts here
    // to ensure the random number provide enough bits.
    var firstPart = (Math.random() * 46656) | 0;
    var secondPart = (Math.random() * 46656) | 0;
    firstPart = ("000" + firstPart.toString(36)).slice(-3);
    secondPart = ("000" + secondPart.toString(36)).slice(-3);
    return firstPart + secondPart;
}
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //now we use the functions of the model to has the password then we'll save and divert back to register route
    try {
        console.log(req.body);
        const { name, surName, email, password } = req.body;
        //do validation now
        if (!name)
            return res.status(400).send("name is required.");
        if (!password || password.length < 6) {
            return res
                .status(400)
                .send("Password is required and should be minimum of 6 characters long");
        }
        let userExist = yield user_1.default.findOne({ email }).exec();
        if (userExist)
            return res.status(400).send("Email is taken");
        //now if all details are acceptable then we can save it to db correctly
        //hash password
        const hashedPassword = yield (0, auth_1.hashPassword)(password);
        //register
        const user = yield new user_1.default({
            name,
            surName,
            email,
            password: hashedPassword,
        }).save();
        console.log("saved user:", user);
        return res.json({ ok: true });
    }
    catch (err) {
        console.log(err);
        return res.status(400).send("Error. Try again.");
    }
});
exports.register = register;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //check if our db has user with that email
        const { email, password } = req.body;
        const user = yield user_1.default.findOne({ email }).exec();
        if (!user)
            return res.status(400).send("No user found");
        //check password and use the compare password function already made for register
        //@ts-ignore
        const match = yield (0, auth_1.comparePassword)(password, user.password);
        //if no match
        if (!match)
            return res.status(400).send("Wrong password!");
        //now we create JWT
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
            expiresIn: "7d",
        });
        //send it now as cookie in json response
        user.password = undefined;
        res.cookie("token", token, {
            httpOnly: true,
            //secure: true,
        });
        //send user as json response
        res.json(user);
    }
    catch (err) {
        console.log(err);
        return res.status(400).send("Error. Try again.");
    }
});
exports.login = login;
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.clearCookie("token");
        return res.json({ message: "Signout Success" });
    }
    catch (error) {
        console.log(error);
    }
});
exports.logout = logout;
const currentUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield user_1.default.findById(req.auth._id).select("-password").exec();
        console.log("CURRENT_USER", user);
        return res.json({ ok: true });
    }
    catch (err) {
        console.log(err);
    }
});
exports.currentUser = currentUser;
const forgotPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.body;
        const shortCode = generateUID().toUpperCase();
        const user = yield user_1.default.findOneAndUpdate({ email }, { passwordResetCode: shortCode });
        if (!user)
            return res.status(400).send("User not found");
        const params = {
            Source: process.env.EMAIL_FROM,
            Destination: {
                ToAddresses: [email],
            },
            Message: {
                Body: {
                    Html: {
                        Charset: "UTF-8",
                        Data: `
                <html>
                  <h1>Reset password</h1>
                  <p>User this code to reset your password</p>
                  <h2 style="color:red;">${shortCode}</h2>
                  <i>edemy.com</i>
                </html>
              `,
                    },
                },
                Subject: {
                    Charset: "UTF-8",
                    Data: "Reset Password",
                },
            },
        };
        const emailSent = SES.sendEmail(params).promise();
        emailSent
            .then((data) => {
            console.log(data);
            res.json({ ok: true });
        })
            .catch((err) => {
            console.log(err);
        });
    }
    catch (err) {
        console.log(err);
    }
});
exports.forgotPassword = forgotPassword;
const resetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, code, newPassword } = req.body;
        const hashedPassword = yield (0, auth_1.hashPassword)(newPassword);
        const user = user_1.default.findOneAndUpdate({
            email,
            passwordResetCode: code,
        }, {
            password: hashedPassword,
            passwordResetCode: "",
        }).exec();
        res.json({ ok: true });
    }
    catch (err) {
        console.log(err);
        return res.status(400).send("Error! Try again.");
    }
});
exports.resetPassword = resetPassword;
//# sourceMappingURL=auth.js.map