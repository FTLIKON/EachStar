import type { Context } from 'koa'
import type { Profile } from './type'
import { assignQs, parseQs } from '../util/qs'
import { AccountServiceConfig } from '../config'
import { AccountRepository, User } from '../types'
import AuthService from '../auth'

export class OAuthService {
  constructor(
    public ctx: Context,
    public config: AccountServiceConfig,
    public repository: AccountRepository,
    public authService: AuthService,
  ) {}

  get providers() {
    return this.config.oauth.providers
  }

  protected async setExternalForUser(
    user: User,
    type: string,
    profile: Profile,
  ) {
    await this.repository.setExternalForUser(user, type, profile)
    return user
  }

  protected async getByExternal(type: string, profile: Profile): Promise<User> {
    return this.repository.getByExternal(type, profile)
  }

  protected async createByExternal(
    type: string,
    profile: Profile,
  ): Promise<User> {
    return this.repository.createByExternal(type, profile)
  }

  protected async getOrCreateByExternal(type: string, profile: Profile) {
    const user = await this.getByExternal(type, profile)
    if (user) return user
    return this.createByExternal(type, profile)
  }

  async authorize(type: string) {
    const createProvider = this.providers[type]
    if (!createProvider) this.ctx.throw(400, 'unknown type')

    const provider = createProvider(this.ctx)

    const { code, state = '' } = this.ctx.query

    if (code && typeof code !== 'string') this.ctx.throw(400, 'invalid code')
    if (state && typeof state !== 'string') this.ctx.throw(400, 'invalid state')

    const { redirect } = parseQs(state)

    try {
      if (!code) {
        const { protocol, host, path } = this.ctx
        const redirectTo = `${protocol}://${host}${path}`
        const url = await provider.getAuthorizeUrl(redirectTo)
        this.ctx.redirect(assignQs(url, { state }))
      } else {
        const userInfo = await provider.getUserInfo(code, state)
        const profile = await provider.getProfile(userInfo)
        const user = this.ctx.user
          ? await this.setExternalForUser(this.ctx.user, type, profile)
          : await this.getOrCreateByExternal(type, profile)

        await provider.onSuccess?.(user)

        const token = await this.authService.setTokenToHeader(user)

        if (redirect) {
          this.ctx.redirect(assignQs(redirect, { token }))
        } else {
          this.ctx.body = { user, state }
        }
      }
    } catch (err: any) {
      this.config.oauth.onError?.(err)
      if (redirect) {
        this.ctx.redirect(assignQs(redirect, { error: err.message }))
      } else {
        this.ctx.throw(500, err)
      }
    }
  }
}

export default OAuthService
