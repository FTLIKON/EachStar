import type {
  AccountRepository,
  UserExternal,
  User,
  Verification,
  Profile,
  UserProfile,
  UserPreference,
} from '../types'
import { Pool } from 'pg'
import * as bcrypt from 'bcryptjs'

export enum VerificationStatus {
  valid = 'valid',
  used = 'used',
  expired = 'expired',
}

interface UserPO {
  id: string
  email?: string
  email_verified: boolean
  username: string
  display_name: string
  password: string
  created_at: Date
  updated_at: Date
}

interface UserExternalPO {
  id: string
  user_id: string
  external_type: string
  external_id: string
  external_name: string
  created_at: Date
  updated_at: Date
}

interface UserProfilePO {
  id: bigint
  user_id: bigint
  user_key: string
  user_profile: string
  created_at: Date
  updated_at: Date
}

interface UserPreferencePO {
  id: bigint
  user_id: bigint
  user_key: string
  user_preference: string
  created_at: Date
  updated_at: Date
}

interface VerificationPO {
  id: string
  user_id: string
  intent: string
  approach: string
  target: string
  code: string
  status: string
  expire_time: Date
  created_at: Date
  updated_at: Date
}

/**
 * User table DDL reference
 *
 * ```sql
 * CREATE TABLE "users" (
 *     "id" BIGINT NOT NULL,
 *     "email" TEXT,
 *     "email_verified" BOOLEAN NOT NULL DEFAULT false,
 *     "username" TEXT NOT NULL,
 *     "display_name" TEXT NOT NULL DEFAULT E'',
 *     "password" TEXT NOT NULL DEFAULT E'',
 *     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
 *     "updated_at" TIMESTAMP(3) NOT NULL,
 *     "extra" JSONB NOT NULL DEFAULT '{}',
 *
 *     CONSTRAINT "User_pkey" PRIMARY KEY ("id")
 * );
 *
 * -- CreateIndex
 * CREATE UNIQUE INDEX "uniq_email" ON "users"("email");
 *
 * -- CreateIndex
 * CREATE UNIQUE INDEX "uniq_username" ON "users"("username");
 * ```
 */
export class AccountRepositoryPostgres implements AccountRepository {
  pool:Pool
  constructor() {
    const connectionString =
      'postgresql://postgres:nes816224@localhost:5432/components-account'
    this.pool = new Pool({
      connectionString,
    })
  }

  genId() {
    return BigInt((Math.random() * Number.MAX_SAFE_INTEGER) << 0)
  }

  protected async getClient() {
    return this.pool.connect()
  }

  protected formatUserPo({
    id,
    email = '',
    email_verified,
    username,
    display_name,
    created_at,
    updated_at,
  }: UserPO): User {
    return {
      id: BigInt(id),
      email,
      emailVerified: email_verified,
      username,
      displayName: display_name,
      createdAt: created_at,
      updatedAt: updated_at,
    }
  }

  protected formatUserExternalPo({
    id,
    user_id,
    external_type,
    external_id,
    external_name,
    created_at,
    updated_at,
  }: UserExternalPO): UserExternal {
    return {
      id: BigInt(id),
      userId: BigInt(user_id),
      externalType: external_type,
      externalId: external_id,
      externalName: external_name,
      createdAt: created_at,
      updatedAt: updated_at,
    }
  }

  protected formatVerificationPO({
    id,
    user_id,
    intent,
    approach,
    target,
    code,
    status,
    expire_time,
    created_at,
    updated_at,
  }: VerificationPO): Verification {
    return {
      id: BigInt(id),
      userId: BigInt(user_id),
      intent,
      approach,
      target,
      code,
      status,
      expireTime: expire_time,
      createdAt: created_at,
      updatedAt: updated_at,
    }
  }

  protected formatUserProfilePO({
    id,
    user_id,
    user_key,
    user_profile,
    created_at,
    updated_at,
  }: UserProfilePO): UserProfile {
    return {
      id: BigInt(id),
      userId: BigInt(user_id),
      userKey: user_key,
      userProfile: user_profile,
      createdAt: created_at,
      updatedAt: updated_at,
    }
  }

  protected formatUserPreferencePO({
    id,
    user_id,
    user_key,
    user_preference,
    created_at,
    updated_at,
  }: UserPreferencePO): UserPreference {
    return {
      id: BigInt(id),
      userId: BigInt(user_id),
      userKey: user_key,
      userPreference: user_preference,
      createdAt: created_at,
      updatedAt: updated_at,
    }
  }

