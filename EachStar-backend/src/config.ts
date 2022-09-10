import type { Context } from 'koa'
import { GoogleOAuth } from './common/oauth/provider/google'
import { GoogleOAuthOption } from './common/oauth/provider/google'

const googleOAuthOption: GoogleOAuthOption = {
  clientId: '',
  clientSecret: '',
}

const authConfig = {
  tokenAge: '7d',
  tokenKey: 'token',
  jwtSecret: 'test',
  jwtPrivateKey: '',
  jwtPublicKey: '',
  constrains: {
    username: {
      minLength: 1,
      maxLength: 200,
    },
    password: {
      minLength: 1,
      maxLength: 200,
    },
  },
}

const verificationConfig = {
  emailServer: {
    smtp: {
      host: 'smtp.qq.com',
      port: 465,
      secure: true,
      user: '3147983767@qq.com',
      pass: 'uyifftxjfooodgdi',
    },
    sender: '"mew-server" <3147983767@qq.com>',
    title: '注册验证邮件',
    context: `<html><h1>您的验证码是：$$code$$</h1></html>`,
  },
}
const googleProvider = (ctx: Context) => {
  return new GoogleOAuth(googleOAuthOption)
}
const oAuthConfig = {
  providers: { googleProvider },
}

const accountServiceConfig = {
  auth: authConfig,
  oauth: oAuthConfig,
  verification: verificationConfig,
}

export default accountServiceConfig
