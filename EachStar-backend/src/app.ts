import koaBody from 'koa-body'
import Koa from 'koa'
import { getOAuthMiddleware } from './routers/oauth'

declare class BigInt {
  toJSON(): string
}

BigInt.prototype.toJSON = function () {
  return this.toString()
}

const app = new Koa()
app.use(koaBody())
//app.use(authorization)
//app.use(getAuthMiddleware())
app.use(getOAuthMiddleware())
//app.use(getUserApiMiddleware())

console.log(
  '########################\n Eachstar server start!!\n########################\n\n',
)

app.listen(3050)
