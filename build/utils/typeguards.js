"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toTrade = exports.toBulkStreamTrades = exports.toNewStreamTrade = exports.toNewStream = exports.toNewTrade = exports.parseUUID = void 0;
const uuid_1 = require("uuid");
const isString = (text) => {
    return typeof text === 'string' || text instanceof String;
};
const isNumber = (num) => {
    return typeof Number(num) === "number";
};
const parseString = (text) => {
    if (!text || !isString(text)) {
        throw new Error('Incorrect or missing string.');
    }
    return text;
};
const parseNumber = (text) => {
    if (text === null || !isNumber(text)) {
        throw new Error('Incorrect or missing number.');
    }
    return text;
};
const parseBool = (text) => {
    if (text === null || typeof text !== 'boolean') {
        throw new Error('Incorrect or missing boolean.');
    }
    return text;
};
const isDate = (date) => {
    return Boolean(Date.parse(date));
};
const parseDate = (date) => {
    if (!date || !isString(date) || !isDate(date)) {
        throw new Error('Incorrect or missing date: ' + date);
    }
    return new Date(date);
};
const parseCloseUUID = (id) => {
    if (!id)
        return null;
    if (!(0, uuid_1.validate)(id))
        throw new Error('Incorrect or missing id.');
    return id;
};
const parseUUID = (id) => {
    if (!id || !(0, uuid_1.validate)(id))
        throw new Error('Incorrect or missing uuid.');
    return id;
};
exports.parseUUID = parseUUID;
const parseTradeIdArray = (tradeIds) => {
    tradeIds.map((tradeId) => {
        if (!(0, uuid_1.validate)(tradeId))
            throw new Error('Incorrect or missing uuid.');
    });
    return tradeIds;
};
const toNewTrade = (body) => {
    const newTrade = {
        ticker: parseString(body.ticker),
        name: parseString(body.name),
        qty: parseNumber(body.qty),
        price: parseNumber(body.price),
        type: parseBool(body.type),
        currency: parseString(body.currency),
        exchange: parseString(body.exchange),
        cost: parseNumber(body.cost),
        exchange_fees: parseNumber(body.exchange_fees),
        date: parseDate(body.date),
        close_id: parseCloseUUID(body.close_id)
    };
    return newTrade;
};
exports.toNewTrade = toNewTrade;
const toNewStream = (body) => {
    const newStream = {
        ticker: parseString(body.ticker),
        stream_name: parseString(body.stream_name),
        currency: parseString(body.currency),
        exchange: parseString(body.exchange),
        date_created: parseDate(body.date_created)
    };
    return newStream;
};
exports.toNewStream = toNewStream;
const toNewStreamTrade = (body) => {
    const newStreamTrade = {
        stream_id: (0, exports.parseUUID)(body.stream_id),
        trade_id: (0, exports.parseUUID)(body.trade_id)
    };
    return newStreamTrade;
};
exports.toNewStreamTrade = toNewStreamTrade;
const toBulkStreamTrades = (body) => {
    const newStreamTradesRequest = {
        stream_id: (0, exports.parseUUID)(body.stream_id),
        trades: parseTradeIdArray(body.trades)
    };
    return newStreamTradesRequest;
};
exports.toBulkStreamTrades = toBulkStreamTrades;
const toTrade = (body) => {
    const trade = {
        id: (0, exports.parseUUID)(body.id),
        ticker: parseString(body.ticker),
        name: parseString(body.name),
        qty: parseNumber(body.qty),
        price: parseNumber(body.price),
        type: parseBool(body.type),
        currency: parseString(body.currency),
        exchange: parseString(body.exchange),
        cost: parseNumber(body.cost),
        exchange_fees: parseNumber(body.exchange_fees),
        date: parseDate(body.date),
        close_id: parseCloseUUID(body.close_id)
    };
    return trade;
};
exports.toTrade = toTrade;
