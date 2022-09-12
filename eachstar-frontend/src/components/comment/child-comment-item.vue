<template>
    <div class="child-comment-item">
        <!-- 顶部信息 -->
        <div class="top-info">
            <!-- <async-img class="user-avatar" 
                :url="commentData.userInfo.avatarPath"
                suffix="?x-oss-process=image/resize,s_24"></async-img> -->
            <span class="user-name">{{ commentData.userInfo.nickname }}</span>
            <span class="post-date">{{ formatDate }}</span>
            <more-operation
                dir="left"
                :list="[
                    {
                        icon: 'icon-trash',
                        text: '删除',
                        use:
                            $auth.has() &&
                            ($auth.get('user').id === commentData.userInfo.id ||
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
        </div>
    </div>
</template>

<script>
import textContent from '../text-content';
import moreOperation from '@/components/more-operation';
import { beautifyTime } from '@/utils/formatDate';
import { like } from '@/api/prefer';
import { deleteComment } from '@/api/comment';

export default {
    components: {
        textContent,
        moreOperation,
    },
    props: {
        data: {
            type: Object,
            required: true,
        },
    },
    data() {
        return {
            commentData: this.data,
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
    },
};
</script>

<style lang="scss" scoped>
.child-comment-item {
    position: relative;
    display: flex;
    flex-direction: column;
    & + .child-comment-item {
        margin-top: 10px;
    }
    &::before {
        $dot-size: 16px;
        content: '';
        box-sizing: border-box;
        position: absolute;
        display: block;
        top: 4px;
        left: -36px;
        width: $dot-size;
        height: $dot-size;
        border-radius: $dot-size/2;
        border: solid 3px #f7f7f7;
        background-color: #c7c7c7;
    }
}

.top-info {
    display: flex;
    flex-direction: row;
    align-items: center;
    &:hover .more-btn {
        opacity: 1;
    }
    .user-avatar {
        width: 24px;
        height: 24px;
        border-radius: 8px;
        margin-right: 10px;
        object-fit: cover;
    }
    .user-name {
        font-size: 14px;
        color: $text1;
        margin-right: 10px;
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
    margin: 5px 0 0;
    padding: 10px 15px;
    background-color: #fff;
    border-radius: 0 12px 12px 12px;
}

.assess-box {
    display: flex;
    flex-direction: row;
    // transform: translateX(-5px);
    padding-left: 8px;
    .assess-item {
        display: flex;
        align-items: center;
        align-content: center;
        margin-right: 10px;
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
</style>
