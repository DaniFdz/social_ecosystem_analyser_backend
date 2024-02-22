/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from 'express'
import { AuthController } from '@v1/auth/controllers/authController'
import { type AuthRepository } from '@v1/auth/repository/authRepository'

export function getAuthRouter (authRepository: AuthRepository): Router {
  const router = Router()

  const authController = new AuthController(authRepository)

  router
    .post('/login', async (req, res) => { await authController.login(req, res) })
    .post('/register', async (req, res) => { await authController.register(req, res) })
    .post('/getSession', async (req, res) => { await authController.getSession(req, res) })
    .put('/:username', async (req, res) => { await authController.update(req, res) })
    .delete('/', async (req, res) => { await authController.delete(req, res) })
  return router
}
