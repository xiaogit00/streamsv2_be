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
const typeguards_1 = require("../utils/typeguards");
const verifyGuestToken_1 = require("../utils/verifyGuestToken");
const router = (0, express_promise_router_1.default)();
exports.default = router;
// READ (ALL)
router.get('/', verifyGuestToken_1.verifyGuestToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.body.userId;
    const client = yield index_1.default.connect();
    try {
        const tradeQuery = 'SELECT * FROM public.trades t WHERE t.user_id = $1';
        const data = yield client.query(tradeQuery, [userId]);
        res.status(200).json(data.rows);
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
// CREATE
router.post('/', verifyGuestToken_1.verifyGuestToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.body.userId;
    const newTrade = (0, typeguards_1.toNewTrade)(req.body);
    const client = yield index_1.default.connect();
    try {
        yield client.query('BEGIN');
        const queryText = 'INSERT INTO public.trades (ticker, name,qty,price,type,currency,exchange,cost,exchange_fees,date, close_id, user_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *';
        const values = Object.values(newTrade);
        const data = yield client.query(queryText, [...values, userId]);
        yield client.query('COMMIT');
        res.status(200).json(data.rows[0]);
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
router.delete('/:id', verifyGuestToken_1.verifyGuestToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.body.userId;
    const tradeId = req.params.id;
    const client = yield index_1.default.connect();
    try {
        yield client.query('BEGIN');
        const deleteTradeQuery = 'DELETE FROM public.trades t WHERE t.id = $1 AND t.user_id = $2';
        yield client.query(deleteTradeQuery, [tradeId, userId]);
        const deleteStreamTradesQuery = 'DELETE FROM public.stream_trades st WHERE st.trade_id = $1';
        yield client.query(deleteStreamTradesQuery, [tradeId]);
        yield client.query('COMMIT');
        res.status(200).json("Successfully deleted");
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
