const { Pool } = require('pg')
const dotenv = require('dotenv')
dotenv.config()

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: Number(process.env.DB_PORT)
})

const refreshDb = async () => {
    const client = await pool.connect()
    try {
        await client.query('BEGIN')
        const deleteTrades = 'DELETE FROM public.trades'
        await client.query(deleteTrades, [])
        const deleteStreams = 'DELETE FROM public.streams'
        await client.query(deleteStreams, [])
        const deleteStreamTrades = 'DELETE FROM public.stream_trades'
        await client.query(deleteStreamTrades)
        await client.query('COMMIT')
    } catch (e) {
        await client.query('ROLLBACK')
        console.log("Error:", e)
    } finally {
        client.release()
    }
}

const populateDb = async () => {
    const client = await pool.connect()
    try {
        await client.query('BEGIN')
        const addTradeQuery = 'INSERT INTO public.trades (id, ticker, name,qty,price,type,currency,exchange,cost,exchange_fees,date, close_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)'
        dummyTrades.map(async trade => {
            const values = Object.values(trade)
            await client.query(addTradeQuery, values)
        })
        const addStreamQuery = 'INSERT INTO public.streams (id, ticker, stream_name, currency, exchange, date_created) VALUES ($1, $2, $3, $4, $5, $6)'
        dummyStreams.map(async stream => {
            const values = Object.values(stream)
            await client.query(addStreamQuery, values)
        })
        const addStreamTradesQuery = 'INSERT INTO public.stream_trades (id, stream_id, trade_id) VALUES ($1, $2, $3)'
        dummyStreamTrades.map(async streamTrade => {
            const values = Object.values(streamTrade)
            await client.query(addStreamTradesQuery, values)
        })
        await client.query('COMMIT')
    } catch (e) {
        await client.query('ROLLBACK')
        console.log("Error:", e)
    } finally {
        client.release()
    }
}

const main = async () => {
    await refreshDb()
    console.log("Deleted all tables.")

    await populateDb()
    console.log("Populated all tables.")
    
    process.exit(0)
}


main()


// DUMMY DATA:
const dummyTrades = [
    {
        id: 'f20f96e2-9db4-47f1-84d8-7a041c147676',
        ticker: '1810.hk',
        name: 'Xiaomi',
        qty: 1,
        price: 25,
        type: true,
        currency: 'HKD',
        exchange: 'HKEX',
        cost: 25,
        exchange_fees: 10,
        date: '2023-01-05',
        close_id: null
    },
    {
        id: '4c9be4bc-74bb-4d42-b8b3-8629549112af',
        ticker: '1810.hk',
        name: 'Xiaomi',
        qty: 1,
        price: 16,
        type: true,
        currency: 'HKD',
        exchange: 'HKEX',
        cost: 16,
        exchange_fees: 10,
        date: '2023-01-05',
        close_id: null
    },
    {
        id: 'c3a2a126-9484-4fe2-800d-0862d0f47d39',
        ticker: '1810.hk',
        name: 'Xiaomi',
        qty: 1,
        price: 18,
        type: false,
        currency: 'HKD',
        exchange: 'HKEX',
        cost: 16,
        exchange_fees: 10,
        date: '2023-01-05',
        close_id: '4c9be4bc-74bb-4d42-b8b3-8629549112af'
    },
    {
        id: '7832df7a-f788-493b-97c0-3204516d4ee1',
        ticker: 'PYPL',
        name: 'Paypal',
        qty: 100,
        price: 100,
        type: true,
        currency: 'USD',
        exchange: 'NASDAQ',
        cost: 10000,
        exchange_fees: 10,
        date: '2023-01-05',
        close_id: null
    },
    {
        id: '707c212b-001a-474c-b032-33775fb60c69',
        ticker: 'PYPL',
        name: 'Paypal',
        qty: 200,
        price: 40,
        type: true,
        currency: 'USD',
        exchange: 'NASDAQ',
        cost: 8000,
        exchange_fees: 10,
        date: '2023-01-05',
        close_id: null
    },
    {
        id: '4362006a-bf4a-47e6-b224-eb052785bd02',
        ticker: 'PYPL',
        name: 'Paypal',
        qty: 50,
        price: 70,
        type: false,
        currency: 'USD',
        exchange: 'NASDAQ',
        cost: 3500,
        exchange_fees: 10,
        date: '2023-01-05',
        close_id: '707c212b-001a-474c-b032-33775fb60c69'
    },
    {
        id: '77995656-0d0d-4a4e-bf75-76e96028a6b7',
        ticker: 'PYPL',
        name: 'Paypal',
        qty: 10,
        price: 80,
        type: false,
        currency: 'USD',
        exchange: 'NASDAQ',
        cost: 800,
        exchange_fees: 10,
        date: '2023-01-05',
        close_id: '707c212b-001a-474c-b032-33775fb60c69'
    },
    {
        id: 'd79d2947-2ceb-4a0a-8bf9-5482d22b4811',
        ticker: 'PYPL',
        name: 'Paypal',
        qty: 10,
        price: 90,
        type: false,
        currency: 'USD',
        exchange: 'NASDAQ',
        cost: 900,
        exchange_fees: 10,
        date: '2023-01-05',
        close_id: '707c212b-001a-474c-b032-33775fb60c69'
    },
    {
        id: '615e2c2b-8fb7-49b8-a873-c7fe180b315a',
        ticker: 'PYPL',
        name: 'Paypal',
        qty: 10,
        price: 90,
        type: false,
        currency: 'USD',
        exchange: 'NASDAQ',
        cost: 900,
        exchange_fees: 10,
        date: '2023-01-05',
        close_id: '707c212b-001a-474c-b032-33775fb60c69'
    }
]

