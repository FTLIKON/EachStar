import koaBody from 'koa-body'
import Koa from 'koa'
import cors from 'koa2-cors'
import { authorization } from './middleware/authorization'
import { getOAuthMiddleware } from './routers/oauth'
import { getCardMiddleware } from './routers/card'
import { getUserApiMiddleware } from './routers/user'
import { getDevApiMiddleware } from './routers/dev'
import serviceConfig from './config'
import https from 'https'
import fs from 'fs'
import path from 'path'

declare class BigInt {
  toJSON(): string
}

BigInt.prototype.toJSON = function () {
  return this.toString()
}

const app = new Koa()
app.use(
  cors({
    origin: function (ctx) {
      return 'https://each-star.com:3443'
    },
    exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'],
    maxAge: 5,
    credentials: true,
    allowMethods: ['GET', 'POST', 'DELETE'], //设置允许的HTTP请求类型
    allowHeaders: ['Content-Type', 'Authorization', 'Accept'],
  }),
)
app.use(koaBody())
app.use(authorization)
app.use(getOAuthMiddleware())
app.use(getCardMiddleware())
app.use(getUserApiMiddleware())
app.use(getDevApiMiddleware())

const options = {
  key: fs.readFileSync(path.join(__dirname, './ssl/each-star.com.key')),
  cert: fs.readFileSync(path.join(__dirname, './ssl/each-star.com.pem')),
}
https.createServer(options, app.callback()).listen(serviceConfig.apiPort)

console.log(
  '########################\n Eachstar server start!!\n########################\n\n',
)
