import UserService from '../common/user'
import * as jwt from 'jsonwebtoken'
import AccountServiceConfig from '../config'
import ms from 'ms'
import type { Context } from 'koa'
import { User } from '../types'

export class AuthService {
  getJwtSignSecret() {
    const { auth } = AccountServiceConfig
    return 'jwtSecret' in auth ? auth.jwtSecret : auth.jwtPrivateKey
  }

  getJwtVerifySecret() {
    const { auth } = AccountServiceConfig
    return 'jwtSecret' in auth ? auth.jwtSecret : auth.jwtPublicKey
  }

  getTokenAge() {
    const { tokenAge = '7d' } = AccountServiceConfig.auth
    return typeof tokenAge === 'string' ? ms(tokenAge) : tokenAge
  }

  getTokenKey() {
    return AccountServiceConfig.auth.tokenKey || 'token'
  }

  async generateTokenForUser(
    user: User,
    payload: string | Buffer | object = {},
  ) {
    return new Promise<string>((resolve, reject) => {
      jwt.sign(
        payload,
        this.getJwtSignSecret(),
        {
          expiresIn: (this.getTokenAge() / 1000) << 0,
          subject: user.id.toString(),
        },
        (err: any, encoded: any) => {
          if (err) {
            reject(err)
          } else {
            resolve(encoded || '')
          }
        },
      )
    })
  }

  async verifyToken(token: string) {
    return new Promise<jwt.JwtPayload>((resolve, reject) => {
      jwt.verify(
        token,
        this.getJwtVerifySecret(),
        {
          complete: false,
        },
        (err: any, decoded: any) => {
          if (err) {
            reject(err)
          } else {
            resolve(decoded as jwt.JwtPayload)
          }
        },
      )
    })
  }

  async getUserFromToken(ctx: Context, token: string) {
    const userService = new UserService()
    const payload = await this.verifyToken(token).catch(err => {
      if (
        err instanceof jwt.TokenExpiredError ||
        err instanceof jwt.NotBeforeError
      ) {
        ctx.throw(401, 'token expired', {
          code: 'TOKEN_EXPIRED',
        })
      }

      ctx.throw(401, 'invalid token', {
        code: 'INVALID_TOKEN',
      })
    })

    if (payload.sub) return userService.getById(BigInt(payload.sub))
  }

  async setTokenToHeader(ctx: Context, user: User) {
    const token = await this.generateTokenForUser(user)
    const tokenKey = this.getTokenKey()
    ctx.set(tokenKey, token)
    // for OAuth
    ctx.cookies.set(tokenKey, token, {
      httpOnly: true,
      maxAge: this.getTokenAge(),
    })
    return token
  }
}

export default AuthService