  async createUser(data: Partial<User & { password: string }>): Promise<User> {
    const {
      id = this.genId(),
      email = null,
      username = this.genId(),
      displayName = '',
      password,
    } = data

    const client = await this.getClient()

    const result = await client.query<UserPO>(
      `--sql
      INSERT INTO users (
        "id",
        "email",
        "username",
        "display_name",
        "password",
        "created_at",
        "updated_at"
      ) VALUES (
        $1,
        $2,
        $3,
        $4,
        $5,
        NOW(),
        NOW()
      ) RETURNING *
    `,
      [
        id,
        email,
        username,
        displayName,
        password ? await bcrypt.hash(password, 10) : '',
      ],
    )

    return this.formatUserPo(result.rows[0])
  }
  async updateUser(
    id: bigint,
    data: Partial<User & { password: string }>,
  ): Promise<User | undefined> {
    const { displayName, emailVerified, createdAt, ...rest } = data

    const updates = {
      display_name: displayName,
      email_verified: emailVerified,
      created_at: createdAt,
      ...rest,
    }
    if (updates.password) {
      updates.password = await bcrypt.hash(updates.password, 10)
    }
    const updateFields = Object.entries(updates).filter(
      ([_, v]) => v != undefined,
    )
    const updateSql = updateFields
      .map(([k], index) => {
        return `
        ${k} = $${index + 1}
        `.trim()
      })
      .join(',\n')
    const sql = `--sql
      UPDATE users SET
      ${updateSql},
      updated_at = NOW()
      WHERE id = $${updateFields.length + 1}
      RETURNING *
      `
    const client = await this.getClient()
    const result = await client.query<UserPO>(sql, [
      ...updateFields.map(([_, v]) => v),
      id,
    ])
    return result.rows[0] && this.formatUserPo(result.rows[0])
  }
  async getUserById(id: bigint): Promise<User | undefined> {
    const client = await this.getClient()
    const result = await client.query<UserPO>(
      `--sql
      SELECT * FROM users WHERE id = $1
      `,
      [id],
    )
    return result.rows[0] && this.formatUserPo(result.rows[0])
  }
  async checkUserPassword(id: bigint, password: string): Promise<boolean> {
    const client = await this.getClient()
    const result = await client.query(
      `--sql
      SELECT password FROM users WHERE id = $1
      `,
      [id],
    )
    return bcrypt.compare(password, result.rows[0]?.password || '')
  }
  async getUserByEmail(email: string): Promise<User | undefined> {
    const client = await this.getClient()
    const result = await client.query<UserPO>(
      `--sql
      SELECT * FROM users WHERE email = $1
      `,
      [email],
    )
    return result.rows[0] && this.formatUserPo(result.rows[0])
  }
  async getUserByUsername(username: string): Promise<User | undefined> {
    const client = await this.getClient()
    const result = await client.query<UserPO>(
      `--sql
      SELECT * FROM users WHERE username = $1
      `,
      [username],
    )
    return result.rows[0] && this.formatUserPo(result.rows[0])
  }
  async setExternalForUser(
    user: User,
    type: string,
    profile: Profile,
  ): Promise<void> {
    const client = await this.getClient()
    await client.query<UserExternalPO>(
      `--sql
      INSERT INTO user_external (
        "id",
        "user_id",
        "external_type",
        "external_id",
        "external_name",
        "created_at",
        "updated_at"
      ) VALUES (
        $1,
        $2,
        $3,
        $4,
        NOW(),
        NOW()
      ) RETURNING *
    `,
      [this.genId(), user.id, type, profile.id, profile.name],
    )
  }
  async getByExternal(type: string, profile: Profile): Promise<User> {
    const client = await this.getClient()
    const result = await client.query<UserExternalPO>(
      `--sql
      SELECT user_id FROM user_external WHERE (
        external_type = $1 AND
        external_id = $2 AND
        external_name = $3 AND
        )
      `,
      [type, profile.id, profile.name],
    )
    const userId = result.rows[0].user_id
    const user = this.getUserById(BigInt(userId))
    return <User>(<unknown>user)
  }

  async createByExternal(type: string, profile: Profile): Promise<User> {
    const user = await this.createUser({
      displayName: profile.name,
    })
    return user
  }

  async getUserExternalProfiles(id: bigint): Promise<Record<string, Profile>> {
    const client = await this.getClient()
    const result = await client.query<UserExternalPO>(
      `--sql
      SELECT * FROM user_external WHERE (
        user_id = $1
        )
      `,
      [id],
    )
    const userExternal = this.formatUserExternalPo(result.rows[0])
    return {
      profile: {
        id: userExternal.externalId,
        name: userExternal.externalName,
      },
    }
  }

  async setUserProfile(
    userId: bigint,
    key: string,
    value: string,
  ): Promise<void> {
    const client = await this.getClient()
    await client.query<UserProfilePO>(
      `--sql
      INSERT INTO user_profile (
        "id",
        "user_id",
        "user_key",
        "user_profile",
        "created_at",
        "updated_at"
      ) VALUES (
        $1,
        $2,
        $3,
        $4,
        NOW(),
        NOW()
      ) RETURNING *
    `,
      [this.genId(), userId, key, value],
    )
  }

