import type { Context, Next } from 'koa'
import { RepositoryPostgres } from '../stores'
export const authorization = async (ctx: Context, next: Next) => {
  const repository = new RepositoryPostgres()
  const userId = ctx.cookies.get('userId')
  const userName = ctx.cookies.get('userName')
  console.log(userId, userName)
  if (userId != undefined && userName != undefined) {
    let user = await repository.getUserById(BigInt(userId))
    if (user) {
      ctx.user = user
      ctx.cookies.set('userId', userId, { httpOnly: false })
    } else {
      user = await repository.createUser(BigInt(userId), userName, BigInt(0))
      ctx.user = user
    }
  }

  await next()
}
