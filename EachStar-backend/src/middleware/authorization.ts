import type { Context, Next } from 'koa'
import { AuthService } from '../common/auth'

export const authorization = async (ctx: Context, next: Next) => {
  const authService = new AuthService()
  const token =
    ctx.headers.authorization || ctx.cookies.get(authService.getTokenKey())
  if (token) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const handledToken = token.split(' ').pop()!
    const user = await authService.getUserFromToken(ctx, handledToken)
    if (user) {
      ctx.user = user
      await authService.setTokenToHeader(ctx, user)
    }
  }

  await next()
}
