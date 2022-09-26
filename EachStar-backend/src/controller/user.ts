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
}
export default UserController
