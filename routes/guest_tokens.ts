import Router from 'express-promise-router'
import db from '../db/index'
// import { NewTrade } from '../types';
// import { toNewTrade } from '../utils/typeguards';
import { PoolClient } from 'pg';
import { generateGuestToken } from '../utils/generateGuestToken';

const router = Router()

export default router


// READ (ALL)
router.post('/', async (req, res) => {
    const deviceInfo = req.body
    const { userId } = deviceInfo
    const guestToken = generateGuestToken(deviceInfo)
    const client: PoolClient = await db.connect()
    try {
        const addTokenQuery = 'INSERT into public.users (id, type, guest_token) VALUES ($1, $2, $3)'
        const values = [userId, 'guest', guestToken]
        await client.query(addTokenQuery, values)
        res.status(200).send(guestToken)
    } catch (e: unknown) {
        await client.query('ROLLBACK')
        console.log("Error:", e)
        res.status(400).send('An error occurred in adding new trade.')
      } finally {
        client.release()
        res.end()
      }
});

