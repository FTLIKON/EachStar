import Router = require('koa-router')
import axios from 'axios'
export const getOAuthMiddleware = () => {
  const router = new Router({
    prefix: '/oauth',
  })
  const config = {
    client_id: 'cc67a3235e881990831d', //github生成的ID及密码
    client_secret: 'e003aa5159e7159c2f43b5d81244ac914a9cb0c0',
  }
  let redirectPath: any
  router.get('/github/login', async ctx => {
    redirectPath = ctx.query.path
    console.log(redirectPath)
    var dataStr = new Date().valueOf()
    //重定向到认证接口,并配置参数
    var path = 'https://github.com/login/oauth/authorize'
    path += '?client_id=' + config.client_id
    //将地址及参数返回前端
    ctx.status = 301
    ctx.redirect(path) //重定向到请求页面
  })
  //认证后的github回调
  router.get('/github/callback', async ctx => {
    console.log('callback...')
    const code = ctx.query.code //返回的授权码
    const params = JSON.stringify({
      client_id: config.client_id,
      client_secret: config.client_secret,
      code: code,
    })
    console.log('code', code)
    //使用这个授权码，向 GitHub 请求令牌
    let res = await axios({
      method: 'post',
      url: 'https://github.com/login/oauth/access_token',
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json',
      },
      data: params,
    })

    // const access_token = JSON.parse(res.data).access_token

    const accessToken = res.data.access_token

    console.log(accessToken)
    //再通过令牌获取用户信息
    res = await axios({
      method: 'get',
      url: 'https://api.github.com/user',
      headers: {
        Authorization: 'token ' + accessToken,
      },
    })
    console.log('userAccess:', res.data)
    // ctx.body = res.data
    ctx.cookies.set('user', res.data.login) //用户名称
    ctx.cookies.set('icon', res.data.avatar_url) //用户图片
    console.log(redirectPath)
    ctx.status = 301
    ctx.redirect(redirectPath) //重定向到请求页面
  })
  return router.routes()
}
