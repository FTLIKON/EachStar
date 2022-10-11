import type { Context, Next } from 'koa'
import { RepositoryPostgres } from '../stores'
export const authorization = async (ctx: Context, next: Next) => {
  const repository = new RepositoryPostgres()
  const githubId = ctx.cookies.get('githubId')
  const githubName = ctx.cookies.get('githubName')
  const githubAvatar = ctx.cookies.get('githubAvatar')

  const giteeId = ctx.cookies.get('giteeId')
  const giteeName = ctx.cookies.get('giteeName')
  const giteeAvatar = ctx.cookies.get('giteeAvatar')

  if (
    githubId != undefined &&
    githubName != undefined &&
    githubAvatar != undefined
  ) {
    let user = await repository.getUserById('GitHub', BigInt(githubId))
    if (!user) {
      user = await repository.createUser(
        BigInt(githubId),
        'GitHub',
        githubName,
        githubAvatar,
        BigInt(0),
      )
      ctx.github_user = user
    }
  }

  if (
    giteeId != undefined &&
    giteeName != undefined &&
    giteeAvatar != undefined
  ) {
    let user = await repository.getUserById('Gitee', BigInt(giteeId))
    if (!user) {
      user = await repository.createUser(
        BigInt(giteeId),
        'Gitee',
        giteeName,
        giteeAvatar,
        BigInt(0),
      )
      ctx.gitee_user = user
    }
  }
  await next()
}
