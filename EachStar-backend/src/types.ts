import { Pool } from 'pg'

export interface User {
  id: bigint
  type: string
  name: string
  avatar: string
  price: bigint
  createdAt: Date
  updatedAt: Date
}

export interface Card {
  id: bigint
  type: string
  userId: bigint
  title: string
  context: string
  starPrice: bigint
  starNum: bigint
  expireTime: Date
  createdAt: Date
  updatedAt: Date
}

export interface UserStar {
  id: bigint
  type: string
  userId: bigint
  cardId: bigint
  cardTitle: string
  authorId: bigint
  createdAt: Date
}

export interface RepositoryType {
  pool: Pool
  createUser(
    id: bigint,
    type: string,
    name: string,
    avatar: string,
    price: bigint,
  ): Promise<User>
  getUserById(type: string, UserId: bigint): Promise<User | undefined>
  changeUserPrice(type: string, UserId: bigint, newPrice: bigint): Promise<User>
  createCard(
    userId: bigint,
    type: string,
    title: string,
    context: string,
    starPrice: bigint,
    starNum: bigint,
    expireTime: Date,
  ): Promise<Card>
  updateCard(data: Card): Promise<Card>
  deleteCardById(type: string, userId: bigint, cardId: bigint): Promise<any>
  getCardById(type: string, cardId: bigint): Promise<Card>
  getCardsByTimeSort(type: string, start: number): Promise<any>
  getCardsByUserId(type: string, userId: bigint, start: number): Promise<any>
  starCard(type: string, userId: bigint, cardId: bigint): Promise<any>
  getUserStarred(type: string, userId: bigint): Promise<any>
  vertifyUserStarCard(
    type: string,
    userId: bigint,
    cardId: bigint,
  ): Promise<any>
}
