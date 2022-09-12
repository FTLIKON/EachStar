<template>
    <div class="time-line-component" ref="time-line">
        <ul class="time-line-box">
            <div class="line-item" :style="{ height: lineHeight + 'px' }" />
            <transition-group name="dropdown">
                <li
                    v-for="(item, index) in contents"
                    :key="index"
                    class="time-item"
                    :class="{ active: index == current }"
                    @click="$emit('scroll-to', item.include[0])">
                    <span>{{ formatDate(item.postDate) }}</span>
                    <span>({{ item.include.length }})</span>
                </li>
            </transition-group>
        </ul>
    </div>
</template>

<script>
import { beautifyTime } from '@/utils/formatDate';
import throttle from '@/utils/throttle';

const timeAtom = [31536000, 2592000, 604800, 86400, 3600, 60, 1];

export default {
    props: {
        // 数据源
        records: {
            type: Array,
            required: true,
        },
        idx: {
            type: Number,
            default: 0,
            required: false,
        },
    },
    data() {
        return {
            // 当前选择的时间
            current: 0,
            // 目录
            contents: [],
            // 时间级别
            timeLevel: 0,
        };
    },
    computed: {
        lineHeight() {
            // return (this.contents.length > 0 ? 100 : 0) + (this.contents.length > 6 ? 6 : this.contents.length) * 43;
            return (
                (this.contents.length > 0 ? 100 : 0) + this.contents.length * 43
            );
        },
    },
    watch: {
        records: {
            handler() {
                this.init();
            },
            deep: true,
        },
        idx: {
            handler(val) {
                for (let i = 0; i < this.contents.length; i++) {
                    const content = this.contents[i];
                    if (content.include.indexOf(val) > -1) {
                        this.current = i;
                        return;
                    }
                }
            },
        },
    },
    mounted() {
        this.addWheelEvent();
    },
    emits: ['scroll-to'],
    methods: {
        /**
         * 格式化时间
         */
        formatDate(date) {
            return beautifyTime(date, this.timeLevel);
        },
        /**
         * 初始化
         */
        init() {
            // 数据源
            const records = this.records;
            // 处理后的数据源（预目录）
            const passRecords = [];
            // 向已有时间段添加内容
            const that = this;
            const pushRecord = function (record) {
                const recordTimeAtom = new Date(record.postDate);
                for (const passRecord of passRecords) {
                    const passRecordTimeAtom = new Date(passRecord.postDate);
                    // 如果时间相差较小
                    if (
                        Math.abs(recordTimeAtom - passRecordTimeAtom) <=
                        timeAtom[that.timeLevel] * 1000
                    ) {
                        passRecord.include.push(record.id);
                        return true;
                    }
                }
                return false;
            };
            // 创建新时间段
            for (const record of records) {
                if (passRecords.length == 0 || !pushRecord(record)) {
                    passRecords.push({
                        postDate: record.postDate,
                        include: [record.id],
                    });
                }
            }
            // 应用新目录
            this.contents = passRecords;
        },
        /**
         * 添加滚轮事件
         */
        addWheelEvent() {
            this.$refs['time-line'].addEventListener('wheel', e => {
                e.preventDefault();
                this.wheelEvent(e);
            });
        },
        /**
         * 滚轮事件
         */
        wheelEvent: throttle(function (e) {
            // 处理临界情况
            if (e.deltaY < 0 && this.timeLevel == 6) return;
            if (e.deltaY > 0 && this.timeLevel == 0) return;
            // 数值较大时阻止时间等级变动
            for (const record of this.records) {
                const timestamp = new Date(record.postDate);
                let mistiming = Math.round(new Date()) - timestamp;
                mistiming = Math.abs(mistiming / 1000);
                const newLevel = this.timeLevel + (e.deltaY < 0 ? 1 : -1);
                if (Math.floor(mistiming / timeAtom[newLevel]) > 9999) return;
            }
            // 时间等级变动
            this.timeLevel += e.deltaY < 0 ? 1 : -1;
            this.init();
        }),
    },
};
</script>

<style lang="scss" scoped>
.time-line-component {
    position: fixed;
    display: flex;
    flex-direction: column;
    top: calc(#{$nav_height} + 5%);
    margin-left: -150px;
}

.time-line-box {
    width: 120px;
    // max-height: 240px;
    padding: 50px 0;
    overflow: hidden;
    .line-item {
        content: '';
        position: absolute;
        top: 0;
        right: 5.5px;
        bottom: 0;
        width: 2px;
        background-image: linear-gradient(
            to top,
            rgba(51, 0, 0, 0),
            rgba(51, 0, 0, 0.2),
            rgba(51, 0, 0, 0)
        );
        z-index: -1;
        transition: 0.3s;
    }
}

.time-item {
    position: relative;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-end;
    text-align: right;
    font-size: 14px;
    color: $text2;
    transition: 0.1s;
    &:hover {
        cursor: pointer;
        color: $text1;
        &::after {
            border: 2px solid $text2;
        }
    }
    &::after {
        content: '';
        box-sizing: border-box;
        width: 13px;
        height: 13px;
        border-radius: 50%;
        border: 2px solid $divider;
        background-color: $back;
        margin-left: 10px;
        transition: 0.1s;
    }
    & + .time-item {
        margin-top: 30px;
    }
    &.active {
        color: $highlight;
        &::after {
            border: 2px solid $highlight;
        }
    }
}

.dropdown-enter-active,
.dropdown-leave-active {
    transition: all 0.3s ease;
}
.dropdown-enter-from,
.dropdown-leave-to {
    opacity: 0;
    transform: translateY(30px);
}
</style>
