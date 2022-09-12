<template>
    <div
        class="operation-bar-component"
        :style="{
            'margin-left': center
                ? `calc(50% + ${left}px + 30px)`
                : `calc(${left}px + 30px)`,
            'z-index': zIndex,
        }">
        <z-button
            v-if="like.use"
            class="option like-btn"
            type="primary"
            circle
            title="喜欢"
            @click="$emit('to-like')">
            <div class="inner">
                <span
                    class="iconfont"
                    :class="like.liked ? 'icon-like-fill' : 'icon-like'" />
                <span class="count">{{ like.count }}</span>
            </div>
        </z-button>
        <z-button
            v-if="comment"
            class="option comment-btn"
            circle
            title="评论"
            @click="$emit('to-comment')">
            <span class="iconfont icon-comment" />
        </z-button>
        <z-button
            v-if="write"
            class="option write-btn"
            circle
            title="写内容"
            @click="$emit('to-write')">
            <span class="iconfont icon-edit" />
        </z-button>
        <template v-for="(tool, index) in tools" :key="index">
            <z-button
                v-if="tool.use"
                class="option"
                circle
                :title="tool.title"
                @click="tool.event">
                <span :class="['iconfont', tool.icon]" />
            </z-button>
        </template>
        <z-button
            v-if="typeof top == 'boolean' && top"
            class="option top-btn"
            circle
            title="回到顶部"
            @click="toTop">
            <span class="iconfont icon-angle-double-up" />
        </z-button>
        <z-button
            v-if="typeof top == 'function'"
            class="option top-btn"
            circle
            title="回到顶部"
            @click="top">
            <span class="iconfont icon-angle-double-up" />
        </z-button>
    </div>
</template>

<script>
import { onMounted, onBeforeUnmount } from 'vue';

export default {
    props: {
        /**
         * 喜欢数据
         */
        like: {
            type: Object,
            required: false,
            default() {
                return {
                    use: false,
                    liked: false,
                    count: 0,
                };
            },
        },
        /**
         * 评论
         */
        comment: {
            type: Boolean,
            required: false,
            default: false,
        },
        /**
         * 写
         */
        write: {
            type: Boolean,
            required: false,
            default: false,
        },
        /**
         * z轴
         */
        zIndex: {
            type: [String, Number],
            require: false,
            default() {
                return '';
            },
        },
        /**
         * 回到顶部
         */
        top: {
            type: [Boolean, Function],
            required: false,
            default: true,
        },
        /**
         * 居中
         */
        center: {
            type: Boolean,
            required: false,
            default: false,
        },
        /**
         * 左边距
         */
        left: {
            type: Number,
            required: false,
            default: 720,
        },
        /**
         * 附加工具
         */
        tools: {
            type: Array,
            required: false,
            default() {
                return [];
            },
        },
    },
    data() {
        return {
            operations: ['like', 'comment', 'write', 'top'],
        };
    },
    emits: ['to-like', 'to-comment', 'to-write'],
    setup() {
        let isTopping = false;
        const checkWheel = function () {
            isTopping = false;
        };
        onMounted(() => {
            document.addEventListener('wheel', checkWheel, { passive: true });
        });
        onBeforeUnmount(() => {
            document.removeEventListener('wheel', checkWheel),
                { passive: true };
        });
        /**
         * 回到顶端
         */
        const toTop = function () {
            isTopping = true;
            const scroll = function () {
                const i =
                    document.documentElement.scrollTop ||
                    document.body.scrollTop;
                if (i > 0 && isTopping) {
                    window.requestAnimationFrame(scroll);
                    window.scrollTo(0, i - i / 8);
                }
            };
            scroll();
        };
        return { toTop };
    },
};
</script>

<style lang="scss" scoped>
.operation-bar-component {
    position: fixed;
    display: flex;
    flex-direction: column;
    bottom: 10%;
    .option {
        width: 48px;
        margin-top: 20px;
        box-shadow: 0 8px 12px rgba(0, 0, 0, 0.05);
        &.like-btn {
            .inner {
                display: flex;
                flex-direction: column;
                align-items: center;
                .iconfont {
                    font-size: 18px;
                }
                .count {
                    font-size: 12px;
                }
            }
        }
        &.comment-btn,
        &.write-btn {
            color: $highlight;
            &:hover {
                color: $highlight_hover;
            }
        }
        .iconfont {
            font-size: 20px;
        }
    }
}
</style>
