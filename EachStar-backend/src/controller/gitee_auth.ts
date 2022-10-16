import axios from 'axios'
import { Context } from 'koa'
import { RepositoryPostgres } from '../stores'
import serviceConfig from '../config'
export class GiteeAuthController {
  repository
  constructor() {
    this.repository = new RepositoryPostgres()
  }

  async userLogout(ctx: Context) {
    ctx.cookies.set('giteeId', '', { maxAge: 0 })
    ctx.cookies.set('giteeName', '', { maxAge: 0 })
    ctx.cookies.set('giteeAvatar', '', { maxAge: 0 })
    ctx.cookies.set('giteeToken', '', { maxAge: 0 })
    ctx.body = {}
  }

  async redirectGithubAuth(ctx: Context) {
    //重定向到认证接口,并配置参数
    var path = 'https://gitee.com/oauth/authorize'
    path +=
      '?client_id=' +
      serviceConfig.auth.giteeClientId +
      '&response_type=code&scope=user_info%20projects' +
      '&redirect_uri=' +
      serviceConfig.auth.giteeCallbackPath
    //将地址及参数返回前端
    ctx.status = 301
    ctx.redirect(path) //重定向到请求页面
  }

  async giteeCallBack(ctx: Context) {
    const code = ctx.query.code //返回的授权码
    const params = JSON.stringify({
      client_id: serviceConfig.auth.giteeClientId,
      client_secret: serviceConfig.auth.giteeClientSecret,
      code: code,
      redirect_uri: serviceConfig.auth.giteeCallbackPath,
    })
    //使用这个授权码，向 Gitee 请求令牌
    let res = await axios({
      method: 'post',
      url: 'https://gitee.com/oauth/token?grant_type=authorization_code',
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json',
      },
      data: params,
    })

    const accessToken = res.data.access_token

    //再通过令牌获取用户信息
    res = await axios({
      method: 'get',
      url: 'https://gitee.com/api/v5/user?access_token=' + accessToken,
    })

    ctx.cookies.set('giteeId', res.data.id, { httpOnly: false }) //用户id
    ctx.cookies.set('giteeName', res.data.login, {
      httpOnly: false,
    }) //用户名称
    ctx.cookies.set('giteeAvatar', res.data.avatar_url, {
      httpOnly: false,
    }) //用户图片
    ctx.cookies.set('giteeToken', accessToken, {
      httpOnly: false,
    }) //用户giteeToken

    ctx.status = 301
    ctx.redirect(serviceConfig.auth.giteeRedirectPath) //重定向到请求页面
  }
}
export default GiteeAuthController
