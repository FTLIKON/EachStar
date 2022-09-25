import Router = require('koa-router')
import CardController from '../controller/card'
import { Pool } from 'pg'
export const getCardMiddleware = (pool: Pool) => {
  const router = new Router({
    prefix: '/api',
  })
  const cardController = new CardController(pool)
  router.post('/card', cardController.createCard.bind(cardController))
  router.get('/card', cardController.getCard.bind(cardController))

  return router.routes()
}
