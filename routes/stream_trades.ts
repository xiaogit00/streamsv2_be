import Router from 'express-promise-router'
import db from '../db/index'
import { NewStreamTrade } from '../types';
import { toNewStreamTrade, toBulkStreamTrades } from '../utils/typeguards';
import { PoolClient } from 'pg';

const router = Router()

export default router


// READ (ALL)
router.get('/', async (_req, res) => {
    const stream_trades = await db.query('SELECT * FROM stream_trades')
    res.send(stream_trades.rows)
});

  // CREATE
router.post('/', async (req, res) => {
  const newStreamTrade: NewStreamTrade = toNewStreamTrade(req.body)
  const client: PoolClient = await db.connect()
  try {
    const queryText = 'INSERT INTO public.stream_trades (stream_id, trade_id) VALUES ($1, $2) RETURNING *'
    const values = Object.values(newStreamTrade)
    const data = await client.query(queryText, values)
    res.status(200).json(data.rows[0])
  } catch (e: unknown) {
    await client.query('ROLLBACK')
    console.log("Error:", e)
    res.status(400).send('An error occurred in adding new trade.')
  } finally {
    client.release()
    res.end()
  }
});

router.post('/bulk-assign', async (req, res) => {
  const {stream_id, trades} = toBulkStreamTrades(req.body)
  const client: PoolClient = await db.connect()
  try {
    await client.query('BEGIN')
    trades.map(async trade_id => {
      const queryText = 'INSERT INTO public.stream_trades (stream_id, trade_id) VALUES ($1, $2) RETURNING *'
      const values = [stream_id, trade_id]
      await client.query(queryText, values)
    })
    await client.query('COMMIT')
    res.status(200).json("Trades successfully added")
  } catch (e: unknown) {
    await client.query('ROLLBACK')
    console.log("Error:", e)
    res.status(400).send('An error occurred in adding new trade.')
  } finally {
    client.release()
    res.end()
  }
})