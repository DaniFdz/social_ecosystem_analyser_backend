import express, { type Express } from 'express'
import bodyParser from 'body-parser'
import topicsRouter from '@/api/v1/routes/topicsRouter'
import { config } from 'dotenv'

config()

const app: Express = express()

app.disable('x-powered-by')
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use('/api/v1/topics', topicsRouter)

export default app
