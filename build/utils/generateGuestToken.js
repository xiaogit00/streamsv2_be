"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateGuestToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const generateGuestToken = (deviceInfo) => {
    const secretKey = String(process.env.GUEST_TOKEN_SECRET);
    const { browser, deviceModel, os, osVersion, userId } = deviceInfo;
    const payload = {
        device: {
            browser,
            deviceModel,
            os,
            osVersion,
        },
        time: Date.now(),
        userId
    };
    // Generate the token with the payload and secret key
    const token = jsonwebtoken_1.default.sign(payload, secretKey);
    return token;
};
exports.generateGuestToken = generateGuestToken;
