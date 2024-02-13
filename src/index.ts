import express from 'express'
import bodyParser from 'body-parser'
import '@/config/envvars'
import topicsRouter from '@/api/v1/routes/topicsRouter'

const PORT = process.env.PORT ?? 3000
const app = express()

app.use(bodyParser)
app.use('/api/v1/topics', topicsRouter)

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})
