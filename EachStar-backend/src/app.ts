import koaBody from 'koa-body'
import Koa from 'koa'
import cors from 'koa2-cors'
import { authorization } from './middleware/authorization'
import { getOAuthMiddleware } from './routers/oauth'
import { getCardMiddleware } from './routers/card'
import { getUserApiMiddleware } from './routers/user'
import { getDevApiMiddleware } from './routers/dev'
import http from 'http'
import https from 'https'
import fs from 'fs'
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
      return 'http://www.each-star.com'
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

console.log(
  '########################\n Eachstar server start!!\n########################\n\n',
)

http.createServer(app.callback()).listen(3050)
const options = {
  key: fs.readFileSync('./ssl/each-star.com.key', 'utf8'),
  cert: fs.readFileSync('./ssl/each-star.com.pem', 'utf8'),
}
https.createServer(options, app.callback()).listen(3001)
