import Router = require('koa-router')
import UserController from '../controller/user'

export const getUserApiMiddleware = () => {
  const router = new Router({
    prefix: '/api',
  })
  const userController = new UserController()
  router.get('/user/@me', userController.getSelf.bind(userController))
  return router.routes()
}
