import express from 'express'
import dotenv from 'dotenv'
dotenv.config()
import type { Request, Response } from 'express'
const app = express()
import cors from 'cors'
import trades from './routes/trades'
import streams from './routes/streams'
import stream_trades from './routes/stream_trades'
import guest_tokens from './routes/guest_tokens'
var morgan = require('morgan')

app.use(express.static('build'))
app.use(cors())
app.use(express.json())


morgan.token('body', function (req: Request, _res: Response) { return JSON.stringify(req.body) })
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

app.use('/api/trades', trades)
app.use('/api/streams', streams)
app.use('/api/stream-trades', stream_trades)
app.use('/api/guest-tokens', guest_tokens)

export { app }