const dummyStreams = [
    {
        id: '598f2074-e568-4df9-9479-26b26b2be9de',
        ticker: 'PYPL',
        stream_name: 'PYPL1',
        currency: 'USD',
        exchange: 'NASDAQ',
        date_created: '2023-01-05'
    },
    {
        id: '23ed2c09-988e-445d-84ec-4b1d4316efd9',
        ticker: 'PYPL',
        stream_name: 'PYPL2',
        currency: 'USD',
        exchange: 'NASDAQ',
        date_created: '2023-01-05'
    }
]

const dummyStreamTrades = [
    {
        id: '2399f59b-5b22-4774-a8e5-a10eda8d4013',
        stream_id: '598f2074-e568-4df9-9479-26b26b2be9de',
        trade_id: '7832df7a-f788-493b-97c0-3204516d4ee1'
    },
    {
        id: '3ba1effc-af5d-4143-be1e-87fecf59ea5a',
        stream_id: '23ed2c09-988e-445d-84ec-4b1d4316efd9',
        trade_id: '707c212b-001a-474c-b032-33775fb60c69'
    },
    {
        id: 'ad0d29eb-f398-46dc-92ed-8c86c2520411',
        stream_id: '23ed2c09-988e-445d-84ec-4b1d4316efd9',
        trade_id: '4362006a-bf4a-47e6-b224-eb052785bd02'
    },
    {
        id: '0a47c73a-a9d9-4266-b16f-c7ea0f31aa58',
        stream_id: '23ed2c09-988e-445d-84ec-4b1d4316efd9',
        trade_id: '77995656-0d0d-4a4e-bf75-76e96028a6b7'
    },
    {
        id: '73c2c357-276a-4a42-bcbe-2226c18c86ec',
        stream_id: '23ed2c09-988e-445d-84ec-4b1d4316efd9',
        trade_id: 'd79d2947-2ceb-4a0a-8bf9-5482d22b4811'
    },
    {
        id: '5a6d23a6-433e-47ab-80a1-e6682e0e4643',
        stream_id: '23ed2c09-988e-445d-84ec-4b1d4316efd9',
        trade_id: '615e2c2b-8fb7-49b8-a873-c7fe180b315a'
    }
]
