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
    const userId = ctx.user.id
    const start = ctx.query.start
    const cards = await this.repository.getCardsByTimeSort(Number(start))
    console.log(cards.count)
    const userStarred = await this.repository.getUserStarred(userId)
    console.log(userStarred)
    let userStarredCardId = []
    for (let index in userStarred) {
      userStarredCardId.push(userStarred[index].cardId)
    }
    console.log(userStarredCardId)
    console.log(userStarredCardId.includes(cards.data[0].id))
    console.log(userStarredCardId.indexOf(cards.data[0].id))
    for (let index in cards.data) {
      if (userStarredCardId.includes(cards.data[index].id)) {
        cards.data[index]['starred'] = true
      } else {
        cards.data[index]['starred'] = false
      }
    }

    console.log(cards)
    ctx.body = cards
  }
}
export default CardController
