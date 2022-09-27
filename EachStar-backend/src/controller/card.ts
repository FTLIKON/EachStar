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

  async starGithubRepo(ctx: Context, repoUrl: string) {
    const accessToken = ctx.cookies.get('githubToken')
    const repoData = repoUrl.slice(19)
    const config = {
      method: 'put',
      url: 'https://api.github.com/user/starred/' + repoData,
      headers: {
        Authorization: 'token ' + accessToken,
      },
    }
    console.log(config)
    await axios(config)
  }

  async starCard(ctx: Context) {
    const body = ctx.request.body
    const userId = ctx.user.id
    const cardId = body.cardId

    const newCard = await this.repository.starCard(userId, cardId)
    this.starGithubRepo(ctx, newCard.title)
    ctx.body = newCard
  }

  async getCard(ctx: Context) {
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
}
export default CardController
