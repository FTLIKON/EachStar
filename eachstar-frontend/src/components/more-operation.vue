<template>
    <div class="more-operation-component" :active="isShow">
        <!-- <z-button class="more-btn"
            circle
            @click="onMore">
            <span class="iconfont icon-dots"></span>
        </z-button> -->
        <div @click="onMore">
            <slot />
        </div>
        <transition name="fade">
            <div v-if="isShow" class="mask" @click="isShow = false" />
        </transition>
        <transition name="list">
            <div
                v-show="isShow"
                class="popup"
                :style="{
                    [dir]: 0,
                }">
                <template v-for="(item, index) in list" :key="index">
                    <div
                        v-if="item.use"
                        class="operation-item"
                        @click="onCallback(item.callback)">
                        <span :class="['iconfont', item.icon]" />
                        <span class="text">{{ item.text }}</span>
                    </div>
                </template>
            </div>
        </transition>
    </div>
</template>

<script>
export default {
    props: {
        dir: {
            type: String,
            required: false,
            default() {
                return 'right';
            },
        },
        list: {
            type: Array,
            required: false,
            default() {
                return [];
            },
        },
    },
    data() {
        return {
            isShow: false,
        };
    },
    methods: {
        /**
         * 按下更多按钮
         */
        onMore() {
            if (this.$auth.has()) {
                this.isShow = !this.isShow;
            }
        },
        /**
         * 触发回调函数
         */
        onCallback(callback) {
            this.isShow = false;
            setTimeout(function () {
                callback();
            }, 200);
        },
    },
};
</script>

<style lang="scss" scoped>
.more-operation-component {
    position: relative;
    display: inline-block;
    width: fit-content;
    .mask {
        position: fixed;
        display: block;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        z-index: 10;
    }
    .popup {
        z-index: 11;
        position: absolute;
        display: flex;
        flex-direction: column;
        top: 50px;
        width: 150px;
        box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16);
        background-color: #fff;
        padding: 10px 0;
        border-radius: 8px;
        .operation-item {
            box-sizing: border-box;
            display: flex;
            align-items: center;
            width: 100%;
            height: 36px;
            padding: 0 15px;
            color: $text2;
            cursor: pointer;
            transition: 0.1s;
            &:hover {
                background-color: rgba(0, 0, 0, 0.03);
                color: $text1;
            }
            .iconfont {
                font-size: 20px;
                margin-right: 5px;
            }
            .text {
                font-size: 17px;
            }
        }
    }
}

// 过渡动画
.fade-enter-active,
.fade-leave-active {
    transition: all 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

.list-enter-active,
.list-leave-active {
    transition: all 0.2s ease;
}
.list-enter-from,
.list-leave-to {
    opacity: 0;
    transform: translateY(-30px);
}
</style>
