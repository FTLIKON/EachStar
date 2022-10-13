import { Context } from 'koa'
import { RepositoryPostgres } from '../stores'

export class DevController {
  repository
  constructor() {
    this.repository = new RepositoryPostgres()
  }

  async changeUserPrice(ctx: Context) {
    const type = ctx.query.type
    const userId = type == 'GitHub' ? ctx.github_user.id : ctx.gitee_user.id
    const newPrice = ctx.query.newPrice
    const user = await this.repository.changeUserPrice(type, userId, newPrice)
    ctx.body = user
  }

  async createTestCard(ctx: Context) {
    const type = ctx.query.type
    const userId = type == 'GitHub' ? ctx.github_user.id : ctx.gitee_user.id

    let testCase = [
      {
        title: 'https://github.com/RainbowRoad1/Cgame',
        context:
          '一些用C语言编写的小游戏, 用最少的代码实现最多的功能代码极短, 可玩性高, 这么好玩的项目不关注下吗?14行贪吃蛇, 22行俄罗斯方块, 22行2048, 24行扫雷...',
        starPrice: '2',
        starNum: '50',
      },
      {
        title: 'https://github.com/FTLIKON?tab=stars',
        context:
          'dnSpy is a debugger and .NET assembly editor. You can use it to edit and debug assemblies even if you don',
        starPrice: '5',
        starNum: '20',
      },
      {
        title: 'https://github.com/Pixeval/Pixeval',
        context: '基于.NET 6 和 Windows UI 3的强大、快速、漂亮的Pixiv桌面程序',
        starPrice: '4',
        starNum: '25',
      },
      {
        title: 'https://github.com/FTLIKON/EachStar',
        context: '基于 Github API 和 Element Plus 的在线互助 Star 社区',
        starPrice: '5',
        starNum: '20',
      },
      {
        title: 'https://github.com/z2devil/z2-blog-web',
        context:
          '个人博客前端项目，主要包含无感用户登录注册、文字图片内容社区、Markdown 编辑器、OSS 文件上传等功能。',
        starPrice: '4',
        starNum: '25',
      },
    ]
    for (let obj in testCase) {
      await this.repository.createCard(
        userId,
        type,
        testCase[obj].title,
        testCase[obj].context,
        testCase[obj].starPrice,
        testCase[obj].starNum,
        new Date(),
      )
    }
    const userPrice =
      type == 'GitHub' ? ctx.github_user.price : ctx.gitee_user.price
    const newPrice = userPrice - BigInt(500)
    const user = await this.repository.changeUserPrice(type, userId, newPrice)
    if (type == 'GitHub') {
      ctx.github_user = user
    } else {
      ctx.gitee_user = user
    }
    ctx.body = user
  }
}
export default DevController
