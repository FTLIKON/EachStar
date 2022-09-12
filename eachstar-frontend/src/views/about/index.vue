<template>
    <div class="about-index-page">
        <div class="container">
            <!-- 小恶魔 -->
            <div class="devil-set">
                <svg-img class="face" icon="devil" />
                <transition name="fade">
                    <div
                        v-show="dialog.show"
                        :class="['dialog', dialog.point]"
                        @click="onDialog">
                        <span class="text">{{ dialog.content }}</span>
                        <small v-if="dialog.loaded" style="display: inline"
                            >点我继续</small
                        >
                    </div>
                </transition>
            </div>
            <!-- 介绍内容 -->
            <transition-group name="show" tag="div" class="content">
                <!-- 专业技能 -->
                <div v-show="steps === 1" class="section" key="1">
                    <div class="btn" @click="showDetail(0, 0)">
                        <span class="iconfont icon-code" />
                        <span class="text">编程</span>
                    </div>
                    <div class="btn" @click="showDetail(0, 1)">
                        <span class="iconfont icon-ruler" />
                        <span class="text">设计</span>
                    </div>
                </div>
                <!-- 光荣历史 -->
                <div v-show="steps === 2" class="section" key="2">
                    <div class="window">
                        <div class="inner">
                            <div class="time-line-box">
                                <!-- 历史项目 -->
                                <div
                                    v-for="(item, index) in history"
                                    :key="index"
                                    class="time-point"
                                    @click="showDetail(1, index)">
                                    <!-- 信息 -->
                                    <div class="info-box">
                                        <span class="title">{{
                                            item.title
                                        }}</span>
                                        <svg-img
                                            class="icon"
                                            :icon="item.icon" />
                                        <span class="date">{{
                                            item.date
                                        }}</span>
                                    </div>
                                    <!-- 时间线 -->
                                    <div class="time-line">
                                        <div class="point" />
                                        <div class="line" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!-- 提示信息 -->
                    <div class="tip-info">
                        <span class="iconfont icon-angle-left" />
                        <span>请滚动滑轮</span>
                        <span class="iconfont icon-angle-right" />
                    </div>
                </div>
            </transition-group>
        </div>
        <!-- 弹出层 -->
        <transition name="fade">
            <div v-if="layoutShow" class="layout">
                <div class="close-btn" @click="closeDetail">
                    <span class="iconfont icon-close" />
                </div>
                <div class="container">
                    <div class="inner">
                        <!-- 标题 -->
                        <div class="title-box">
                            <span class="title">{{ layoutText.title }}</span>
                            <span v-if="layoutText.date" class="date">{{
                                layoutText.date
                            }}</span>
                        </div>
                        <!-- 摘要 -->
                        <p v-if="layoutText.summary" class="summary">
                            {{ layoutText.summary }}
                        </p>
                        <!-- 详情 -->
                        <div class="details">
                            <!-- 详情条目 -->
                            <div
                                class="detail-item"
                                v-for="(item, index) in layoutText.details"
                                :key="index">
                                <div class="item-li">
                                    <!-- 标签 -->
                                    <span class="label">{{ item.label }}</span>
                                    <!-- 多条内容 -->
                                    <template
                                        v-if="typeof item.content === 'object'">
                                        <template
                                            v-for="(con, idx) in item.content"
                                            :key="idx">
                                            <!-- 链接 -->
                                            <a
                                                v-if="
                                                    con.indexOf('https://') >
                                                        -1 ||
                                                    con.indexOf('http://') > -1
                                                "
                                                class="text link"
                                                :href="con"
                                                target="_blank"
                                                >{{ con }}</a
                                            >
                                            <!-- 文字 -->
                                            <span v-else class="text">{{
                                                idx + 1 + '. ' + con
                                            }}</span>
                                        </template>
                                    </template>
                                    <!-- 普通单条内容 -->
                                    <template v-else>
                                        <!-- 链接 -->
                                        <a
                                            v-if="
                                                item.content.indexOf(
                                                    'https://'
                                                ) > -1 ||
                                                item.content.indexOf(
                                                    'http://'
                                                ) > -1
                                            "
                                            class="text link"
                                            :href="item.content"
                                            target="_blank"
                                            >{{ item.content }}</a
                                        >
                                        <!-- 文字 -->
                                        <span v-else class="text">{{
                                            item.content
                                        }}</span>
                                    </template>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </transition>
    </div>
