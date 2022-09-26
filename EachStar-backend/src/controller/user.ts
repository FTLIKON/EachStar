import { Context } from 'koa'
import { RepositoryPostgres } from '../stores'

export class UserController {
  repository
  constructor() {
    this.repository = new RepositoryPostgres()
  }

  async getSelf(ctx: Context) {
    ctx.assert(ctx.user, 403, 'user not found', {
      code: 'USER_NOT_FOUND',
    })
    ctx.body = ctx.user
  }

  async changeUserPrice(ctx: Context) {
    const body = ctx.request.body
    const userId = ctx.user.id
    const newPrice = body.newPrice
    const user = this.repository.changeUserPrice(userId, newPrice)
    ctx.body = user
  }
}
export default UserController
