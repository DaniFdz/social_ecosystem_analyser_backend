import { getApp } from '@/app'
import { MongoDBTopicsRepository } from '@v1/topics/repository/topicsRepository'
import { MongoDBAuthRepository } from '@v1/auth/repository/authRepository'
import { MongoDBVideosRepository } from '@v1/videos/repository/videosRepository'

const PORT = process.env.PORT ?? 3000

const authRepository = new MongoDBAuthRepository()
const topicsRepository = new MongoDBTopicsRepository()
const videosRepository = new MongoDBVideosRepository()
const app = getApp(authRepository, topicsRepository, videosRepository)

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})