</template>

<script>
import { gsap, Power1, Power2 } from 'gsap';
console.log(gsap);
import text from './text';

const pointType = {
    left: 'point-left',
    right: 'point-right',
};
const devilSetClass = '.devil-set';
const devilClass = '.face';

export default {
    data() {
        return {
            dialog: {
                show: false,
                content: '',
                point: pointType.left,
                loaded: false,
            },
            steps: 0,
            layoutShow: false,
            layoutText: {},
            history: [],
        };
    },
    watch: {
        steps: {
            handler() {
                this.layoutShow = false;
            },
        },
    },
    created() {
        const that = this;
        this.history = text.history;
        this.$nextTick(function () {
            that.bindScrollEvent();
            const tl = gsap.timeline();
            tl.to(devilClass, {
                delay: 0,
                duration: 0,
                opacity: 0,
                scale: 0.4,
            })
                .to(devilClass, {
                    delay: 0,
                    duration: 0.2,
                    opacity: 1,
                    scale: 1,
                    rotate: 10,
                    ease: Power2.out,
                })
                .call(function () {
                    that.setDialog(true, '你好，我是中二Devil。');
                });
            gsap.to(devilSetClass, {
                top: 230,
                duration: 1,
                repeat: -1,
                yoyo: true,
                ease: Power1.easeInOut,
            });
        });
    },
    methods: {
        /**
         * 绑定滚动事件
         */
        bindScrollEvent() {
            const window = document.querySelector('.window');
            window.addEventListener('wheel', e => {
                e.preventDefault();
                window.scrollLeft += e.deltaY;
            });
        },
        /**
         * 设置对话框
         */
        setDialog(show, content = null, point = pointType.left, speed = 100) {
            const that = this;
            // 设置对话框内容
            function setContent(val) {
                that.dialog.loaded = false;
                let text = '',
                    textArr = val.split(''),
                    idx = 0;
                // 添加字符
                function addChar() {
                    setTimeout(function () {
                        if (textArr.length === 0) {
                            that.dialog.content = '';
                            return;
                        }
                        text += textArr[idx];
                        that.dialog.content = text;
                        if (idx < textArr.length - 1) {
                            idx++;
                            addChar();
                        }
                        if (idx === textArr.length - 1) {
                            setTimeout(function () {
                                that.dialog.loaded = true;
                            }, speed);
                        }
                    }, speed);
                }
                addChar();
            }
            /**隐藏 */
            if (show === false) {
                that.dialog.show = false;
                return;
            }
            /**展示 */
            // 如果正在展示
            if (this.dialog.show) {
                // 先隐藏
                this.dialog.show = false;
                setTimeout(function () {
                    setContent('');
                }, 400);
                // 再展示
                setTimeout(function () {
                    that.dialog.show = true;
                    if (content !== null) {
                        setContent(content);
                    }
                    that.dialog.point = point;
                }, 500);
            } else {
                setContent('');
                setTimeout(function () {
                    that.dialog.show = show;
                    setContent(content);
                }, 100);
                that.dialog.point = point;
            }
        },
        /**
         * 点击对话框
         */
        onDialog() {
            const that = this;
            /**剧本 */
            function* drama() {
                yield (() => {
                    const tl = gsap.timeline();
                    tl.call(function () {
                        that.setDialog(false);
                    })
                        .to(devilSetClass, {
                            delay: 0.4,
                            duration: 0.6,
                            marginLeft: 620,
                            ease: 'back.out(1.7)',
                        })
                        .to(devilClass, {
                            delay: 0,
                            duration: 0.2,
                            rotate: -10,
                            ease: Power2.out,
                        })
                        .call(function () {
                            that.setDialog(
                                true,
                                '请看看我的专业技能！',
                                pointType.right
                            );
                            setTimeout(() => {
                                that.steps = 1;
                            }, 1200);
                        });
                })();
                yield (() => {
                    const tl = gsap.timeline();
                    tl.call(function () {
                        that.setDialog(false);
                    })
                        .to(devilSetClass, {
                            delay: 0.4,
                            duration: 0.6,
                            marginLeft: 0,
                            ease: 'back.out(1.7)',
                        })
                        .to(devilClass, {
                            delay: 0,
                            duration: 0.2,
                            rotate: 10,
                            ease: Power2.out,
                        })
                        .call(function () {
                            that.setDialog(
                                true,
                                '请看看我的光荣历史！',
                                pointType.left
                            );
                            setTimeout(() => {
                                that.steps = 2;
                            }, 1200);
                        });
                })();
            }
            if (!this.drama) {
                this.drama = drama();
            }
            /**执行剧本 */
            this.drama.next();
        },
        /**
         * 查看详情
         */
        showDetail(type, idx) {
            // 技能
            if (type === 0) {
                this.layoutText = idx === 0 ? text.code : text.design;
            }
            // 历史
            if (type === 1) {
                this.layoutText = text.history[idx];
            }
            this.layoutShow = true;
        },
        /**
         * 关闭详情
         */
        closeDetail() {
            this.layoutShow = false;
        },
    },
};
</script>

