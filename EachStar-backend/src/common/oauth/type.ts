export interface Profile {
  id: string
  name: string
}

export interface OAuth<T = any> {
  getAuthorizeUrl(redirectUrl: string): string | Promise<string>
  getUserInfo(code: string, state: string): Promise<T>
  getProfile(userInfo: T): Promise<Profile>
  onSuccess?(user: any): Promise<void>
}
