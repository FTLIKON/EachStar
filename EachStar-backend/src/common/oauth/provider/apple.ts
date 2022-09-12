import * as jwt from 'jsonwebtoken'
import qs from 'qs'
import JwksClient from 'jwks-rsa'
import type { OAuth } from '../type'
import axios from 'axios'

const appleJwksClient = JwksClient({
  jwksUri: 'https://appleid.apple.com/auth/keys',
})

const generateAppleClientSecret = async (opt: AppleOAuthOption) => {
  return new Promise<string>(resolve => {
    jwt.sign(
      {
        iss: opt.teamId,
        aud: 'https://appleid.apple.com',
        sub: opt.clientId,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 86400 * 180,
      },
      opt.privateKey,
      {
        keyid: opt.keyId,
        algorithm: 'ES256',
      },
      (_, encoded) => {
        resolve(encoded || '')
      },
    )
  })
}

export interface AppleOAuthOption {
  teamId: string
  keyId: string
  clientId: string
  privateKey: string
}

export class AppleOAuth implements OAuth {
  constructor(public opt: AppleOAuthOption) {}

  getAuthorizeUrl(redirectUrl: string): string | Promise<string> {
    const query = qs.stringify({
      response_type: 'code',
      client_id: this.opt.clientId,
      redirect_uri: redirectUrl,
      response_mode: 'query',
    })
    return `https://appleid.apple.com/auth/authorize?${query}`
  }

  async verifyIdToken(idToken: string) {
    const data = jwt.decode(idToken, { complete: true })
    const key = await appleJwksClient.getSigningKey(data?.header.kid)
    await jwt.verify(idToken, key.getPublicKey(), {
      issuer: 'https://appleid.apple.com',
      audience: this.opt.clientId,
    })
    return data?.payload
  }

  async getUserInfo(code: string): Promise<any> {
    const clientSecret = await generateAppleClientSecret(this.opt)
    const requestBody = qs.stringify({
      grant_type: 'authorization_code',
      code,
      client_id: this.opt.clientId,
      client_secret: clientSecret,
    })

    const res = await axios.post(
      `https://appleid.apple.com/auth/token`,
      requestBody,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      },
    )
    return this.verifyIdToken(res.data.id_token)
  }

  async getProfile(payload: any) {
    return {
      id: payload.sub,
      name: payload.email,
    }
  }
}