<style lang="scss" scoped>
$con_width: 820px;

.about-index-page {
    position: relative;
}

.container {
    position: relative;
    width: $con_width;
    margin: 0 auto;
    padding-top: $nav_height;
}

.layout {
    z-index: 10;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(255, 255, 255, 0.5);
    backdrop-filter: blur(20px);
    .close-btn {
        position: absolute;
        display: flex;
        align-items: center;
        justify-content: center;
        top: $nav_height + 64px;
        right: 64px;
        width: 42px;
        height: 42px;
        border-radius: 24px;
        background-color: rgba(0, 0, 0, 0.2);
        cursor: pointer;
        transition: 0.1s;
        &:hover {
            background-color: rgba(0, 0, 0, 0.4);
        }
        .iconfont {
            font-size: 24px !important;
            color: #fff;
        }
    }
    .container {
        height: calc(100% - #{$nav_height});
        padding: 0;
        margin-top: $nav_height;
        overflow: auto;
        .inner {
            margin: 100px 0 100px;
            .title-box {
                display: flex;
                flex-direction: row;
                align-items: flex-end;
                justify-content: space-between;
                margin: 50px 0 30px;
                .title {
                    font-size: 64px;
                    font-weight: bold;
                    color: $text1;
                }
                .date {
                    font-weight: bold;
                    color: $text3;
                }
            }
            .summary {
                font-size: 17px;
                line-height: 1.5em;
                color: $text2;
                margin-bottom: 30px;
            }
            .details {
                .item-li {
                    margin-bottom: 30px;
                    .label {
                        display: block;
                        font-size: 18px;
                        font-weight: bold;
                        color: $text1;
                        margin-bottom: 10px;
                    }
                    .text {
                        display: block;
                        font-size: 17px;
                        line-height: 1.5em;
                        color: $text2;
                        margin-bottom: 10px;
                    }
                }
            }
        }
    }
}

.devil-set {
    position: fixed;
    top: 200px;
    .face {
        position: relative;
        left: 100px;
        width: 200px;
        height: 200px;
        transform: translate(-50%, -50%);
    }
    .dialog {
        position: absolute;
        top: 50px;
        left: 150px;
        padding: 15px 20px;
        background-color: #fff;
        border-radius: 18px;
        border: solid 2px $divider;
        cursor: pointer;
        .text {
            font-size: 28px;
            font-weight: bold;
            white-space: nowrap;
            color: $text1;
        }
        &.point-left {
            left: 150px;
            border-top-left-radius: 0;
        }
        &.point-right {
            left: 50px;
            transform: translateX(-100%) scale(1);
            border-top-right-radius: 0;
        }
    }
}

.content {
    position: relative;
}

.section {
    position: absolute;
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
    top: 0;
    left: 0;
    margin-top: 40vh;
    width: 100%;
    @mixin gradient($point) {
        content: '';
        z-index: 1;
        position: absolute;
        display: block;
        top: 0;
        @if $point == 'left' {
            right: 0;
        } @else {
            left: 0;
        }
        width: 100px;
        height: 100%;
        background: linear-gradient(to $point, $back, transparent);
    }
    &::before {
        @include gradient(left);
    }
    &::after {
        @include gradient(right);
    }
    .tip-info {
        position: absolute;
        display: flex;
        flex-direction: row;
        align-items: center;
        left: 50%;
        bottom: 50px;
        transform: translateX(-50%);
        color: $text3;
        animation: shining 1s alternate infinite;
        .iconfont {
            font-size: 24px !important;
        }
    }
    .btn {
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: 152px;
        height: 152px;
        border-radius: 18px;
        border: solid 3px transparent;
        background-color: #fff;
        cursor: pointer;
        transition: 0.2s;
        .iconfont {
            font-size: 64px !important;
            margin-bottom: 10px;
        }
        .text {
            font-size: 28px;
            font-weight: bold;
        }
        &:first-child {
            color: #6563ff;
            &:hover {
                border: solid 3px #6563ff;
            }
        }
        &:last-child {
            color: #ff9b63;
            &:hover {
                border: solid 3px #ff9b63;
            }
        }
    }
    .window {
        position: relative;
        width: 100%;
        height: 420px;
        margin: 0 auto;
        // background-color: #fff;
        overflow: hidden;
        .inner {
            width: fit-content;
            .time-line-box {
                display: flex;
                flex-direction: row;
                width: fit-content;
                margin: 140px 160px 0;
                .time-point {
                    width: fit-content;
                    &:last-child {
                        .line {
                            &::after {
                                $line-size: 5px;
                                content: '';
                                position: absolute;
                                display: block;
                                right: -50px;
                                width: 50px;
                                height: 2px;
                                background: linear-gradient(
                                    to right,
                                    transparent $line-size,
                                    $divider $line-size
                                );
                                background-size: $line-size * 2 100%;
                            }
                        }
                    }
                    .info-box {
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        width: 168px;
                        padding: 0 30px;
                        transform: translateX(-50%);
                        cursor: pointer;
                        &:hover {
                            .title {
                                transform: translateY(-10px);
                            }
                            .icon {
                                transform: translateY(-10px);
                            }
                        }
                        .title {
                            font-size: 16px;
                            font-weight: bold;
                            color: #fff;
                            @include stroke(rgba(0, 0, 0, 0.5));
                            transition: 0.1s;
                        }
                        .icon {
                            width: 64px;
                            height: 64px;
                            transition: 0.1s;
                        }
                        .date {
                            margin-top: 36px;
                            font-size: 14px;
                            font-weight: bold;
                            color: #fff;
                            @include stroke(rgba(0, 0, 0, 0.5));
                        }
                    }
                    .time-line {
                        position: relative;
                        width: 100%;
                        top: -40px;
                        .point {
                            z-index: 1;
                            box-sizing: border-box;
                            position: absolute;
                            left: 0;
                            top: 0;
                            width: 14px;
                            height: 14px;
                            border-radius: 7px;
                            border: solid 2px $divider;
                            background-color: #fff;
                            transform: translate(-50%, -50%);
                        }
                        .line {
                            width: 100%;
                            height: 2px;
                            background-color: $divider;
                            transform: translateY(-1px);
                        }
                    }
                }
            }
        }
    }
}

@keyframes shining {
    from {
        opacity: 1;
    }
    to {
        opacity: 0.2;
    }
}

.fade-enter-active,
.fade-leave-active {
    transition: 0.4s;
}
.fade-enter-from,
.fade-leave-to {
    &.point-left {
        transform: scale(0.8);
    }
    &.point-right {
        transform: translateX(-100%) scale(0.8) !important;
    }
    opacity: 0;
}

.show-enter-active,
.show-leave-active {
    transition: 0.4s;
}
.show-enter-from,
.show-leave-to {
    transform: translateY(50px);
    opacity: 0;
}
</style>
