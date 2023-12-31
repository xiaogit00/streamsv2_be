"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
exports.app = app;
const cors_1 = __importDefault(require("cors"));
const trades_1 = __importDefault(require("./routes/trades"));
const streams_1 = __importDefault(require("./routes/streams"));
const stream_trades_1 = __importDefault(require("./routes/stream_trades"));
const guest_tokens_1 = __importDefault(require("./routes/guest_tokens"));
var morgan = require('morgan');
app.use(express_1.default.static('build'));
app.use((0, cors_1.default)());
app.use(express_1.default.json());
morgan.token('body', function (req, _res) { return JSON.stringify(req.body); });
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));
app.use('/api/trades', trades_1.default);
app.use('/api/streams', streams_1.default);
app.use('/api/stream-trades', stream_trades_1.default);
app.use('/api/guest-tokens', guest_tokens_1.default);
