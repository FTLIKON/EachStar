<template>
    <div :class="['sidebar-component', { fixed: fixed }]">
        <div class="content">
            <div id="logo" :class="{ back: isBack }" @click="onBack">
                <div class="logo-box">
                    <span class="iconfont icon-sun" />
                    <div class="logo-text">
                        <span class="main">中二Devil</span>
                        <span class="sub">的个人网站</span>
                    </div>
                </div>
                <div class="back-btn">
                    <span class="iconfont icon-arrow-left" />
                    <span class="text">返回</span>
                </div>
            </div>
            <div class="nav-box">
                <router-link
                    class="nav-item"
                    v-for="(nav, index) in navList"
                    :key="index"
                    :to="nav.path + '/index'"
                    :active="current === index">
                    <div class="inner">
                        <span :class="['iconfont', nav.icon]" />
                        <span class="text">{{ nav.name }}</span>
                    </div>
                </router-link>
            </div>
            <div class="user-box" @click="onUserInfo">
                <div class="inner">
                    <div class="info-box">
                        <div class="info-content">
                            <template v-if="$auth.has()">
                                <span class="nickname">{{
                                    userInfo?.nickname
                                }}</span>
                                <span class="sub-info">{{
                                    tag[userInfo?.lv]
                                }}</span>
                            </template>
                            <template v-else>
                                <span class="tip">未登录</span>
                            </template>
                        </div>
                    </div>
                    <template v-if="$auth.has()">
                        <async-img
                            class="avatar-img"
                            :url="userInfo?.avatarPath"
                            suffix="?x-oss-process=image/resize,s_42" />
                    </template>
                    <template v-else>
                        <img
                            class="avatar-img"
                            src="../assets/images/express/幽灵.png" />
                    </template>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
const defaultNavList = [
        {
            name: '时间线',
            icon: 'icon-clock',
            path: '/tweet',
        },
        {
            name: '文章',
            icon: 'icon-journal',
            path: '/article',
        },
        {
            name: '关于我',
            icon: 'icon-person',
            path: '/about',
        },
    ],
    lvTags = ['普通用户', '管理员', '博主'];

export default {
    data() {
        return {
            fixed: false,
            userInfo: {},
            navList: defaultNavList,
            tag: lvTags,
        };
    },
    computed: {
        isBack() {
            return this.$store.getters['nav/getBack'];
        },
        current() {
            return this.$store.getters['nav/getCurrent'];
        },
    },
    created() {
        this.init();
    },
    mounted() {
        this.$nextTick(() => {
            // 监听（绑定）滚轮滚动事件
            window.addEventListener('scroll', this.handleScroll);
        });
        this.handleScroll();
    },
    beforeUnmount() {
        window.removeEventListener('scroll', this.handleScroll);
    },
    methods: {
        /**
         * 初始化
         */
        init() {
            this.userInfo = this.$auth.get('user');
        },
        /**
         * 滚动监听
         */
        handleScroll() {
            // 获取滚动高度
            const scrollHeight =
                document.documentElement.scrollTop || document.body.scrollTop;
            this.fixed = scrollHeight < 50;
        },
        /**
         * 返回
         */
        onBack() {
            if (this.isBack) {
                this.$router.back();
            } else {
                this.$router.push({
                    path: '/',
                });
            }
        },
        /**
         * 用户按钮
         */
        onUserInfo() {
            this.$PL.show(this, {
                name: 'user-panel',
            });
        },
    },
};
</script>

<style lang="scss" scoped>
// 响应式
@media screen and (min-width: 801px) {
    .nav-box {
        justify-content: center;
    }
}
@media screen and (max-width: 800px) {
    #logo {
        display: none;
    }
}
@media screen and (min-width: 641px) {
    .user-box .info-box {
        display: flex;
    }
    .nav-item {
        height: fit-content;
        &::before {
            border-radius: 24px;
        }
        .inner {
            padding: 5px 15px;
            .iconfont {
                margin-right: 10px;
            }
        }
    }
}
@media screen and (max-width: 640px) {
    .user-box .info-box {
        display: none;
    }
    .nav-item {
        height: 100%;
        &::before {
            border-radius: 0;
        }
        .inner {
            padding: 0 15px;
            .text {
                display: none;
            }
        }
    }
}

