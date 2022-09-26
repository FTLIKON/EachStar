import type { Context } from 'koa'

const authConfig = {
  githubClientId: 'cc67a3235e881990831d',
  githubClientSecret: 'e003aa5159e7159c2f43b5d81244ac914a9cb0c0',
  redirectPath: 'http://119.91.192.183:12377/',
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

const serviceConfig = {
  auth: authConfig,
  verification: verificationConfig,
  databaseUrl: 'postgresql://postgres:nes816224@localhost:5432/eachstar',
}
export default serviceConfig
