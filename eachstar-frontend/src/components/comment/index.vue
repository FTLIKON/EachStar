<template>
    <div class="comment-component">
        <template v-if="!isLoading && page.total === 0">
            <empty-info
                tip="暂时没有评论哦"
                :btn="{
                    use: $auth.has(),
                    text: '发表评论',
                    callback: toComment,
                }" />
        </template>
        <template v-else>
            <div class="title">评论({{ page.total }})</div>
            <div
                class="comment-list"
                :style="{
                    opacity: isLoading ? 0 : 1,
                }">
                <comment-item
                    v-for="comment in page.data"
                    :key="comment.id"
                    :cate="cate"
                    :id="id"
                    :data="comment"
                    @init="init" />
            </div>
            <div class="bottom-bar">
                <div
                    :class="[
                        'page-change-btn',
                        {
                            active: page.current > 1,
                        },
                    ]"
                    @click="getDataList(false)">
                    <span class="iconfont icon-angle-left" />
                    <span class="text">上一页</span>
                </div>
                <div class="indicator-box">
                    <span>{{ page.current }} / {{ page.pages }}</span>
                </div>
                <div
                    :class="[
                        'page-change-btn',
                        {
                            active: page.current < page.pages,
                        },
                    ]"
                    @click="getDataList(true)">
                    <span class="text">下一页</span>
                    <span class="iconfont icon-angle-right" />
                </div>
            </div>
        </template>
    </div>
</template>

<script>
import commentItem from './comment-item.vue';
import emptyInfo from '@/components/basic/empty-info.vue';
import { getCommentList } from '@/api/comment.js';

export default {
    components: {
        commentItem,
        emptyInfo,
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
    },
    data() {
        return {
            isLoading: false,
            page: {
                current: 0,
                size: 4,
                pages: 1,
                total: 0,
                data: [],
            },
            tipOptions: {
                noMore: '没有更多了',
                inLoading: '加载中...',
            },
        };
    },
    computed: {
        loggedUser() {
            return this.$auth.get('user');
        },
    },
    created() {
        this.init();
    },
    emits: ['to-comment'],
    methods: {
        /**
         * 初始化
         */
        init() {
            this.page.current = 0;
            this.page.pages = 1;
            this.getDataList(true);
        },
        /**
         * 获取评论列表
         */
        getDataList(dir) {
            if (dir) {
                if (this.isLoading || this.page.current === this.page.pages)
                    return;
            } else {
                if (this.isLoading || this.page.current === 1) return;
            }
            this.isLoading = true;
            const page = this.page;
            dir ? page.current++ : page.current--;
            getCommentList(this.cate, this.id, page.current, page.size).then(
                res => {
                    this.page.data = res.records;
                    this.page.pages = res.pages;
                    this.page.total = res.total;
                    this.isLoading = false;
                }
            );
        },
        /**
         * 发表评论
         */
        toComment() {
            this.$emit('to-comment');
        },
    },
};
</script>

<style lang="scss" scoped>
.title {
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 20px;
    color: $text1;
}

.comment-list {
    transition: 0.2s;
}

.bottom-bar {
    display: flex;
    width: 100%;
    height: 64px;
    .indicator-box {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        margin: 0 20px;
        color: $text2;
    }
    .page-change-btn {
        box-sizing: border-box;
        display: flex;
        align-items: center;
        width: 100%;
        height: 100%;
        padding: 10px;
        border-radius: 8px;
        color: $text3;
        cursor: pointer;
        user-select: none;
        transition: 0.1s;
        &:last-child {
            justify-content: flex-end;
        }
        &:hover {
            background: rgba($color: #000, $alpha: 0.03);
            color: $text2;
            &.active {
                color: $highlight-hover;
            }
        }
        &.active {
            color: $highlight;
        }
        .iconfont {
            font-size: 24px;
        }
        .text {
            line-height: 24px;
        }
    }
}
</style>
