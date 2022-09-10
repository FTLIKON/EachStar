import type { Context } from 'koa'
import type { Profile } from './type'
import { assignQs, parseQs } from '../../util/qs'
import AccountServiceConfig from '../../config'
import { User } from '../../types'
import { AccountRepositoryPostgres } from '../../stores'
import AuthService from '../auth'

export class OAuthService {
  accountRepository
  authService
  constructor() {
    this.accountRepository = new AccountRepositoryPostgres()
    this.authService = new AuthService()
  }

  get providers() {
    return AccountServiceConfig.oauth.providers
  }

  protected async setExternalForUser(
    user: User,
    type: string,
    profile: Profile,
  ) {
    await this.accountRepository.setExternalForUser(user, type, profile)
    return user
  }

  protected async getByExternal(type: string, profile: Profile): Promise<User> {
    return this.accountRepository.getByExternal(type, profile)
  }

  protected async createByExternal(
    type: string,
    profile: Profile,
  ): Promise<User> {
    return this.accountRepository.createByExternal(type, profile)
  }

  protected async getOrCreateByExternal(type: string, profile: Profile) {
    const user = await this.getByExternal(type, profile)
    if (user) return user
    return this.createByExternal(type, profile)
  }

  async authorize(ctx: Context, type: string) {
    const createProvider = this.providers[type]
    if (!createProvider) ctx.throw(400, 'unknown type')

    const provider = createProvider(ctx)

    const { code, state = '' } = ctx.query

    if (code && typeof code !== 'string') ctx.throw(400, 'invalid code')
    if (state && typeof state !== 'string') ctx.throw(400, 'invalid state')

    const { redirect } = parseQs(state)

    try {
      if (!code) {
        const { protocol, host, path } = ctx
        const redirectTo = `${protocol}://${host}${path}`
        const url = await provider.getAuthorizeUrl(redirectTo)
        ctx.redirect(assignQs(url, { state }))
      } else {
        const userInfo = await provider.getUserInfo(code, state)
        const profile = await provider.getProfile(userInfo)
        const user = ctx.user
          ? await this.setExternalForUser(ctx.user, type, profile)
          : await this.getOrCreateByExternal(type, profile)

        await provider.onSuccess?.(user)

        const token = await this.authService.setTokenToHeader(ctx, user)

        if (redirect) {
          ctx.redirect(assignQs(redirect, { token }))
        } else {
          ctx.body = { user, state }
        }
      }
    } catch (err: any) {
      if (redirect) {
        ctx.redirect(assignQs(redirect, { error: err.message }))
      } else {
        ctx.throw(500, err)
      }
    }
  }
}

export default OAuthService

export * from './provider'
