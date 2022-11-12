import { Context } from 'koa'
import { RepositoryPostgres } from '../stores'
import axios from 'axios'

export class CardController {
  repository
  constructor() {
    this.repository = new RepositoryPostgres()
  }

  /**
   * 创建卡片，先判断用户有足够的积分，然后创建卡片，并且扣除用户对应的积分数
   */
  async createCard(
    ctx: Context,
    type: string,
    userId: bigint,
    title: string,
    context: string,
    starPrice: bigint,
    starNum: bigint,
  ) {
    const body = ctx.request.body
    if (
      starPrice <= BigInt(0) ||
      starNum <= BigInt(0) ||
      starPrice * starNum >
        (type == 'GitHub' ? ctx.github_user.price : ctx.gitee_user.price)
    ) {
      ctx.status = 400
      ctx.body = {}
      return
    }
    const expireTime = new Date(body.expireTime)

    const card = await this.repository.createCard(
      userId,
      type,
      title,
      context,
      starPrice,
      starNum,
      expireTime,
    )
    const userPrice =
      type == 'GitHub' ? ctx.github_user.price : ctx.gitee_user.price
    const newPrice = userPrice - starPrice * starNum
    const user = await this.repository.changeUserPrice(type, userId, newPrice)
    if (type == 'GitHub') {
      ctx.github_user = user
    } else {
      ctx.gitee_user = user
    }
    ctx.body = card
  }

  /**
   * 修改卡片，先判断用户有足够的积分修改，然后修改卡片和对应用户的积分
   */
  async updateCard(
    ctx: Context,
    cardId: bigint,
    type: string,
    userId: bigint,
    title: string,
    context: string,
    starPrice: bigint,
    starNum: bigint,
  ) {
    const body = ctx.request.body
    const expireTime = new Date(body.expireTime)
    const nowCard = await this.repository.getCardById(type, cardId)
    if (starPrice <= BigInt(0) || starNum < BigInt(0)) {
      ctx.status = 400
      ctx.body = {}
      return
    }
    const priceDiff = starPrice * starNum - nowCard.starPrice * nowCard.starNum
    const userPrice =
      type == 'GitHub' ? ctx.github_user.price : ctx.gitee_user.price
    if (userPrice < priceDiff) {
      ctx.status = 400
      ctx.body = {}
      return
    }
    const newCard = await this.repository.updateCard({
      id: cardId,
      type: type,
      userId: userId,
      title: title,
      context: context,
      starPrice: starPrice,
      starNum: starNum,
      expireTime: expireTime,
      createdAt: nowCard.createdAt,
      updatedAt: new Date(),
    })

    const newPrice = userPrice - priceDiff
    const user = await this.repository.changeUserPrice(type, userId, newPrice)
    if (type == 'GitHub') {
      ctx.github_user = user
    } else {
      ctx.gitee_user = user
    }
    ctx.body = newCard
  }

  /**
   * 如果接口传入了cardId的字段，即为修改卡片，否则为发布
   */
  async createOrUpdateCard(ctx: Context) {
    const body = ctx.request.body
    const cardId = body.cardId
    const type = body.type
    const userId = type == 'GitHub' ? ctx.github_user.id : ctx.gitee_user.id
    const title = body.title
    const context = body.context
    const starPrice = BigInt(body.starPrice)
    const starNum = BigInt(body.starNum)
    if (userId == undefined) {
      ctx.status = 400
      ctx.body = {}
      return
    }
    if (cardId == undefined) {
      await this.createCard(
        ctx,
        type,
        userId,
        title,
        context,
        starPrice,
        starNum,
      )
    } else {
      await this.updateCard(
        ctx,
        cardId,
        type,
        userId,
        title,
        context,
        starPrice,
        starNum,
      )
    }
  }

  /**
   * 删除卡片，并退还对应用户的积分
   */
  async deleteCard(ctx: Context) {
    const cardId = ctx.query.cardId
    const type = ctx.query.type
    const userId = type == 'GitHub' ? ctx.github_user.id : ctx.gitee_user.id
    const card = await this.repository.getCardById(type, BigInt(Number(cardId)))
    if (userId != card.userId) {
      ctx.status = 400
      ctx.body = {}
    }
    // 退还当前卡片的剩余积分
    const cardAuthor = await this.repository.getUserById(type, card.userId)
    if (cardAuthor) {
      const authorNewPrice = cardAuthor?.price + card.starPrice * card.starNum
      this.repository.changeUserPrice(type, cardAuthor.id, authorNewPrice)
    }
    this.repository.deleteCardById(type, userId, card.id)
    ctx.status = 204
  }

  /**
   * 调用GitHub api的star接口
   */
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

  /**
   * 调用Gitee api的star接口
   */
  async starGiteeRepo(ctx: Context, repoUrl: string): Promise<Boolean> {
    const accessToken = ctx.cookies.get('giteeToken')
    const repoData = repoUrl.slice(18)
    const config = {
      method: 'put',
      url: 'https://gitee.com/api/v5/user/starred/' + repoData,
      headers: {
        Authorization: 'Bearer ' + accessToken,
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

  /**
   * 一键star，减少卡片的悬赏次数，并增加用户的积分
   */
  async starCard(ctx: Context) {
    const body = ctx.request.body
    const type = body.type
    const userId = type == 'GitHub' ? ctx.github_user.id : ctx.gitee_user.id
    const cardId = body.cardId
    const verfityUserStar = await this.repository.vertifyUserStarCard(
      type,
      userId,
      cardId,
    )
    if (verfityUserStar != undefined) {
      ctx.status = 400
      ctx.body = {}
      return
    }
    const card = await this.repository.getCardById(type, cardId)
    let isStared
    if (type == 'GitHub') {
      isStared = await this.starGithubRepo(ctx, card.title)
    } else {
      isStared = await this.starGiteeRepo(ctx, card.title)
    }
    if (isStared) {
      const newCard = await this.repository.starCard(type, userId, cardId)
      ctx.body = newCard
    } else {
      ctx.status = 400
      ctx.body = {}
    }
  }

  /**
   * 获取卡片列表，按照卡片发布时间排序
   */
  async getCardsByTimeSort(ctx: Context) {
    const start = ctx.query.start
    const type = ctx.query.type
    const cards = await this.repository.getCardsByTimeSort(type, Number(start))

    if (
      (type == 'GitHub' && ctx.github_user) ||
      (type == 'Gitee' && ctx.gitee_user)
    ) {
      /**
       * 判断卡片是否被当前登录用户star过
       */
      for (let index in cards.data) {
        cards.data[index]['starred'] = false
      }
      const userId = type == 'GitHub' ? ctx.github_user.id : ctx.gitee_user.id
      const userStarred = await this.repository.getUserStarred(type, userId)
      let userStarredCardTitle = []
      for (let index in userStarred) {
        userStarredCardTitle.push(userStarred[index].cardTitle)
      }
      for (let index in cards.data) {
        if (userStarredCardTitle.includes(cards.data[index].title)) {
          cards.data[index]['starred'] = true
        } else {
          cards.data[index]['starred'] = false
        }
      }
    }
    for (let index in cards.data) {
      delete cards.data[index]['userId']
    }
    ctx.body = cards
  }

  /**
   * 获取用户自己的卡片列表
   */
  async getSelfCards(ctx: Context) {
    const type = ctx.query.type
    const userId = type == 'GitHub' ? ctx.github_user.id : ctx.gitee_user.id
    const start = ctx.query.start
    const cards = await this.repository.getCardsByUserId(
      type,
      userId,
      Number(start),
    )

    ctx.body = cards
  }
}
export default CardController
