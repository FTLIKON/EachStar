import type { RepositoryType, User, Card, UserStar } from '../types'
import { Pool, PoolClient, Client } from 'pg'
import * as bcrypt from 'bcryptjs'
import serviceConfig from '../config'

interface UserPO {
  id: bigint
  github_name: string
  price: bigint
  created_at: Date
  updated_at: Date
}

interface CardPO {
  id: bigint
  user_id: bigint
  title: string
  context: string
  star_price: bigint
  star_num: bigint
  expire_time: Date
  created_at: Date
  updated_at: Date
}

interface UserStarPO {
  id: bigint
  user_id: bigint
  card_id: bigint
  created_at: Date
}

export class RepositoryPostgres implements RepositoryType {
  client: Client
  constructor() {
    const connectionString = serviceConfig.databaseUrl
    this.client = new Client({
      connectionString,
    })
    this.client.connect()
  }

  genId() {
    return BigInt((Math.random() * Number.MAX_SAFE_INTEGER) << 0)
  }

  protected formatUserPo({
    id,
    github_name,
    price,
    created_at,
    updated_at,
  }: UserPO): User {
    return {
      id: BigInt(id),
      githubName: github_name,
      price: BigInt(price),
      createdAt: created_at,
      updatedAt: updated_at,
    }
  }

  protected formatCardPo({
    id,
    user_id,
    title,
    context,
    star_price,
    star_num,
    expire_time,
    created_at,
    updated_at,
  }: CardPO): Card {
    return {
      id: BigInt(id),
      userId: BigInt(user_id),
      title: title,
      context: context,
      starPrice: BigInt(star_price),
      starNum: BigInt(star_num),
      expireTime: expire_time,
      createdAt: created_at,
      updatedAt: updated_at,
    }
  }

  async createUser(id: bigint, githubName: string, price: bigint): Promise<User> {

    const result = await this.client.query<UserPO>(
      `--sql
      INSERT INTO users (
        "id",
        "github_name",
        "price",
        "created_at",
        "updated_at"
      ) VALUES (
        $1,
        $2,
        $3,
        NOW(),
        NOW()
      ) RETURNING *
    `,
      [id, githubName, price],
    )
    return this.formatUserPo(result.rows[0])
  }

  async getUserById(id: bigint): Promise<User | undefined> {
    const result = await this.client.query<UserPO>(
      `--sql
      SELECT * FROM users WHERE id = $1
      `,
      [id],
    )
    return result.rows[0] && this.formatUserPo(result.rows[0])
  }

  async changeUserPrice(UserId: bigint, newPrice: bigint): Promise<User> {
    const result = await this.client.query<UserPO>(
      `--sql
      UPDATE users SET star_price = $1,
      updated_at = NOW()
      WHERE id = $2
      RETURNING *
      `,
      [newPrice, UserId],
    )
    return this.formatUserPo(result.rows[0])
  }

  async createCard(
    userId: bigint,
    title: string,
    context: string,
    starPrice: bigint,
    starNum: bigint,
    expireTime: Date,
  ): Promise<Card> {
    const id = this.genId()

    const result = await this.client.query<CardPO>(
      `--sql
      INSERT INTO cards (
        "id",
        "user_id",
        "title",
        "context",
        "star_price",
        "star_num",
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
        NOW(),
        NOW()
      ) RETURNING *
    `,
      [id, userId, title, context, starPrice, starNum, expireTime],
    )
    console.log(result.rows[0])
    return this.formatCardPo(result.rows[0])
  }
  async updateCard(data: Card): Promise<Card> {
    const { id, userId, title, context, starPrice, expireTime } = data

    const result = await this.client.query<CardPO>(
      `--sql
      UPDATE cards SET 
      title = $1,
      context = $2,
      star_price = $3,
      expire_time = $4,
      updated_at = NOW()
      WHERE id = $5
      RETURNING *
    `,
      [title, context, starPrice, expireTime, id],
    )

    return this.formatCardPo(result.rows[0])
  }

  async getCardsByTimeSort(start: number): Promise<any> {
    const result = await this.client.query<CardPO>(
      `--sql
      SELECT * FROM cards ORDER BY updated_at DESC limit 10 offset $1
    `,
      [start],
    )
    let cards = []
    for (let index in result.rows) {
      cards.push(this.formatCardPo(result.rows[index]))
    }
    const resCount = await this.client.query(
      `--sql
      SELECT count(*) FROM cards
    `,
    )

    return { count: BigInt(resCount.rows[0].count), data: cards }
  }
}
