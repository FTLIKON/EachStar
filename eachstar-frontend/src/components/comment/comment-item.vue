<template>
    <div class="comment-item">
        <!-- 左侧头像栏 -->
        <div class="left-side">
            <img
                class="user-avatar"
                :src="
                    $settings.downloadUrl +
                    commentData.userInfo.avatarPath +
                    '?x-oss-process=image/resize,s_36'
                " />
            <div class="line" />
        </div>
        <!-- 主体部分 -->
        <div class="body">
            <!-- 顶部信息 -->
            <div class="top-info">
                <span class="user-name">{{
                    commentData.userInfo.nickname
                }}</span>
                <span class="post-date">{{ formatDate }}</span>
                <more-operation
                    dir="left"
                    :list="[
                        {
                            icon: 'icon-trash',
                            text: '删除',
                            use:
                                $auth.has() &&
                                ($auth.get('user').id ===
                                    commentData.userInfo.id ||
                                    $auth.get('user').lv === 2),
                            callback: deleteIt,
                        },
                    ]">
                    <span class="more-btn iconfont icon-dots" />
                </more-operation>
            </div>
            <!-- 评论内容 -->
            <div class="content">
                <text-content :text="commentData.content" />
            </div>
            <!-- 评价信息 -->
            <div class="assess-box">
                <div
                    class="assess-item"
                    :class="{ active: commentData.isLiked }"
                    @click="likeIt">
                    <span
                        class="iconfont"
                        :class="
                            commentData.isLiked ? 'icon-like-fill' : 'icon-like'
                        " />
                    <span>{{ commentData.likes }}</span>
                </div>
                <div class="assess-item" @click="commentIt">
                    <span class="iconfont icon-comment" />
                    <span>{{ commentData.comments }}</span>
                </div>
            </div>
            <!-- 子评论 -->
            <div
                v-if="commentData.childComments.total > 0"
                class="child-comments">
                <div class="child-comments-list">
                    <child-comment-item
                        v-for="comment in isShowMore
                            ? commentData.childComments.records
                            : commentData.childComments.records.slice(0, 3)"
                        :key="comment.id"
                        :data="comment"
                        @init="initChildren" />
                </div>
                <div class="bottom-bar">
                    <div
                        v-if="isShowMore === true"
                        class="btn hide-btn"
                        @click="hideMore">
                        <span>收起</span>
                    </div>
                    <div
                        v-if="isShowMore === false"
                        class="btn show-btn"
                        @click="showMore">
                        <span>展开</span>
                    </div>
                    <div
                        v-if="
                            (!isShowMore &&
                                commentData.childComments.records.length > 3) ||
                            commentData.childComments.total -
                                commentData.childComments.records.length >
                                0
                        "
                        class="btn more-btn"
                        @click="loadMoreChildren">
                        <span
                            >还有{{
                                commentData.childComments.total -
                                (isShowMore
                                    ? commentData.childComments.records.length
                                    : 3)
                            }}条回复，查看更多</span
                        >
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import textContent from '../text-content';
import childCommentItem from './child-comment-item';
import moreOperation from '@/components/more-operation';
import { beautifyTime } from '@/utils/formatDate';
import { like } from '@/api/prefer';
import {
    addComment,
    getChildCommentList,
    getComment,
    deleteComment,
} from '@/api/comment';

