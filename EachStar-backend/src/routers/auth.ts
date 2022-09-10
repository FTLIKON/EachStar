import Router = require('koa-router')
import AuthController from '../controller/auth'
export const getAuthMiddleware = () => {
  const router = new Router({
    prefix: '/auth',
  })
  const authController = new AuthController()
  router.post('/register', authController.register.bind(authController))
  router.post('/login', authController.login.bind(authController))
  return router.routes()
}
