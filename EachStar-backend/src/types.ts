import { Pool } from 'pg'
export interface Profile {
  id: string
  name: string
}
export interface UserExternal {
  id: bigint
  userId: UserId
  externalType: string
  externalId: string
  externalName: string
  createdAt: Date
  updatedAt: Date
}

export interface UserProfile {
  id: bigint
  userId: UserId
  userKey: string
  userProfile: string
  createdAt: Date
  updatedAt: Date
}

export interface UserPreference {
  id: bigint
  userId: UserId
  userKey: string
  userPreference: string
  createdAt: Date
  updatedAt: Date
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

export interface Verification {
  id: bigint
  userId: UserId
  intent: string
  approach: string
  target: string
  code: string
  status: string
  expireTime: Date
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

  setExternalForUser(user: User, type: string, profile: Profile): Promise<void>
  getByExternal(type: string, profile: Profile): Promise<User>
  createByExternal(type: string, profile: Profile): Promise<User>
  getUserExternalProfiles(id: UserId): Promise<Record<string, Profile>>

  setUserProfile(userId: UserId, key: string, value: string): Promise<void>
  getUserProfiles(userId: UserId): Promise<UserProfile>
  setUserPreference(userId: UserId, key: string, value: string): Promise<void>
  getUserPreferences(userId: UserId): Promise<UserPreference>

  createVerification(data: Verification): Promise<Verification | string>
  checkExistVerification(
    userId: UserId,
    approach: string,
    intent: string,
    status: string,
    createdAt: Date,
  ): Promise<Verification | undefined>
  checkVerificationExpired(
    userId: UserId,
    status: string,
    expireTime: Date,
  ): Promise<Verification | undefined>
  checkVerification(
    userId: UserId,
    intent: string,
    code: string,
    status: string,
    expireTime: Date,
  ): Promise<Verification | string | undefined>
  updateVerificationStatus(id: bigint, status: string): Promise<Verification>
}
