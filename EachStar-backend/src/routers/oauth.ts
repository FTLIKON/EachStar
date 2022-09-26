import Router = require('koa-router')
import OAuthController from '../controller/oauth'
export const getOAuthMiddleware = () => {
  const router = new Router({
    prefix: '/oauth',
  })
  const oAuthController = new OAuthController()
  router.get(
    '/github/login',
    oAuthController.redirectGithubAuth.bind(OAuthController),
  )
  router.get(
    '/github/callback',
    oAuthController.githubCallBack.bind(OAuthController),
  )

  return router.routes()
}