// 侧边栏
.sidebar-component {
    z-index: 100;
    box-sizing: border-box;
    position: fixed;
    display: flex;
    flex-direction: row;
    width: 100%;
    height: fit-content;
    left: 0;
    top: 0;
    background: rgba(241, 243, 245, 0.7);
    backdrop-filter: blur(10px);
    overflow: hidden;
    transition: 0.4s;
    &.fixed {
        box-shadow: 0px 8px 48px rgba(0, 0, 0, 0.05);
    }
}

.content {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    width: 1440px;
    height: $nav_height;
    padding: 0 20px;
    margin: 0 auto;
    // logo
    #logo {
        position: relative;
        &.back {
            .logo-box {
                transition: 0s;
                opacity: 0;
            }
            .back-btn {
                transition: 0.2s;
                opacity: 1;
            }
        }
        .logo-box {
            display: flex;
            flex-direction: row;
            align-items: center;
            margin-right: 30px;
            cursor: pointer;
            transition: 0.2s;
            .iconfont {
                font-size: 36px;
                color: rgb(255, 196, 69);
            }
            .logo-text {
                display: flex;
                flex-direction: column;
                margin-left: 10px;
                .main {
                    font-weight: bold;
                    font-size: 17px;
                    color: $text2;
                }
                .sub {
                    font-size: 12px;
                    color: $text3;
                }
            }
        }
        .back-btn {
            z-index: 1;
            box-sizing: border-box;
            position: absolute;
            display: flex;
            align-items: center;
            width: 128px;
            height: 38px;
            bottom: 0;
            padding-left: 20px;
            opacity: 0;
            cursor: pointer;
            transition: 0s;
            &:hover {
                .iconfont {
                    color: $text1;
                }
                .text {
                    color: $text1;
                }
            }
            .iconfont {
                font-size: 35px;
                color: $text2;
            }
            .text {
                font-weight: bold;
                font-size: 19px;
                color: $text2;
            }
        }
    }

    // 导航
    .nav-box {
        flex-grow: 1;
        display: flex;
        flex-direction: row;
        align-items: center;
        height: 100%;
        .nav-item {
            position: relative;
            display: flex;
            align-items: center;
            width: fit-content;
            margin-right: 30px;
            text-decoration: none;
            color: unset;
            &::before {
                z-index: -1;
                content: '';
                position: absolute;
                width: 100%;
                height: 100%;
                background-color: rgba(0, 0, 0, 0.05);
                opacity: 0;
                transition: 0.2s;
            }
            &[active='true'],
            &:hover {
                &::before {
                    opacity: 1;
                }
                .inner {
                    color: $text1;
                }
            }
            &:hover {
                &::before {
                    background-color: rgba(0, 0, 0, 0.1);
                }
            }
            .inner {
                color: $text2;
                transition: 0.2s;
                .iconfont {
                    font-size: 22px;
                }
                .text {
                    font-family: 'Microsoft JhengHei UI';
                    font-weight: normal;
                    font-size: 24px;
                }
            }
        }
    }

    // 用户
    .user-box {
        flex-shrink: 0;
        max-width: 196px;
        height: fit-content;
        position: relative;
        cursor: pointer;
        &::before {
            z-index: -1;
            content: '';
            position: absolute;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.05);
            border-radius: 36px;
            opacity: 0;
            transition: 0.2s;
        }
        &[active='true'],
        &:hover {
            &::before {
                opacity: 1;
            }
            .inner {
                color: $text1;
            }
        }
        .inner {
            display: flex;
            flex-direction: row;
            align-items: center;
            padding: 0;
            color: $text2;
            transition: 0.2s;
            .info-box {
                flex-grow: 1;
                flex-direction: row;
                align-items: center;
                justify-content: flex-end;
                margin-left: 10px;
                .info-content {
                    display: flex;
                    flex-direction: column;
                    .nickname {
                        font-size: 15px;
                        color: $text1;
                        text-align: right;
                    }
                    .sub-info {
                        font-size: 13px;
                        color: $text3;
                        text-align: right;
                    }
                    .tip {
                        font-size: 18px;
                    }
                }
                .iconfont {
                    display: block;
                    width: 18px;
                    height: 18px;
                    font-size: 18px;
                    overflow: hidden;
                }
            }
            .avatar-img {
                box-sizing: border-box;
                width: 42px;
                height: 42px;
                border: solid 2px $text3;
                border-radius: 24px;
                margin-left: 10px;
                object-fit: cover;
            }
        }
    }
}
</style>