export default {
    components: {
        textContent,
        childCommentItem,
        moreOperation,
    },
    props: {
        cate: {
            type: [Number, String],
            required: true,
        },
        id: {
            type: [Number, String],
            required: true,
        },
        data: {
            type: Object,
            required: true,
        },
    },
    data() {
        return {
            commentData: this.data,
            isShowMore: null,
            isLoading: false,
            page: {
                current: this.data.childComments.current + 1,
                size: 4,
                total: this.data.childComments.total,
                next: this.data.childComments.total > 4,
            },
        };
    },
    computed: {
        formatDate() {
            return beautifyTime(this.commentData.postDate);
        },
    },
    emits: ['init'],
    methods: {
        /**
         * 删除
         */
        deleteIt() {
            deleteComment(this.commentData.id)
                .then(() => {
                    this.$msg('success', '删除成功');
                    this.$emit('init');
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
            like(0, this.commentData.id)
                .then(res => {
                    this.commentData.likes = res;
                    this.commentData.isLiked = !this.commentData.isLiked;
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
                    placeholder:
                        '回复' + '@' + this.commentData.userInfo.nickname,
                    func: async function ({ text }) {
                        const params = {
                            wcate: that.cate,
                            wid: that.id,
                            rid: that.commentData.id,
                            pid: that.commentData.id,
                            content: text,
                        };
                        await addComment(params)
                            .then(() => {
                                // getComment(that.commentData.id).then(res => {
                                //     console.log(res);
                                //     that.loadMoreChildren(true);
                                //     that.commentData = res;
                                // });
                                that.loadMoreChildren(true);
                                return Promise.resolve();
                            })
                            .catch(err => {
                                return Promise.reject(err);
                            });
                    },
                },
            });
        },
        /**
         * 隐藏更多
         */
        hideMore() {
            this.isShowMore = false;
        },
        /**
         * 显示更多
         */
        showMore() {
            this.isShowMore = true;
        },
        /**
         * 初始化
         */
        initChildren() {
            this.loadMoreChildren(true);
        },
        /**
         * 加载更多评论
         */
        loadMoreChildren(init) {
            if (this.isLoading) return;
            if (
                init !== true &&
                (!this.page.next || this.isShowMore === false)
            ) {
                this.isShowMore = true;
                return;
            }
            this.isLoading = true;
            const page = this.page;
            if (init === true) {
                page.current = 1;
                page.next = true;
                getComment(this.commentData.id).then(res => {
                    this.commentData = res;
                });
            }
            getChildCommentList(
                this.commentData.id,
                page.current,
                page.size
            ).then(res => {
                this.commentData.childComments.records =
                    init === true
                        ? res.records
                        : this.commentData.childComments.records.concat(
                              res.records
                          );
                // this.page.total += res.records.length;
                if (init === true) {
                    this.isShowMore = null;
                } else {
                    this.isShowMore = true;
                }
                page.current++;
                if (page.total == this.commentData.childComments.records.length)
                    page.next = false;
                this.isLoading = false;
            });
        },
    },
};
</script>

<style lang="scss" scoped>
.comment-item {
    box-sizing: content-box;
    display: flex;
    flex-direction: row;
    margin-bottom: 5px;
    &:last-child .left-side > .line {
        margin-bottom: 40px;
        &::after {
            $line-size: 5px;
            content: '';
            position: absolute;
            display: block;
            bottom: -30px;
            left: 0;
            width: 2px;
            height: 30px;
            background: linear-gradient(
                to bottom,
                transparent $line-size,
                rgba(#000, 0.1) $line-size
            );
            background-size: 100% $line-size * 2;
        }
    }
}

.left-side {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    flex-shrink: 0;
    margin-right: 10px;
    .user-avatar {
        flex-shrink: 0;
        width: 36px;
        height: 36px;
        margin-bottom: 5px;
        border-radius: 18px;
        object-fit: cover;
    }
    .line {
        position: relative;
        flex-grow: 1;
        width: 2px;
        background-color: rgba(0, 0, 0, 0.1);
    }
}
.body {
    flex-grow: 1;
    margin-bottom: 25px;
    .top-info {
        font-size: 14px;
        &:hover .more-btn {
            opacity: 1;
        }
        .user-name {
            color: $text1;
            margin-right: 5px;
        }
        .post-date {
            color: $text3;
            margin-right: 5px;
        }
        .more-btn {
            display: inline-block;
            transform: rotate(90deg);
            cursor: pointer;
            color: $text2;
            opacity: 0;
            transition: 0.1s;
            &:hover {
                color: $text1;
            }
        }
        :deep(.popup) {
            top: 26px;
        }
    }
    .content {
        width: fit-content;
        min-width: 72px;
        margin: 5px 0 0;
        padding: 10px 15px;
        background-color: #fff;
        border-radius: 0 12px 12px 12px;
    }
}

.assess-box {
    display: flex;
    flex-direction: row;
    // transform: translateX(8px);
    padding-left: 8px;
    .assess-item {
        display: flex;
        align-items: center;
        align-content: center;
        margin-right: 5px;
        font-size: 14px;
        color: $text2;
        cursor: pointer;
        padding: 5px;
        transition: 0.2s;
        &:hover {
            color: $text1;
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
}

.child-comments {
    // padding-left: 8px;
    .child-comments-list {
        margin: 10px 0 10px;
    }
    .bottom-bar {
        .btn {
            display: inline-block;
            font-size: 14px;
            color: $highlight;
            cursor: pointer;
            margin-right: 10px;
        }
    }
}
</style>
