import type { Context } from 'koa'


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

const accountServiceConfig = {
  auth: authConfig,
  verification: verificationConfig,
  databaseUrl :'postgresql://postgres:nes816224@localhost:5432/eachstar'
}
export default accountServiceConfig
