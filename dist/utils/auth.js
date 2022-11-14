"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.comparePassword = exports.hashPassword = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
//to generate a hashed password
const hashPassword = (password) => {
    //to hash the password!
    return new Promise((resolve, reject) => {
        bcrypt_1.default.genSalt(12, (err, salt) => {
            if (err) {
                reject(err);
            }
            //if no issues then continue with hashing the password
            bcrypt_1.default.hash(password, salt, (err, hash) => {
                if (err) {
                    reject(err);
                }
                resolve(hash);
            });
        });
    });
};
exports.hashPassword = hashPassword;
//to compare the password safely
const comparePassword = (password, hashed) => {
    return bcrypt_1.default.compare(password, hashed);
};
exports.comparePassword = comparePassword;
//# sourceMappingURL=auth.js.map