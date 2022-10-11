import { Context } from 'koa'
import { RepositoryPostgres } from '../stores'

export class UserController {
  repository
  constructor() {
    this.repository = new RepositoryPostgres()
  }

  async getSelf(ctx: Context) {
    const type = ctx.query.type
    const nowUser = type == 'GitHub' ? ctx.github_user : ctx.gitee_user
    ctx.assert(nowUser, 403, 'user not found', {
      code: 'USER_NOT_FOUND',
    })
    ctx.body = nowUser
  }

  async changeUserPrice(ctx: Context) {
    const body = ctx.request.body
    const type = body.type
    const userId = type == 'GitHub' ? ctx.github_user.id : ctx.gitee_user.id
    const newPrice = body.newPrice
    console.log(userId, newPrice)
    const user = await this.repository.changeUserPrice(type, userId, newPrice)
    ctx.body = user
  }
}
export default UserController
