import Router = require('koa-router')
import GitHubAuthController from '../controller/github_auth'
import GiteeAuthController from '../controller/gitee_auth'
export const getOAuthMiddleware = () => {
  const router = new Router({
    prefix: '/oauth',
  })
  const gitHubAuthController = new GitHubAuthController()
  router.get(
    '/github/login',
    gitHubAuthController.redirectGithubAuth.bind(gitHubAuthController),
  )
  router.get(
    '/github/callback',
    gitHubAuthController.githubCallBack.bind(gitHubAuthController),
  )
  router.get(
    '/github/logout',
    gitHubAuthController.userLogout.bind(gitHubAuthController),
  )

  const giteeAuthController = new GiteeAuthController()
  router.get(
    '/gitee/login',
    giteeAuthController.redirectGithubAuth.bind(giteeAuthController),
  )
  router.get(
    '/gitee/callback',
    giteeAuthController.giteeCallBack.bind(giteeAuthController),
  )
  router.get(
    '/gitee/logout',
    giteeAuthController.userLogout.bind(giteeAuthController),
  )
  return router.routes()
}
