import Router from 'express-promise-router'
import db from '../db/index'
import { NewStream } from '../types';
import { parseUUID, toNewStream } from '../utils/typeguards';
import { PoolClient } from 'pg';
import { verifyGuestToken } from '../utils/verifyGuestToken';

const router = Router()

export default router


// READ (ALL)
router.get('/', verifyGuestToken, async (req, res) => {
  const userId = req.body.userId
  const client: PoolClient = await db.connect()
  try {
    const streamQuery = 'SELECT * FROM public.streams s WHERE s.user_id = $1'
    const data = await client.query(streamQuery, [userId])
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

// GET ALL STREAMS WITH TRADES
router.get('/with-trades', verifyGuestToken, async (req, res) => {
  const userId = req.body.userId
  const client: PoolClient = await db.connect()
  try {
    const streamTradeQuery = 'SELECT s.id as stream_id, t.* FROM public.streams s JOIN public.stream_trades st ON s.id = st.stream_id JOIN public.trades t ON st.trade_id = t.id WHERE t.user_id = $1'
    const streamTrades = await client.query(streamTradeQuery, [userId])
    res.send(streamTrades.rows)
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
  const newStream: NewStream = toNewStream(req.body)
  const client: PoolClient = await db.connect()
  try {
    const queryText = 'INSERT INTO public.streams (ticker, stream_name, currency, exchange, date_created, user_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *'
    const values = Object.values(newStream)
    const data = await client.query(queryText, [...values, userId])
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


// DELETE ALL STREAMS AND ASSIGNED TRADES
router.delete('/:id', verifyGuestToken, async (req, res) => {
  const userId = req.body.userId
  const streamId = parseUUID(req.params.id)
  const client: PoolClient = await db.connect()
  try {
    await client.query('BEGIN')
    const deleteStreamQuery = 'DELETE FROM public.streams s WHERE s.id = $1 AND s.user_id = $2'
    await client.query(deleteStreamQuery, [streamId, userId])
    const deleteStreamTradesQuery = 'DELETE FROM public.stream_trades st WHERE stream_id = $1'
    await client.query(deleteStreamTradesQuery, [streamId])
    await client.query('COMMIT')
    res.status(200).json("Successfully deleted stream.")
  } catch (e: unknown) {
    await client.query('ROLLBACK')
    console.log("Error:", e)
    res.status(400).send('An error occurred in fetching all trades in stream.')
  } finally {
    client.release()
    res.end()
  }
})