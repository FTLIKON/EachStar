import type { Context } from 'koa'
import { AppleOAuth, AppleOAuthOption } from './apple'
import { GoogleOAuth, GoogleOAuthOption } from './google'

export const OAuthProvider = {
  apple: (opt: AppleOAuthOption) => (ctx: Context) => new AppleOAuth(opt),
  google: (opt: GoogleOAuthOption) => (ctx: Context) => new GoogleOAuth(opt),
}
