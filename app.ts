import express from 'express'
import dotenv from 'dotenv'
dotenv.config()
import type { Request, Response } from 'express'
const app = express()
import cors from 'cors'
import trades from './routes/trades'
var morgan = require('morgan')

app.use(cors())
app.use(express.json())


morgan.token('body', function (req: Request, _res: Response) { return JSON.stringify(req.body) })
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

app.use('/api/trades', trades)

export { app }