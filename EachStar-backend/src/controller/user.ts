import { Context } from 'koa'
import UserService from '../common/user'
import AuthService from '../common/auth'
import { AccountRepositoryPostgres } from '../stores'

export class UserController {
  userService
  authService
  accountRepository
  constructor() {
    this.userService = new UserService()
    this.authService = new AuthService()
    this.accountRepository = new AccountRepositoryPostgres()
  }

  async getUser(ctx: Context) {
    const userId = ctx.params.id
    const user = await this.userService.getById(userId)
    ctx.assert(ctx.user, 403, 'user not found', {
      code: 'USER_NOT_FOUND',
    })
    ctx.body = user
  }

  async getSelf(ctx: Context) {
    ctx.assert(ctx.user, 403, 'user not found', {
      code: 'USER_NOT_FOUND',
    })
    ctx.body = ctx.user
  }

  async setPreference(ctx: Context) {
    ctx.assert(ctx.user, 401)
    const { key } = ctx.query
    let value: any
    if (ctx.request.body) value = ctx.request.body.value
    ctx.assert(typeof key === 'string' && key.length > 0, 400, 'invalid key')
    ctx.assert(value != null, 400, 'invalid value')
    await this.accountRepository.setUserPreference(ctx.user.id, key, value)
    ctx.status = 204
  }

  async getPreferences(ctx: Context) {
    ctx.assert(ctx.user, 401)
    const preferences = await this.accountRepository.getUserPreferences(
      ctx.user.id,
    )
    ctx.body = preferences
  }

  async setProfile(ctx: Context) {
    ctx.assert(ctx.user, 401)
    const { key } = ctx.query
    let value: any
    if (ctx.request.body) value = ctx.request.body.value
    ctx.assert(typeof key === 'string' && key.length > 0, 400, 'invalid key')
    ctx.assert(value != null, 400, 'invalid value')
    await this.accountRepository.setUserProfile(ctx.user.id, key, value)
    ctx.status = 204
  }

  async getProfiles(ctx: Context) {
    const id = ctx.params.id
    const userId = id === '@me' ? ctx.user?.id : id
    ctx.assert(userId, 400)
    const profiles = await this.accountRepository.getUserProfiles(userId)
    ctx.body = profiles
  }

  async getExternalProfiles(ctx: Context) {
    ctx.assert(ctx.user, 401)
    const profiles = await this.accountRepository.getUserExternalProfiles(
      ctx.user.id,
    )
    ctx.body = profiles
  }

  async checkEmailCode(ctx: Context) {
    let userId: any
    let code: any
    if (ctx.request.body) {
      userId = ctx.request.body.id
      code = ctx.request.body.code
    }
    let user = await this.userService.getById(userId)
    user = await this.userService.verifyEmail(ctx, code, user)
    ctx.body = user
  }
}
export default UserController