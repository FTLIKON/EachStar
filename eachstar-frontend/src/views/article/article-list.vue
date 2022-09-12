<template>
    <div class="article-list-component" :mark="articleData.id">
        <div class="banner">
            <async-img
                v-if="articleData.cover"
                class="banner-img"
                :url="articleData.cover.path"
                suffix="?x-oss-process=image/resize,s_720" />
            <div class="banner-text" :class="{ 'has-bg': articleData.cover }">
                <user-info
                    class="user-info-box"
                    :avatar="false"
                    :user-info="articleData.userInfo">
                    <format-date
                        class="post-date"
                        :date="articleData.postDate" />
                </user-info>
                <span class="title">{{ articleData.title }}</span>
            </div>
        </div>
        <div class="content-box">
            <span class="summary">{{ articleData.summary }}...</span>
        </div>
        <div class="assess-box">
            <z-button
                class="assess-item"
                round
                :class="{ active: articleData.isLiked }"
                @click="likeIt">
                <span
                    class="iconfont"
                    :class="
                        articleData.isLiked ? 'icon-like-fill' : 'icon-like'
                    " />
                <span>{{ articleData.likes }}</span>
            </z-button>
            <z-button class="assess-item" round>
                <span class="iconfont icon-comment" /><span>{{
                    articleData.comments
                }}</span>
            </z-button>
            <div class="right-box">
                <z-button class="assess-item enter-btn" round @click="toDetail">
                    查看详情
                </z-button>
                <!-- <router-link class="assess-item enter-btn"
                    :to="'/article/'+articleData.id">
                    查看详情
                </router-link> -->
            </div>
        </div>
    </div>
</template>

<script>
import userInfo from '@/components/user-info';
import { like } from '@/api/prefer';

export default {
    components: {
        userInfo,
    },
    props: {
        article: {
            type: Object,
            required: true,
        },
    },
    data() {
        return {
            articleData: this.article,
        };
    },
    emits: ['to-detail'],
    methods: {
        /**
         * 查看详情
         */
        toDetail() {
            this.$emit('to-detail', this.articleData.id);
        },
        /**
         * 喜欢
         */
        likeIt() {
            if (!this.$auth.has()) return;
            like(2, this.articleData.id)
                .then(res => {
                    this.articleData.likes = res;
                    this.articleData.isLiked = !this.articleData.isLiked;
                    this.$msg('success', '点赞成功');
                })
                .catch(() => {
                    this.$msg('error', '点赞失败');
                });
        },
    },
};
</script>

<style lang="scss" scoped>
.article-list-component {
    position: relative;
    background-color: $white;
    border-radius: 8px;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.05);
    margin-bottom: 20px;
    overflow: hidden;
    // content-visibility: auto;
    &:hover .right-box .enter-btn {
        opacity: 1;
    }
}

.banner {
    position: relative;
    margin-bottom: 10px;
    font-size: 0;
    .banner-img {
        width: 100%;
        height: 108px;
        left: 0;
        top: 0;
        object-fit: cover;
        z-index: 0;
        user-select: none;
    }
    .banner-text {
        &:not(.has-bg) {
            margin: 20px 20px 0;
        }
        &.has-bg {
            position: absolute;
            left: 20px;
            bottom: 10px;
            .user-info-box {
                :deep(.user-name) {
                    font-weight: bold;
                    color: $text2;
                    @include stroke($white);
                }
                .post-date {
                    font-weight: bold;
                    color: $text2;
                    @include stroke($white);
                }
            }
            .title {
                font-weight: bold;
                color: $text1;
                @include stroke($white);
            }
        }
        .user-info-box {
            margin-bottom: 10px;
            .post-date {
                font-size: 14px;
                color: $text3;
            }
        }
        .title {
            display: block;
            font-size: 18px;
            font-weight: bold;
            color: $text1;
        }
    }
}

.content-box {
    margin: 0 20px 20px;
    .summary {
        display: block;
        font-size: 15px;
        color: $text2;
    }
}

.assess-box {
    display: flex;
    flex-direction: row;
    padding: 0 20px 20px;
    .assess-item {
        padding: 8px 16px;
        font-size: 14px;
        background-color: rgba(0, 0, 0, 0.03);
        & + .assess-item {
            margin-left: 15px;
        }
        &:hover {
            background-color: rgba(0, 0, 0, 0.07);
        }
        &.active {
            .iconfont {
                color: $danger;
            }
        }
        .iconfont {
            font-size: 20px;
            margin-right: 2px;
        }
    }
    .right-box {
        flex-grow: 1;
        display: flex;
        justify-content: flex-end;
        .enter-btn {
            display: flex;
            align-items: center;
            justify-content: center;
            text-decoration: none;
            border-radius: 24px;
            font-size: 14px;
            transform: translateX(5px);
            color: $highlight;
            opacity: 0;
            transition: 0.1s;
        }
    }
}
</style>
