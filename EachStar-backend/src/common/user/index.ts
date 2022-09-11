import { AccountRepositoryPostgres } from '../../stores'
import isEmail from 'validator/lib/isEmail'
import { Context } from 'koa'
import { User } from '../../types'
import VerificationService from '../verification'
import { VerificationIntent, VerificationApproach } from '../verification'

export class UserService {
  verificationService
  accountRepository
  constructor() {
    this.verificationService = new VerificationService()
    this.accountRepository = new AccountRepositoryPostgres()
  }
  async getById(id: bigint): Promise<User | undefined> {
    return this.accountRepository.getUserById(id)
  }

  private async validateEmail(ctx: Context, email: string) {
    if (!isEmail(email))
      ctx.throw(400, 'invalid email', {
        code: 'INVALID_EMAIL',
      })
    const user = await this.accountRepository.getUserByEmail(email)
    ctx.assert(!user, 403, 'username already been taken', {
      code: 'USERNAME_ALREADY_BEEN_TAKEN',
    })
  }

  private async validateUsername(ctx: Context, username: string) {
    const user = await this.accountRepository.getUserByUsername(username)
    ctx.assert(!user, 403, 'username already been taken', {
      code: 'USERNAME_ALREADY_BEEN_TAKEN',
    })
  }

  async registerByEmail(ctx: Context, email: string, password: string) {
    await this.validateEmail(ctx, email)
    const user = await this.accountRepository.createUser({ email, password })
    await this.verificationService.startVerification(
      ctx,
      user,
      VerificationApproach.email,
      VerificationIntent.verifyEmail,
    )
    return user
  }

  async verifyEmail(ctx: Context, code = '', user?: User) {
    ctx.assert(user, 403, 'user not found', {
      code: 'USER_NOT_FOUND',
    })
    await this.verificationService.checkVerification(
      ctx,
      user,
      VerificationIntent.verifyEmail,
      code,
    )
    user.emailVerified = true
    user = await this.accountRepository.updateUser(user.id, user)
    return user
  }

  async registerByUsername(ctx: Context, username: string, password: string) {
    await this.validateUsername(ctx, username)
    const user = await this.accountRepository.createUser({ username, password })
    return user
  }

  async loginByPassword(
    ctx: Context,
    { username, email }: { username?: string; email?: string },
    password: string,
  ) {
    const user = username
      ? await this.accountRepository.getUserByUsername(username)
      : email
      ? await this.accountRepository.getUserByEmail(email)
      : undefined
    if (!user)
      ctx.throw(403, 'user not found', {
        code: 'USER_NOT_FOUND',
      })
    if (!(await this.accountRepository.checkUserPassword(user.id, password)))
      ctx.throw(403, 'password incorrect', {
        code: 'PASSWORD_INCORRECT',
      })
    return user
  }
}

export default UserService
