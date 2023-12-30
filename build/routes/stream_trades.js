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
const router = (0, express_promise_router_1.default)();
exports.default = router;
// READ (ALL)
router.get('/', (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const stream_trades = yield index_1.default.query('SELECT * FROM stream_trades');
    res.send(stream_trades.rows);
}));
// CREATE
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const newStreamTrade = (0, typeguards_1.toNewStreamTrade)(req.body);
    const client = yield index_1.default.connect();
    try {
        const queryText = 'INSERT INTO public.stream_trades (stream_id, trade_id) VALUES ($1, $2) RETURNING *';
        const values = Object.values(newStreamTrade);
        const data = yield client.query(queryText, values);
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
router.post('/bulk-assign', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { stream_id, trades } = (0, typeguards_1.toBulkStreamTrades)(req.body);
    const client = yield index_1.default.connect();
    try {
        yield client.query('BEGIN');
        trades.map((trade_id) => __awaiter(void 0, void 0, void 0, function* () {
            const queryText = 'INSERT INTO public.stream_trades (stream_id, trade_id) VALUES ($1, $2) RETURNING *';
            const values = [stream_id, trade_id];
            yield client.query(queryText, values);
        }));
        yield client.query('COMMIT');
        res.status(200).json("Trades successfully added");
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
