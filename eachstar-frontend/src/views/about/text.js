const text = {
    code: {
        title: '编程技能',
        details: [
            {
                label: '前端相关',
                content: [
                    '熟悉 HTML 5、CSS 3、JavaScript、ES6，了解 Nodejs、TypeScript、Canvas',
                    '熟悉 MVVM 及原理，主要使用 Vue 框架',
                    '熟悉 Uni-App 框架，具备丰富的多端开发经验，有一定的 App 开发经验',
                    '熟悉 Element-UI、Ant-Design-Vue、Bootstrap、Color-ui 等 UI 组件库',
                    '熟悉前端工程化、模块化开发、组件化开发，熟悉 Webpack',
                    '熟悉基本的数据结构和算法，熟悉 HTTP/TCP 网络协议和 Restful Api 规范',
                ],
            },
            {
                label: '后端相关',
                content: [
                    '熟悉 Java 语言',
                    '熟悉 Spring、SpringBoot、MyBatis、MyBatis Plus 等后端框架',
                    '熟悉 MySQL 数据库以及 Redis 缓存',
                    '了解常用的 Linux 命令，了解 Docker、Nginx，能够进行前后端项目部署',
                ],
            },
            {
                label: '其他',
                content: [
                    '具有完整的商业项目开发和管理经验，熟悉完整的项目开发流程，熟悉 Git 进行协作开发',
                    '具有较强的业务需求理解和转化能力，并能输出需求分析、原型等',
                ],
            },
        ],
    },
    design: {
        title: '设计技能',
        details: [
            {
                content: [
                    '熟练掌握 PS、PR、AE 等工具，有一定的海报设计、图像后期、影视后期经验',
                    '熟悉掌握 Figma、Adobe XD、摹客等原型开发工具，有一定的原型、设计稿制作经验',
                ],
            },
        ],
    },
    history: [
        {
            title: '蓝桥杯算法竞赛二等奖',
            date: '2020.10',
            icon: 'award',
            summary: '第十一届软件类Java软件开发大学B组 二等奖',
            details: [
                {
                    label: '证书',
                    content:
                        'https://dasai.lanqiao.cn/pages/dasai/cert/cert_search.html',
                },
            ],
        },
        {
            title: '射手荣耀APP',
            date: '2020.02 - 2021.05',
            icon: 'project',
            summary:
                '一款与国家射击队合作开发的线上真人射击比赛平台，主要服务于射击爱好者。 其中包含有线上举办全国性赛事、 人机对战、 射友发动态、 写文章、 线上商城等功能。 用户通过个人中心完成每日任务获 得积分，可兑换商品、 打赏文章、 以及参与抽奖活动。',
            details: [
                {
                    label: '技术栈',
                    content:
                        'Uni-App、Vue、ColorUI、WebSocket、 El-Admin 框架等',
                },
                {
                    label: '下载地址',
                    content: 'https://appgallery.huawei.com/app/C104453673',
                },
                {
                    label: '主要负责',
                    content:
                        '负责社交模块开发，包括：类朋友圈、动态详情、写动态、写文章、好友列表、个人空间页、海报分享等',
                },
                {
                    label: '项目亮点',
                    content: [
                        '使用 NVue 走 Weex 原生渲染方式，优化动态 长列表的渲染 性能，实现高性能分段器滚动长列表',
                        '使用 Canvas 实现可拓展功能的 海报分享弹出层',
                        '使用 Websocket 实现 实时对战、对战邀请、聊天 等',
                    ],
                },
            ],
        },
        {
            title: 'CET 4',
            date: '2021.06',
            icon: 'award',
            summary: '大学英语四级',
            details: [
                {
                    label: '成绩查询',
                    content:
                        'https://cet.neea.edu.cn/html1/folder/22023/595-1.htm',
                },
            ],
        },
        {
            title: '老享乐小程序',
            date: '2021.08 - 2021.11',
            icon: 'project',
            summary:
                '一款服务于中老年人兴趣培训和活动交流的小程序以及后台管理平台，其中包含课程和活动的报名、提醒、签到、管理与统计，以及积分商城系统的下单、退款、管理等功能。',
            details: [
                {
                    label: '技术栈',
                    content: 'Uni-App、Vue、ColorUI、 El-Admin 框架等',
                },
                {
                    label: '体验途径',
                    content: '微信搜索小程序：老享乐',
                },
                {
                    label: '主要工作',
                    content: [
                        '梳理项目需求、输出需求分析、原型、设计稿',
                        '搭建前后端项目环境、建表、项目部署',
                        '实现微信扫描普通二维码跳转到小程序、扫码签到、模板消息通知等',
                        '实现商城的微信统一下单与退款',
                    ],
                },
            ],
        },
        {
            title: '灵鹿聘',
            date: '2021.08 - 2021.11',
            icon: 'project',
            summary:
                '灵鹿聘是一款专注于为大学生提供实习、校招机会的招聘网站，包含后台管理、学生端、企业端、空中招聘、微信小程序。',
            details: [
                {
                    label: '技术栈',
                    content:
                        'Vue、Uni-App、Webpack、ElementUI、ColorUI、Sass 等',
                },
                {
                    label: '体验途径（PC端）',
                    content: 'http://tp-www.smartdeer.co/',
                },
                {
                    label: '体验途径（小程序）',
                    content: '微信搜索小程序：灵鹿聘',
                },
                {
                    label: '主要负责',
                    content: '移动端（微信小程序、H5）开发与维护',
                },
                {
                    label: '项目亮点',
                    content: [
                        '使用 Vue-i18n 实现 多语言',
                        '通过 Uni-App 的自定义条件编译实现 多端编译，将多端重合代码进行了复用',
                        '通过 动态组件 实现职位筛选组件和全局地区选择组件的封装',
                    ],
                },
            ],
        },
    ],
};

export default text;
