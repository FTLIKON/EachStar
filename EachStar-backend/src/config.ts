import type { Context } from 'koa'

const authConfig = {
  githubClientId: 'cc67a3235e881990831d',
  githubClientSecret: 'e003aa5159e7159c2f43b5d81244ac914a9cb0c0',
  giteeClientId:
    'bea94d82fd25f1d4993f081f2dc8281bc31a35155460959d68eff2fa4c48b586',
  giteeClientSecret:
    '3152a3d1d35572c122807c550d5b2ede3612f79e9a61955167c035738e678fec',
  redirectPath: 'http://www.each-star.com/',
  giteeCallbackPath: 'http://www.each-star.com:3050/oauth/gitee/callback',
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
    sender: '"EachStar-server" <3147983767@qq.com>',
    title: '注册验证邮件',
    context: `<html><h1>您的验证码是：$$code$$</h1></html>`,
  },
}

const serviceConfig = {
  auth: authConfig,
  verification: verificationConfig,
  databaseUrl: 'postgresql://postgres:nes816224@localhost:5432/eachstar',
}
export default serviceConfig
