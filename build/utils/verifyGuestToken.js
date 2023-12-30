"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyGuestToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const verifyGuestToken = (req, res, next) => {
    let token;
    const authorization = req.get('authorization');
    if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
        token = authorization.substring(7);
    }
    const secretKey = String(process.env.GUEST_TOKEN_SECRET);
    jsonwebtoken_1.default.verify(token, secretKey, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Invalid token' });
        }
        req.body.userId = decoded.userId; // Access user type or any relevant data
        next();
    });
};
exports.verifyGuestToken = verifyGuestToken;
