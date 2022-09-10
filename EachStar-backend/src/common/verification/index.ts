import { randInt } from '../../util/rand'
import { htmlToText } from 'html-to-text'
import * as SMTPTransport from 'nodemailer/lib/smtp-transport'
import { Verification, User } from '../../types'
import { AccountRepositoryPostgres } from '../../stores'
import type { Context } from 'koa'
import { createTransport } from 'nodemailer'
import AccountServiceConfig from '../../config'

enum VerificationStatus {
  valid = 'valid',
  used = 'used',
  expired = 'expired',
}

export enum VerificationApproach {
  email = 'email',
}

export enum VerificationIntent {
  verifyEmail = 'verify_email',
  changeEmail = 'change_email',
  resetPassword = 'reset_password',
  forgetPassword = 'forget_password',
}

export class VerificationService {
  verificationService
  accountRepository
  constructor() {
    this.verificationService = new VerificationService()
    this.accountRepository = new AccountRepositoryPostgres()
  }

  getMailClient = () => {
    const poolOptions = {
      pool: true,
    }
    const smtpOptions = {
      host: AccountServiceConfig.verification.emailServer.smtp.host,
      port: AccountServiceConfig.verification.emailServer.smtp.port,
      secure: AccountServiceConfig.verification.emailServer.smtp.secure,
      auth: {
        user: AccountServiceConfig.verification.emailServer.smtp.user,
        pass: AccountServiceConfig.verification.emailServer.smtp.pass,
      },
    }
    const nodemailerOptions: SMTPTransport.Options = {
      ...poolOptions,
      ...smtpOptions,
    }
    return createTransport(nodemailerOptions)
  }

  protected genCode() {
    return randInt(6)
  }
  protected genId() {
    return BigInt((Math.random() * Number.MAX_SAFE_INTEGER) << 0)
  }
  protected unreachable = (message?: string): never => {
    throw new Error('unreachable: ' + message)
  }

  protected getTarget(user: User, approach: string) {
    if (approach === VerificationApproach.email) return user.email
    this.unreachable()
  }

  async getEmailTemplate(code: string) {
    return {
      subject: AccountServiceConfig.verification.emailServer.title,
      content: AccountServiceConfig.verification.emailServer.context.replace(
        '$$code$$',
        code,
      ),
    }
  }

  async sendMail(to: string, approach: string, code: string) {
    const tpl = await this.getEmailTemplate(code)
    const mailClient = this.getMailClient()
    const subject = tpl.subject
    const html = tpl.content
    const text = htmlToText(html)
    const result = await mailClient.sendMail({
      from: AccountServiceConfig.verification.emailServer.sender,
      to,
      subject,
      text,
      html,
    })
  }

  send(verification: Verification, user: User) {
    if (verification.approach === VerificationApproach.email)
      return this.sendMail(
        verification.target,
        verification.approach,
        verification.code,
      )

    this.unreachable()
  }

  async startVerification(
    ctx: Context,
    user: User | undefined,
    approach: string,
    intent: string,
  ) {
    const accountRepositoryPostgres = new AccountRepositoryPostgres()
    ctx.assert(user, 403, 'user not found', {
      code: 'USER_NOT_FOUND',
    })
    const target = this.getTarget(user, approach)
    if (!target)
      ctx.throw(403, 'No verification approach can be reached', {
        code: 'NO_VERIFICATION_APPROACH_CAN_BE_REACHED',
      })
    const existVerification =
      await accountRepositoryPostgres.checkExistVerification(
        user.id,
        approach,
        intent,
        VerificationStatus.valid,
        new Date(Date.now() - 1 * 60 * 1000),
      )

    if (existVerification != undefined) {
      ctx.throw(403, 'same verification has been started', {
        code: 'VERIFICATION_ALREADY_BEEN_STARTED',
      })
    }

    const verification = await this.accountRepository.createVerification({
      id: this.genId(),
      userId: user.id,
      intent,
      approach,
      target,
      code: this.genCode(),
      status: VerificationStatus.valid,
      expireTime: new Date(Date.now() + 30 * 60 * 1000),
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    await this.send(<Verification>verification, user)
  }

  async checkVerification(
    ctx: Context,
    user: User,
    intent: string,
    code?: string,
  ) {
    ctx.assert(code, 403, 'No verification code was provided', {
      code: 'NO_VERIFICATION_CODE_WAS_PROVIDED',
    })
    const verification = await this.accountRepository.checkVerification(
      user.id,
      intent,
      code,
      VerificationStatus.valid,
      new Date(),
    )

    if (verification == VerificationStatus.expired) {
      ctx.throw(403, 'verification was expired', {
        code: 'VERIFICATION_WAS_EXPIRED',
      })
    }

    if (!verification)
      ctx.throw(403, 'Invalid verification code', {
        code: 'INVALID_VERIFICATION_CODE',
      })
  }
}

export default VerificationService
