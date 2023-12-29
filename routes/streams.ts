import Router from 'express-promise-router'
import db from '../db/index'
import { NewStream } from '../types';
import { parseUUID, toNewStream } from '../utils/typeguards';
import { PoolClient } from 'pg';

const router = Router()

export default router


// READ (ALL)
router.get('/', async (_req, res) => {
    const streams = await db.query('SELECT * FROM streams')
    res.send(streams.rows)
});

// GET ALL STREAMS WITH TRADES
router.get('/with-trades', async (_req, res) => {
  const streamsTrades = await db.query('SELECT s.id as stream_id, t.* FROM public.streams s JOIN public.stream_trades st ON s.id = st.stream_id JOIN public.trades t ON st.trade_id = t.id')
  res.send(streamsTrades.rows)
});


  // CREATE
router.post('/', async (req, res) => {
  const newStream: NewStream = toNewStream(req.body)
  const client: PoolClient = await db.connect()
  try {
    const queryText = 'INSERT INTO public.streams (ticker, stream_name, currency, exchange, date_created) VALUES ($1, $2, $3, $4, $5) RETURNING *'
    const values = Object.values(newStream)
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

// GET ALL STREAMS WITH TRADES
router.get('/:id/trades', async (req, res) => {
  const stream_id = parseUUID(req.params.id)
  const client: PoolClient = await db.connect()
  try {
    await client.query('BEGIN')
    const queryText = 'SELECT * FROM public.stream_trades WHERE stream_id = $1' 
    const data = await client.query(queryText, [stream_id])
    const tradeIds = data.rows.map(streamTrade => streamTrade.trade_id)
    console.log(tradeIds)
    if (tradeIds.length > 0) {
      const getTradesQuery = `SELECT * FROM public.trades WHERE id in (${tradeIds.map((_item, index) => `$${index+1}`).join(', ')})`
      const tradesData = await client.query(getTradesQuery, tradeIds)
      res.status(200).json(tradesData.rows)
    } else {
      res.status(404)
    }
    await client.query('COMMIT')
  } catch (e: unknown) {
    await client.query('ROLLBACK')
    console.log("Error:", e)
    res.status(400).send('An error occurred in fetching all trades in stream.')
  } finally {
    client.release()
    res.end()
  }
});

// DELETE ALL STREAMS AND ASSIGNED TRADES
router.delete('/:id', async (req, res) => {
  const streamId = parseUUID(req.params.id)
  const client: PoolClient = await db.connect()
  try {
    await client.query('BEGIN')
    const deleteStreamQuery = 'DELETE FROM public.streams s WHERE id = $1'
    await client.query(deleteStreamQuery, [streamId])
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