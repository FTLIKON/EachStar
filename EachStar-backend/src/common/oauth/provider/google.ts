import { google, oauth2_v2 } from 'googleapis'
import { OAuth } from '../type'

export interface GoogleOAuthOption {
  clientId: string
  clientSecret: string
}

const getGoogleOAuthClient = (opt: GoogleOAuthOption) => {
  return new google.auth.OAuth2(opt)
}

type UserInfo = oauth2_v2.Schema$Userinfo

export class GoogleOAuth implements OAuth<UserInfo> {
  constructor(public opt: GoogleOAuthOption) {}

  getAuthorizeUrl(redirectUrl: string): string | Promise<string> {
    return getGoogleOAuthClient(this.opt).generateAuthUrl({
      redirect_uri: redirectUrl,
    })
  }

  async getUserInfo(code: string) {
    const client = getGoogleOAuthClient(this.opt)
    const { tokens } = await client.getToken(code)
    client.setCredentials(tokens)
    const oauth2 = google.oauth2({
      version: 'v2',
      auth: client,
    })
    const { data } = await oauth2.userinfo.get()
    return data
  }

  async getProfile(userInfo: UserInfo) {
    if (!userInfo.id || !userInfo.name) {
      throw new Error('cannot get user info')
    }
    return {
      id: userInfo.id,
      name: userInfo.name,
    }
  }
}
