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
const express_promise_router_1 = __importDefault(require("express-promise-router"));
const index_1 = __importDefault(require("../db/index"));
const generateGuestToken_1 = require("../utils/generateGuestToken");
const router = (0, express_promise_router_1.default)();
exports.default = router;
// READ (ALL)
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const deviceInfo = req.body;
    const { userId } = deviceInfo;
    const guestToken = (0, generateGuestToken_1.generateGuestToken)(deviceInfo);
    const client = yield index_1.default.connect();
    try {
        const addTokenQuery = 'INSERT into public.users (id, type, guest_token) VALUES ($1, $2, $3)';
        const values = [userId, 'guest', guestToken];
        yield client.query(addTokenQuery, values);
        res.status(200).send(guestToken);
    }
    catch (e) {
        yield client.query('ROLLBACK');
        console.log("Error:", e);
        res.status(400).send('An error occurred in adding new trade.');
    }
    finally {
        client.release();
        res.end();
    }
}));
