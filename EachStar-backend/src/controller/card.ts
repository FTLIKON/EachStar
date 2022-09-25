import { Context } from 'koa'
import { RepositoryPostgres } from '../stores'

export class CardController {
  repository
  constructor() {
    this.repository = new RepositoryPostgres()
  }

  async createCard(ctx: Context) {
    const userId = BigInt(ctx.params.userId)
    const title = ctx.params.title
    const context = ctx.params.context
    const starPrice = BigInt(ctx.params.starPrice)
    const expireTime = new Date(ctx.params.expireTime)
    const card = this.repository.createCard(
      userId,
      title,
      context,
      starPrice,
      expireTime,
    )
    ctx.body = card
  }
}
export default CardController
