import { Context } from 'koa'
import { RepositoryPostgres } from '../stores'
import axios from 'axios'

export class CardController {
  repository
  constructor() {
    this.repository = new RepositoryPostgres()
  }

  async createCard(ctx: Context) {
    const body = ctx.request.body
    const userId = ctx.user.id
    const title = body.title
    const context = body.context
    const starPrice = BigInt(body.starPrice)
    const starNum = BigInt(body.starNum)
    const expireTime = new Date(body.expireTime)

    const card = await this.repository.createCard(
      userId,
      title,
      context,
      starPrice,
      starNum,
      expireTime,
    )
    const newPrice = ctx.user.price - starPrice * starNum
    const user = await this.repository.changeUserPrice(userId, newPrice)
    ctx.user = user
    ctx.body = card
  }

  async deleteCard(ctx: Context) {
    const userId = ctx.user.id
    const cardId = ctx.query.cardId
    const card = await this.repository.getCardById(BigInt(Number(cardId)))
    // 退还当前卡片的剩余积分
    const cardAuthor = await this.repository.getUserById(card.userId)
    if (cardAuthor) {
      const authorNewPrice = cardAuthor?.price + card.starPrice * card.starNum
      this.repository.changeUserPrice(cardAuthor.id, authorNewPrice)
    }
    this.repository.deleteCardById(userId, card.id)
    ctx.status = 204
  }

  async starGithubRepo(ctx: Context, repoUrl: string): Promise<Boolean> {
    const accessToken = ctx.cookies.get('githubToken')
    const repoData = repoUrl.slice(19)
    const config = {
      method: 'put',
      url: 'https://api.github.com/user/starred/' + repoData,
      headers: {
        Authorization: 'token ' + accessToken,
        'Content-Length': 0,
      },
    }
    let rep: any
    const res = await axios(config)
      .then(function (response) {
        rep = true
      })
      .catch(function (error) {
        console.log(error)
        rep = false
      })
    return rep
  }

  async starCard(ctx: Context) {
    const body = ctx.request.body
    const userId = ctx.user.id
    const cardId = body.cardId

    const card = await this.repository.getCardById(cardId)
    const isStared = await this.starGithubRepo(ctx, card.title)
    console.log(isStared)
    if (isStared) {
      const newCard = await this.repository.starCard(userId, cardId)

      ctx.body = newCard
    } else {
      ctx.status = 400
      ctx.body = {}
    }
  }

  async getCardsByTimeSort(ctx: Context) {
    const userId = ctx.user.id
    const start = ctx.query.start
    const cards = await this.repository.getCardsByTimeSort(Number(start))
    const userStarred = await this.repository.getUserStarred(userId)
    let userStarredCardId = []
    for (let index in userStarred) {
      userStarredCardId.push(userStarred[index].cardId)
    }
    for (let index in cards.data) {
      if (userStarredCardId.includes(cards.data[index].id)) {
        cards.data[index]['starred'] = true
      } else {
        cards.data[index]['starred'] = false
      }
    }

    ctx.body = cards
  }

  async getSelfCards(ctx: Context) {
    const userId = ctx.user.id
    const start = ctx.query.start
    const cards = await this.repository.getCardsByUserId(userId, Number(start))

    ctx.body = cards
  }
}
export default CardController
