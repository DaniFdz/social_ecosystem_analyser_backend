import { getApp } from '@/app'
import { MongoDBTopicsRepository } from './api/v1/repository/topicsRepository'

const PORT = process.env.PORT ?? 3000

const repository = new MongoDBTopicsRepository()
const app = getApp(repository)

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})
