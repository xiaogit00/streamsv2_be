import Router from 'express-promise-router'
import db from '../db/index'
import { NewTrade } from '../types';
import { toNewTrade } from '../utils/typeguards';
import { PoolClient } from 'pg';

const router = Router()

export default router


// READ (ALL)
router.get('/', async (_req, res) => {
    const trades = await db.query('SELECT * FROM trades')
    res.send(trades.rows)
});

  // CREATE
router.post('/', async (req, res) => {
  const newTrade: NewTrade = toNewTrade(req.body)
  const client: PoolClient = await db.connect()
  try {
    const queryText = 'INSERT INTO public.trades (ticker, name,qty,price,type,currency,exchange,cost,exchange_fees,date, close_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *'
    const values = Object.values(newTrade)
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
})

router.delete('/:id', async (req, res) => {
  const tradeId = req.params.id
  const client: PoolClient = await db.connect()
  try {
    await client.query('BEGIN')
    const deleteTradeQuery = 'DELETE FROM public.trades t WHERE t.id = $1'
    await client.query(deleteTradeQuery, [tradeId])
    const deleteStreamTradesQuery = 'DELETE FROM public.stream_trades st WHERE st.trade_id = $1'
    await client.query(deleteStreamTradesQuery, [tradeId])
    await client.query('COMMIT')
    res.status(200).json("Successfully deleted")
  } catch (e: unknown) {
    await client.query('ROLLBACK')
    console.log("Error:", e)
    res.status(400).send('An error occurred in adding new trade.')
  } finally {
    client.release()
    res.end()
  }
})
