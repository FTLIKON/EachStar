import Router = require('koa-router')
import CardController from '../controller/card'

export const getCardMiddleware = () => {
  const router = new Router({
    prefix: '/api',
  })
  const cardController = new CardController()
  router.post('/card', cardController.createCard.bind(cardController))
  return router.routes()
}
