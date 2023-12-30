"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
// import { Client } from 'pg'
// Creating a pool of connections so that we don't have to open/close a client every time we make a query
const pool = new pg_1.Pool({
    user: process.env.SUPABASE_USER,
    host: process.env.SUPABASE_HOST,
    database: process.env.SUPABASE_DATABASE,
    password: process.env.SUPABASE_PASSWORD,
    port: Number(process.env.SUPABASE_PORT)
});
// pool = new Pool({
//     user: process.env.DB_USER,
//     host: process.env.DB_HOST,
//     database: process.env.DB_DATABASE,
//     password: process.env.DB_PASSWORD,
//     port: Number(process.env.DB_PORT)
// })
const query = (text, params) => pool.query(text, params);
const connect = () => pool.connect();
exports.default = {
    query,
    connect
};
