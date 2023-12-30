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
        const streamQuery = 'SELECT * FROM public.streams s WHERE s.user_id = $1';
        const data = yield client.query(streamQuery, [userId]);
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
// GET ALL STREAMS WITH TRADES
router.get('/with-trades', verifyGuestToken_1.verifyGuestToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.body.userId;
    const client = yield index_1.default.connect();
    try {
        const streamTradeQuery = 'SELECT s.id as stream_id, t.* FROM public.streams s JOIN public.stream_trades st ON s.id = st.stream_id JOIN public.trades t ON st.trade_id = t.id WHERE t.user_id = $1';
        const streamTrades = yield client.query(streamTradeQuery, [userId]);
        res.send(streamTrades.rows);
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
    const newStream = (0, typeguards_1.toNewStream)(req.body);
    const client = yield index_1.default.connect();
    try {
        const queryText = 'INSERT INTO public.streams (ticker, stream_name, currency, exchange, date_created, user_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *';
        const values = Object.values(newStream);
        const data = yield client.query(queryText, [...values, userId]);
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
// DELETE ALL STREAMS AND ASSIGNED TRADES
router.delete('/:id', verifyGuestToken_1.verifyGuestToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.body.userId;
    const streamId = (0, typeguards_1.parseUUID)(req.params.id);
    const client = yield index_1.default.connect();
    try {
        yield client.query('BEGIN');
        const deleteStreamQuery = 'DELETE FROM public.streams s WHERE s.id = $1 AND s.user_id = $2';
        yield client.query(deleteStreamQuery, [streamId, userId]);
        const deleteStreamTradesQuery = 'DELETE FROM public.stream_trades st WHERE stream_id = $1';
        yield client.query(deleteStreamTradesQuery, [streamId]);
        yield client.query('COMMIT');
        res.status(200).json("Successfully deleted stream.");
    }
    catch (e) {
        yield client.query('ROLLBACK');
        console.log("Error:", e);
        res.status(400).send('An error occurred in fetching all trades in stream.');
    }
    finally {
        client.release();
        res.end();
    }
}));
