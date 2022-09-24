import { Pool } from 'pg'
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

type UserId = bigint

export interface User {
  id: UserId
  username: string
  displayName: string
  email: string
  emailVerified: boolean
  createdAt: Date
  updatedAt: Date
}

export interface AccountRepository {
  pool: Pool
  createUser(data: Partial<User & { password: string }>): Promise<User>
  updateUser(
    id: UserId,
    data: Partial<User & { password: string }>,
  ): Promise<User | undefined>
  getUserById(id: UserId): Promise<User | undefined>
  checkUserPassword(id: UserId, password: string): Promise<boolean>
  getUserByEmail(email: string): Promise<User | undefined>
  getUserByUsername(username: string): Promise<User | undefined>

}
