import { getApp } from '@/app'
import { MongoDBTopicsRepository } from '@v1/topics/repository/topicsRepository'
import { MongoDBAuthRepository } from './api/v1/auth/repository/authRepository'

const PORT = process.env.PORT ?? 3000

const authRepository = new MongoDBAuthRepository()
const topicsRepository = new MongoDBTopicsRepository()
const app = getApp(authRepository, topicsRepository)

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})
