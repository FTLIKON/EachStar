import { Client } from 'pg'

export interface User {
  id: bigint
  githubName: string
  price: bigint
  createdAt: Date
  updatedAt: Date
}

export interface Card {
  id: bigint
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
  userId: bigint
  cardId: bigint
  createdAt: Date
}

export interface RepositoryType {
  client: Client
  createUser(id: bigint, githubName: string, price: bigint): Promise<User>
  getUserById(UserId: bigint): Promise<User | undefined>
  changeUserPrice(UserId: bigint, newPrice: bigint): Promise<User>
  createCard(
    userId: bigint,
    title: string,
    context: string,
    starPrice: bigint,
    starNum: bigint,
    expireTime: Date,
  ): Promise<Card>
  updateCard(data: Card): Promise<Card>
  getCardsByTimeSort(start: number): Promise<any>
  getCardsByUserId(userId: bigint, start: number): Promise<any>
  starCard(userId: bigint, cardId: bigint): Promise<any>
  getUserStarred(userId: bigint): Promise<any>
}