  async getUserProfiles(userId: bigint): Promise<UserProfile> {
    const client = await this.getClient()
    const result = await client.query<UserProfilePO>(
      `--sql
      SELECT * FROM user_profile WHERE (
        user_id = $1
        )
    `,
      [userId],
    )

    return this.formatUserProfilePO(result.rows[0])
  }

  async setUserPreference(
    userId: bigint,
    key: string,
    value: string,
  ): Promise<void> {
    const client = await this.getClient()
    await client.query<UserPreferencePO>(
      `--sql
      INSERT INTO user_preference (
        "id",
        "user_id",
        "user_key",
        "user_preference",
        "created_at",
        "updated_at"
      ) VALUES (
        $1,
        $2,
        $3,
        $4,
        NOW(),
        NOW()
      ) RETURNING *
    `,
      [this.genId(), userId, key, value],
    )
  }
  async getUserPreferences(userId: bigint): Promise<UserPreference> {
    const client = await this.getClient()
    const result = await client.query<UserPreferencePO>(
      `--sql
      SELECT * FROM user_preference WHERE (
        user_id = $1
        )
    `,
      [userId],
    )

    return this.formatUserPreferencePO(result.rows[0])
  }

  async createVerification(data: Verification): Promise<Verification | string> {
    const {
      id,
      userId,
      intent,
      approach,
      target,
      code,
      status,
      expireTime,
      createdAt,
      updatedAt,
    } = data
    const client = await this.getClient()
    const result = await client.query<VerificationPO>(
      `--sql
      INSERT INTO verification (
        "id",
        "user_id",
        "intent",
        "approach",
        "target",
        "code",
        "status",
        "expire_time",
        "created_at",
        "updated_at"
      ) VALUES (
        $1,
        $2,
        $3,
        $4,
        $5,
        $6,
        $7,
        $8,
        $9,
        $10
      ) RETURNING *
      `,
      [
        id,
        userId,
        intent,
        approach,
        target,
        code,
        status,
        expireTime,
        createdAt,
        updatedAt,
      ],
    )

    return this.formatVerificationPO(result.rows[0])
  }
  async checkExistVerification(
    userId: bigint,
    approach: string,
    intent: string,
    status: string,
    createdAt: Date,
  ): Promise<Verification | undefined> {
    const client = await this.getClient()
    const result = await client.query<VerificationPO>(
      `--sql
    SELECT * FROM verification WHERE (
      user_id = $1 AND 
      approach = $2 AND 
      intent = $3 AND 
      status = $4 AND 
      created_at >= $5)
  `,
      [userId, approach, intent, status, createdAt],
    )
    if (result.rows[0] === undefined) return undefined
    else return this.formatVerificationPO(result.rows[0])
  }
  async checkVerificationExpired(
    userId: bigint,
    status: string,
    expireTime: Date,
  ): Promise<Verification | undefined> {
    const client = await this.getClient()
    const result = await client.query<VerificationPO>(
      `--sql
    SELECT * FROM verification WHERE (
      user_id = $1 AND 
      status = $2 AND 
      expire_time < $3)
  `,
      [userId, status, expireTime],
    )
    if (result.rows[0] == undefined) return undefined
    else return this.formatVerificationPO(result.rows[0])
  }
  async checkVerification(
    userId: bigint,
    intent: string,
    code: string,
    status: string,
    expireTime: Date,
  ): Promise<Verification | string | undefined> {
    const client = await this.getClient()
    const expiredVerification = await this.checkVerificationExpired(
      userId,
      status,
      expireTime,
    )
    if (expiredVerification) return VerificationStatus.expired
    const result = await client.query<VerificationPO>(
      `--sql
      SELECT * FROM verification WHERE (
        user_id = $1 AND 
        intent = $2 AND 
        code = $3 AND 
        status = $4 AND 
        expire_time >= $5)
        `,
      [userId, intent, code, status, expireTime],
    )
    if (result.rows[0] != undefined) {
      await this.updateVerificationStatus(
        this.formatVerificationPO(result.rows[0]).id,
        VerificationStatus.used,
      )
      return this.formatVerificationPO(result.rows[0])
    } else return undefined
  }
  async updateVerificationStatus(
    id: bigint,
    status: string,
  ): Promise<Verification> {
    const client = await this.getClient()
    const result = await client.query<VerificationPO>(
      `--sql
      UPDATE verification SET
      status = $1
      WHERE id = $2
      RETURNING *
    `,
      [status, id],
    )
    return this.formatVerificationPO(result.rows[0])
  }
}
