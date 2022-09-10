import { Context } from 'koa'
import Ajv, { JSONSchemaType, ValidateFunction } from 'ajv'
import AccountServiceConfig from '../config'
import UserService from '../common/user'
import AuthService from '../common/auth'

export interface LoginOrRegisterPayload {
  email?: string
  username?: string
  password: string
}

export class AuthController {
  loginOrRegisterSchemaValidator: ValidateFunction<LoginOrRegisterPayload>

  getLoginOrRegisterSchema(): JSONSchemaType<LoginOrRegisterPayload> {
    return {
      type: 'object',
      properties: {
        email: {
          type: 'string',
          nullable: true,
        },
        username: {
          type: 'string',
          nullable: true,
          minLength:
            AccountServiceConfig.auth.constrains?.username?.minLength ?? 1,
          maxLength:
            AccountServiceConfig.auth.constrains?.username?.maxLength ?? 200,
        },
        password: {
          type: 'string',
          minLength:
            AccountServiceConfig.auth.constrains?.password?.minLength ?? 1,
          maxLength:
            AccountServiceConfig.auth.constrains?.password?.maxLength ?? 200,
        },
      },
      required: ['password'],
    }
  }

  userService
  authService
  constructor() {
    const ajv = new Ajv()
    this.loginOrRegisterSchemaValidator = ajv.compile(
      this.getLoginOrRegisterSchema(),
    )
    this.userService = new UserService()
    this.authService = new AuthService()
  }

  private getLoginOrRegisterPayload(ctx: Context) {
    const payload = ctx.request.body
    ctx.assert(this.loginOrRegisterSchemaValidator(payload), 400)
    return payload
  }

  async register(ctx: Context) {
    const { username, email, password } = this.getLoginOrRegisterPayload(ctx)

    const user = username
      ? await this.userService.registerByUsername(ctx, username, password)
      : email
      ? await this.userService.registerByEmail(ctx, email, password)
      : undefined
    if (!user) ctx.throw(400)
    ctx.user = user
    await this.authService.setTokenToHeader(ctx, user)
    ctx.body = user
  }

  async login(ctx: Context) {
    const { username, email, password } = this.getLoginOrRegisterPayload(ctx)
    const user = await this.userService.loginByPassword(
      ctx,
      {
        username,
        email,
      },
      password,
    )

    ctx.user = user
    await this.authService.setTokenToHeader(ctx, user)
    ctx.body = user
  }
}
export default AuthController