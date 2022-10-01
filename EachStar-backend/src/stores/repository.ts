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
  pool: Pool
  constructor() {
    const connectionString = serviceConfig.databaseUrl
    this.pool = new Pool({
      connectionString,
    })
  }

  get genId() {
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

  protected formatUserStarPo({
    id,
    user_id,
    card_id,
    created_at,
  }: UserStarPO): UserStar {
    return {
      id: BigInt(id),
      userId: BigInt(user_id),
      cardId: BigInt(card_id),
      createdAt: created_at,
    }
  }

  async createUser(
    id: bigint,
    githubName: string,
    price: bigint,
  ): Promise<User> {
    const client = await this.pool.connect()
    const result = await client.query<UserPO>(
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
    client.release()
    return this.formatUserPo(result.rows[0])
  }

  async getUserById(id: bigint): Promise<User | undefined> {
    const client = await this.pool.connect()
    const result = await client.query<UserPO>(
      `--sql
      SELECT * FROM users WHERE id = $1
      `,
      [id],
    )
    client.release()
    return result.rows[0] && this.formatUserPo(result.rows[0])
  }

  async changeUserPrice(UserId: bigint, newPrice: bigint): Promise<User> {
    const client = await this.pool.connect()
    const result = await client.query<UserPO>(
      `--sql
      UPDATE users SET price = $1,
      updated_at = NOW()
      WHERE id = $2
      RETURNING *
      `,
      [newPrice, UserId],
    )
    client.release()
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
    const id = this.genId
    const client = await this.pool.connect()
    const result = await client.query<CardPO>(
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
    client.release()
    return this.formatCardPo(result.rows[0])
  }
  async updateCard(data: Card): Promise<Card> {
    const { id, userId, title, context, starPrice, starNum, expireTime } = data
    const client = await this.pool.connect()
    const result = await client.query<CardPO>(
      `--sql
      UPDATE cards SET 
      title = $1,
      context = $2,
      star_price = $3,
      star_num = $4,
      expire_time = $5,
      updated_at = NOW()
      WHERE id = $6
      RETURNING *
    `,
      [title, context, starPrice, starNum, expireTime, id],
    )
    client.release()
    return this.formatCardPo(result.rows[0])
  }

  async deleteCardById(userId: bigint, cardId: bigint): Promise<any> {
    const client = await this.pool.connect()
    const result = await client.query<CardPO>(
      `--sql
      DELETE FROM cards
      WHERE user_id = $1 AND id = $2
    `,
      [userId, cardId],
    )
    client.release()
  }

  async getCardById(cardId: bigint): Promise<Card> {
    const client = await this.pool.connect()
    const result = await client.query<CardPO>(
      `--sql
      SELECT * FROM cards WHERE id=$1
    `,
      [cardId],
    )
    client.release()
    return this.formatCardPo(result.rows[0])
  }

  async getCardsByTimeSort(start: number): Promise<any> {
    const client = await this.pool.connect()

    const result = await client.query<CardPO>(
      `--sql
      SELECT * FROM cards WHERE star_num > 0 ORDER BY created_at DESC limit 10 offset $1
    `,
      [start],
    )
    let cards = []
    for (let index in result.rows) {
      cards.push(this.formatCardPo(result.rows[index]))
    }
    const resCount = await client.query(
      `--sql
      SELECT count(*) FROM cards WHERE star_num > 0 
    `,
    )
    client.release()

    return { count: BigInt(resCount.rows[0].count), data: cards }
  }

  async getCardsByUserId(userId: bigint, start: number): Promise<any> {
    const client = await this.pool.connect()

    const result = await client.query<CardPO>(
      `--sql
      SELECT * FROM cards WHERE user_id=$1 ORDER BY created_at DESC limit 10 offset $2
    `,
      [userId, start],
    )
    let cards = []
    for (let index in result.rows) {
      cards.push(this.formatCardPo(result.rows[index]))
    }
    const resCount = await client.query(
      `--sql
      SELECT count(*) FROM cards WHERE user_id=$1 
    `,
      [userId],
    )
    client.release()
    return { count: BigInt(resCount.rows[0].count), data: cards }
  }

  async starCard(userId: bigint, cardId: bigint): Promise<any> {
    const client = await this.pool.connect()
    // 将用户star的动作入库
    const userStarData = await client.query<UserStarPO>(
      `--sql
      INSERT INTO user_star (
        "id",
        "user_id",
        "card_id",
        "created_at"
      ) VALUES (
        $1,
        $2,
        $3,
        NOW()
      ) RETURNING *
    `,
      [this.genId, userId, cardId],
    )

    //将卡片的悬赏星星-1
    const cardData = await client.query<CardPO>(
      `--sql
      SELECT * from cards WHERE id = $1
      `,
      [cardId],
    )
    let oldCard = this.formatCardPo(cardData.rows[0])
    oldCard.starNum = oldCard.starNum - BigInt(1)
    const newCard = await this.updateCard(oldCard)

    //将star卡片用户的积分加一个star price
    const starUser = await this.getUserById(userId)
    if (starUser) {
      const starUserId = starUser.id
      const starUserNewPrice = starUser.price + newCard.starPrice
      this.changeUserPrice(starUserId, starUserNewPrice)
    }
    client.release()

    return newCard
  }

  async getUserStarred(userId: bigint): Promise<any> {
    const client = await this.pool.connect()

    const result = await client.query<UserStarPO>(
      `--sql
      SELECT * FROM user_star WHERE user_id = $1
    `,
      [userId],
    )
    let user_starred = []
    for (let index in result.rows) {
      user_starred.push(this.formatUserStarPo(result.rows[index]))
    }
    client.release()

    return user_starred
  }
}
