<div align="center">
    <img align="center" src="https://github.com/FTLIKON/EachStar/blob/main/imgs/EachStar.png" alt="logo" width="600">
    <h1 href="www.each-star.com" align="center">each-star.com</h1>
    <p align="center">· 基于 Github API 和 Element Plus 的在线互助 Star 社区 ·</p>
    <p align="center">
        <img src="https://img.shields.io/github/stars/FTLIKON/EachStar?color=red&style=flat-square">
        <a href="mailto:3147983767@qq.com">
            <img src="https://img.shields.io/static/v1?label=contact%20me&message=email&color=green&style=flat-square">
        </a>
        <a href="https://qm.qq.com/cgi-bin/qm/qr?k=r2jN9fZaagH6qcLVb-QglnYWNPpKMPA6&jump_from=webapi&authKey=Ye43FWw3UiCdZ4bar3EY+qerAgjLHm3uC5xs2DWmeuuO9QeBV26bxaxCPC3YxM6H" target="_blank">
            <img src="https://img.shields.io/static/v1?label=chatting&message=qq&color=blue&style=flat-square">
        </a>
        <a href="https://github.com/FTLIKON/EachStar/blob/master/LICENSE" target="_blank">
            <img src="https://img.shields.io/static/v1?label=license&message=GPL-3.0&color=orange&style=flat-square">
        </a>
        <a href="https://github.com/FTLIKON/EachStar/issues/new/choose" target="_blank">
            <img src="https://img.shields.io/static/v1?label=feedback&message=issues&color=pink&style=flat-square">
        </a>
    </p>
    </br>
</div>

---

**更酷炫且支持 Fork & Watch 的 EachStar2.0 正在开发中**

**如果您想参与讨论 EachStar 欢迎加入：[【QQ 群】](https://qm.qq.com/cgi-bin/qm/qr?k=r2jN9fZaagH6qcLVb-QglnYWNPpKMPA6&jump_from=webapi&authKey=Ye43FWw3UiCdZ4bar3EY+qerAgjLHm3uC5xs2DWmeuuO9QeBV26bxaxCPC3YxM6H)**

## 如果遇到任何问题(按照推荐程度优先级排序)

1. 在 [github](https://github.com/FTLIKON/EachStar/issues/new) 提交新的 Issue
2. 给开发者发送邮件以咨询问题：
   - 前端：
   - 后端：[binlyliu@foxmail.com](mailto:binlyliu@foxmail.com)
3. 加入 QQ 群： 184109839 来面对面的和开发者反馈问题

## 如果你想要参与开发，则需要如下几点额外需求

1. 前端：对 vue3 以及 element-plus 的基本了解，要了解更多相关信息请看 [【Vue.js 官方】](https://cn.vuejs.org/guide/introduction.html) [【element-plus 手册】](https://element-plus.gitee.io/zh-CN/)
2. 后端：对 Koa 以及 node-postgres 的基础运用，要了解更多相关信息请看 [【Koa 文档】](https://koa.bootcss.com/) [【node-postgres 手册】](https://node-postgres.com/)
3. 具有不依赖文档阅读代码的能力

## 开发环境配置

1. 克隆本项目
2. 访问：[申请 GitHub OAuth APP](https://github.com/settings/applications/new)，保留 GitHub 提供的 Id 和 Secret
3. 后端配置：
   1. 进入目录`EachStar-backend`
   2. 配置 postgres 数据库，命令参考`createTables.sql`
   3. 修改`src/config.ts`，配置 GitHubApp 和后端数据库连接
   4. 执行`yarn install`安装依赖环境
   5. 执行`yarn start` 开启本地测试环境
4. 前端配置：
   1. 进入目录`EachStar-frontend`
   2. 执行`yarn install`安装依赖环境
   3. 执行`npm run dev` 开启本地测试环境
5. 如果以上步骤成功，访问您本地的开发环境：`http://localhost:80`

## 项目版本控制须知

本项目采用一个简单的 Git 分支模型：当您在进行开发的时候，请基于`main`创建新的分支，**切勿**直接基于`master`或者`main`分支进行开发，新的分支格式**必须**遵循`dev/{user}/{qualifier}-{name}`，`{user}`**必须**是您的用户名。

1. 如果新的代码包含的是*BUG 修复*，则`{qualifier}`**必须**为`fix`，`{name}`**应当**为 BUG 的简要叙述
2. 如果新的代码包含的是*新功能*，则`{qualifier}`**必须**为`feat`或者`feature`，`{name}`**应当**为新特性的简要叙述
3. 如果新的代码是*重构或者代码质量提升*，则`{qualifier}`**必须**为`refactor`，`{name}`**应当**为重构部分的简要叙述
4. 如果您的贡献包含不止一种上面提到的类型，则应当遵循和您的贡献最为相关的一项，并在 commit 信息中提及其他类型上的贡献
5. `master`分支**必须**当且仅当在新版本将要被发布的时候更新

在开发完成后，请在[【这里】](https://github.com/FTLIKON/EachStar/pulls)发布 Pull Request 请求合并到`dev/main`分支

## 项目结构

```
├── EachStar-backend/ -> 项目的后端主代码
├── EachStar-frontend/ -> 项目的前端主代码
├── imgs/
├── .gitignore
├── README.md
└── LICENSE
```

## 鸣谢

- [@moyeyuexiao](https://github.com/moyeyuexiao)

**特别鸣谢 Star 过本项目的支持者们...**  
(以下列表实时更新，排名不分先后)

[![Stargazers repo roster for @FTLIKON/EachStar](https://reporoster.com/stars/notext/FTLIKON/EachStar)](https://github.com/FTLIKON/EachStar/stargazers)

## JetBrains 开源许可

本项目重度依赖于 JetBrains™ ReSharper，感谢 JetBrains s.r.o 为本项目提供[开源许可证](https://www.jetbrains.com/community/opensource/#support)，如果你同样对开发充满热情并且经常使用 JetBrains s.r.o 的产品，你也可以尝试通过 JetBrains 官方渠道[申请](https://www.jetbrains.com/shop/eform/opensource)开源许可证以供核心开发者使用

<figure style="width: min-content">
    <img src="https://resources.jetbrains.com/storage/products/company/brand/logos/ReSharper_icon.png" width="200" height="200">
    <figcaption>Copyright © 2021 JetBrains s.r.o. </br>ReSharper and the ReSharper logo are registered trademarks of JetBrains s.r.o.</figcaption>
</figure>
