import Router = require('koa-router')
import OAuthService from '../common/oauth'
export const getOAuthMiddleware = () => {
  const router = new Router({
    prefix: '/oauth',
  })
  router.all('/:type', async ctx => {
    const oauthService = new OAuthService()
    await oauthService.authorize(ctx, ctx.params.type)
  })
  return router.routes()
}
