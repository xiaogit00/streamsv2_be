import Router from 'express-promise-router'
import db from '../db/index'
import { NewTrade } from '../types';
import { toNewTrade } from '../utils/typeguards';
import { PoolClient } from 'pg';
import { verifyGuestToken } from '../utils/verifyGuestToken';

const router = Router()

export default router


// READ (ALL)
router.get('/', verifyGuestToken, async (req, res) => {
    const userId = req.body.userId
    const client: PoolClient = await db.connect()
    try {
      const tradeQuery = 'SELECT * FROM public.trades t WHERE t.user_id = $1'
      const data = await client.query(tradeQuery, [userId])
      res.status(200).json(data.rows)
    } catch (e: unknown) {
      await client.query('ROLLBACK')
      console.log("Error:", e)
      res.status(400).send('An error occurred in adding new trade.')
    } finally {
      client.release()
      res.end()
    }
})

  // CREATE
router.post('/', verifyGuestToken, async (req, res) => {
  const userId = req.body.userId
  const newTrade: NewTrade = toNewTrade(req.body)
  const client: PoolClient = await db.connect()
  try {
    await client.query('BEGIN')
    const queryText = 'INSERT INTO public.trades (ticker, name,qty,price,type,currency,exchange,cost,exchange_fees,date, close_id, user_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *'
    const values = Object.values(newTrade)
    const data = await client.query(queryText, [...values, userId])
    await client.query('COMMIT')
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

router.delete('/:id', verifyGuestToken, async (req, res) => {
  const userId = req.body.userId
  const tradeId = req.params.id
  const client: PoolClient = await db.connect()
  try {
    await client.query('BEGIN')
    const deleteTradeQuery = 'DELETE FROM public.trades t WHERE t.id = $1 AND t.user_id = $2'
    await client.query(deleteTradeQuery, [tradeId, userId])
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
