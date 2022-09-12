<template>
    <div class="tweet-list-component" :ref="'tweet-' + tweetData.id">
        <!-- 主要内容 -->
        <div class="main">
            <div class="top-info">
                <user-info
                    class="user-info-box"
                    :user-info="tweetData.userInfo">
                    <format-date class="post-date" :date="tweetData.postDate" />
                </user-info>
                <more-operation
                    :list="[
                        {
                            icon: 'icon-trash',
                            text: '删除',
                            use:
                                $auth.has() &&
                                ($auth.get('user').id ===
                                    tweetData.userInfo.id ||
                                    $auth.get('user').lv === 2),
                            callback: deleteIt,
                        },
                    ]">
                    <z-button class="more-btn" circle>
                        <span class="iconfont icon-dots" />
                    </z-button>
                </more-operation>
            </div>
            <div class="content-box">
                <text-content :text="tweetData.content" />
                <resources :files="tweetData.files" />
            </div>
            <div class="assess-box">
                <z-button
                    class="assess-item"
                    round
                    :class="{ active: tweetData.isLiked }"
                    @click="likeIt">
                    <span
                        class="iconfont"
                        :class="
                            tweetData.isLiked ? 'icon-like-fill' : 'icon-like'
                        " />
                    <span>{{ tweetData.likes }}</span>
                </z-button>
                <z-button class="assess-item" round @click="commentIt">
                    <span class="iconfont icon-comment" />
                    <span>{{ tweetData.comments }}</span>
                </z-button>
                <div class="right-box">
                    <z-button
                        class="assess-item enter-btn"
                        round
                        :disabled="tweetData.comments === 0"
                        @click="onOpen = !onOpen">
                        {{ !onOpen ? '展示评论' : '隐藏评论' }}
                    </z-button>
                </div>
            </div>
        </div>
        <!-- 评论 -->
        <div v-if="onOpen" class="comments-box">
            <comment-list
                ref="comment-list"
                :cate="1"
                :id="this.tweetData.id"
                @to-comment="commentIt" />
        </div>
    </div>
</template>

<script>
import textContent from '@/components/text-content';
import userInfo from '@/components/user-info';
import resources from '@/components/resources/index';
import commentList from '@/components/comment/index';
import moreOperation from '@/components/more-operation';
import { like } from '@/api/prefer';
import { addComment } from '@/api/comment';
import { deleteTweet, getTweet } from '@/api/tweet';

var viewObserver;

export default {
    components: {
        textContent,
        userInfo,
        resources,
        commentList,
        moreOperation,
    },
    props: {
        tweet: {
            type: Object,
            required: true,
        },
    },
    data() {
        return {
            tweetData: this.tweet,
            onOpen: false,
            comments: [],
        };
    },
    watch: {
        comments: {
            handler() {
                console.log('评论变化');
            },
            deep: true,
        },
    },
    mounted() {
        viewObserver = new IntersectionObserver(
            entries => {
                if (entries[0].intersectionRatio < 1) return;
                this.$emit('view', this.tweetData.id);
            },
            { threshold: 1.0 }
        );
        viewObserver.observe(this.$refs['tweet-' + this.tweetData.id]);
    },
    beforeUnmount() {
        viewObserver.unobserve(this.$refs['tweet-' + this.tweetData.id]);
    },
    emits: ['view'],
    methods: {
        /**
         * 删除
         */
        deleteIt() {
            deleteTweet(this.tweetData.id)
                .then(() => {
                    this.$msg('success', '删除成功');
                    setTimeout(() => {
                        window.location.reload();
                    }, 1000);
                })
                .catch(() => {
                    this.$msg('error', '删除失败');
                });
        },
        /**
         * 喜欢
         */
        likeIt() {
            if (!this.$auth.has()) return;
            like(1, this.tweetData.id)
                .then(res => {
                    this.tweetData.likes = res;
                    this.tweetData.isLiked = !this.tweetData.isLiked;
                    this.$msg('success', '点赞成功');
                })
                .catch(() => {
                    this.$msg('error', '点赞失败');
                });
        },
        /**
         * 评论
         */
        commentIt() {
            const that = this;
            this.$PL.show(this, {
                name: 'input-panel',
                data: {
                    placeholder: '评论该动态',
                    func: async function ({ text }) {
                        const params = {
                            wcate: 1,
                            wid: that.tweetData.id,
                            content: text,
                        };
                        await addComment(params)
                            .then(() => {
                                that.onOpen = true;
                                that.$nextTick(function () {
                                    that.$refs['comment-list'].init();
                                });
                                getTweet(that.tweetData.id).then(res => {
                                    that.tweetData.comments = res.comments;
                                });
                                return Promise.resolve();
                            })
                            .catch(err => {
                                return Promise.reject(err);
                            });
                    },
                },
            });
        },
    },
};
</script>

<style lang="scss" scoped>
.tweet-list-component {
    background-color: $white;
    border-radius: 8px;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.05);
    margin-bottom: 20px;
    overflow: hidden;
    // content-visibility: auto;
    &:hover .right-box .enter-btn {
        opacity: 1;
    }
    .main {
        padding: 20px;
    }
    .comments-box {
        padding: 20px;
        background-color: rgba(0, 0, 0, 0.03);
        overflow: hidden;
    }
}

.top-info {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    .user-info-box {
        margin-bottom: 10px;
        .post-date {
            font-size: 14px;
            color: $text3;
        }
    }
}

.content-box {
    margin-bottom: 20px;
}

.assess-box {
    display: flex;
    flex-direction: row;
    transform: translateX(-5px);
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
            padding: 8px 16px;
            font-size: 14px;
            background-color: rgba(0, 0, 0, 0.03);
            color: $highlight;
            transform: translateX(10px);
            opacity: 0;
            &.is-disabled {
                color: $text3;
            }
        }
    }
}
</style>
