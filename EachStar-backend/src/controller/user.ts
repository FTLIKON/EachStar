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
    const user = ctx.user
    user['icon'] = ctx.cookies.get('userIcon')
    ctx.body = user
  }

  async changeUserPrice(ctx: Context) {
    const body = ctx.request.body
    const userId = ctx.user.id
    const newPrice = body.newPrice
    console.log(userId, newPrice)
    const user = await this.repository.changeUserPrice(userId, newPrice)
    ctx.body = user
  }
}
export default UserController
