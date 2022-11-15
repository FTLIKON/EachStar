import { Context } from 'koa'
import { RepositoryPostgres } from '../stores'

export class UserController {
  repository
  constructor() {
    this.repository = new RepositoryPostgres()
  }

  /**
   * 获取用户的个人信息
   */
  async getSelf(ctx: Context) {
    const type = ctx.query.type
    const nowUser = type == 'GitHub' ? ctx.github_user : ctx.gitee_user
    ctx.assert(nowUser, 403, 'user not found', {
      code: 'USER_NOT_FOUND',
    })
    ctx.body = nowUser
  }
}
export default UserController
