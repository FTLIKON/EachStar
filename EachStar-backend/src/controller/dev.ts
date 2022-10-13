import { Context } from 'koa'
import { RepositoryPostgres } from '../stores'

export class DevController {
  repository
  constructor() {
    this.repository = new RepositoryPostgres()
  }

  async changeUserPrice(ctx: Context) {
    const body = ctx.request.body
    const type = body.type
    const userId = type == 'GitHub' ? ctx.github_user.id : ctx.gitee_user.id
    const newPrice = body.newPrice
    const user = await this.repository.changeUserPrice(type, userId, newPrice)
    ctx.body = user
  }

}
export default UserController
