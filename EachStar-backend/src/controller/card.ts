import { Context } from 'koa'
import { RepositoryPostgres } from '../stores'
import { Pool } from 'pg'
export class CardController {
  repository
  constructor() {
    this.repository = new RepositoryPostgres()
  }

  async createCard(ctx: Context) {
    const body = ctx.request.body
    const userId = ctx.user.id
    const title = body.title
    const context = body.context
    const starPrice = BigInt(body.starPrice)
    const starNum = BigInt(body.starNum)
    const expireTime = new Date(body.expireTime)

    const card = await this.repository.createCard(
      userId,
      title,
      context,
      starPrice,
      starNum,
      expireTime,
    )
    const newPrice = ctx.user.price - starPrice * starNum
    const user = await this.repository.changeUserPrice(userId, newPrice)
    ctx.user = user
    ctx.body = card
  }

  async starCard(ctx: Context) {
    const body = ctx.request.body
    const userId = ctx.user.id
    const cardId = body.cardId

    const newCard = await this.repository.starCard(userId, cardId)

    ctx.body = newCard
  }

  async getCard(ctx: Context) {
    const start = ctx.query.start

    const cards = await this.repository.getCardsByTimeSort(Number(start))
    console.log(cards.count)
    ctx.body = cards
  }
}
export default CardController
