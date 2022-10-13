import Router = require('koa-router')
import DevController from '../controller/dev'

export const getDevApiMiddleware = () => {
  const router = new Router({
    prefix: '/api',
  })
  const devController = new DevController()
  router.get('/user/price', devController.changeUserPrice.bind(devController))
  router.get('/card/testadd', devController.createTestCard.bind(devController))
  return router.routes()
}
