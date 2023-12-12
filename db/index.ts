import { Pool, PoolClient } from 'pg';
// import { Client } from 'pg'

// Creating a pool of connections so that we don't have to open/close a client every time we make a query
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: Number(process.env.DB_PORT)
})


const query = ( text: string, params?: Array<string> ) => pool.query(text, params);
const connect = (): Promise<PoolClient> => pool.connect()

export default {
    query,
    connect
}