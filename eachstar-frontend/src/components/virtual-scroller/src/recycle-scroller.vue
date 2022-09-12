<template>
    <div
        id="scroller"
        :class="[
            'recycle-scroller',
            {
                [`direction-${direction}`]: true,
            },
        ]"
        @scroll.passive="handleScroll">
        <div
            class="recycle-scroller__wrapper"
            :style="{
                [direction === 'y' ? 'min-height' : 'min-width']:
                    totalSize + 'px',
            }">
            <div
                class="recycle-scroller__item"
                v-for="view in views"
                :key="view.index"
                :style="{
                    transform: `translate${direction === 'y' ? 'Y' : 'X'}(${
                        view.position
                    }px)`,
                    height: itemSize + 'px',
                }">
                <slot
                    :item="view.item"
                    :index="view.index"
                    :position="view.position" />
            </div>
        </div>
    </div>
</template>

<script setup>
import { onMounted, nextTick, ref, toRefs } from 'vue';
const props = defineProps({
    // 数据源
    data: {
        type: Array,
        required: true,
        default: () => {
            return [];
        },
    },
    // 列表方向
    direction: {
        type: String,
        required: false,
        default: 'y',
    },
    // 列表项大小
    itemSize: {
        type: Number,
        default: null,
    },
    // 缓冲
    buffer: {
        type: Number,
        default: 200,
    },
    // 页面模式
    pageMode: {
        type: Boolean,
        required: true,
    },
});
const { data, direction, itemSize, buffer, pageMode } = toRefs(props);
// 真实列表
const views = ref([]);
// 虚拟列表
// let _views = [];
// 总大小
let totalSize = ref(0);
// 开始下标
let _stratIndex = 0;
// 结束下标
let _endIndex = 0;
// 滚动事件锁
let _scrollLock = false;
// 滚动位置
let _scrollPosition = 0;
// 连续滚动
// let _continuous;

// 更新事件监听
const updateEventListener = () => {
    if (pageMode.value) {
        addEventListener('scroll', handleScroll, {
            passive: true,
        });
    } else {
        removeEventListener('scroll', handleScroll, {
            passive: true,
        });
    }
};

/**
 * 挂载
 */
onMounted(() => {
    updateEventListener();
    nextTick(() => {
        updataViews(true);
    });
});

/**
 * 获取滚动信息
 */
const getScroll = () => {
    const state = {};
    const isY = direction.value === 'y';
    const el = document.querySelector('#scroller');
    if (pageMode.value) {
        // TODO: 未完成
        const isY = direction.value === 'y';
        const bounds = el.getBoundingClientRect();
        const boundsSize = isY ? bounds.height : bounds.width;
        let start = -(isY ? bounds.top : bounds.left);
        let size = isY ? window.innerHeight : window.innerWidth;
        console.log(isY, bounds, start, size, boundsSize);
        if (start < 0) {
            size += start;
            start = 0;
        }
        // if (start + size > boundsSize) {
        //     size = boundsSize - start;
        // }
        state.start = start;
        state.end = start + size;
    } else if (isY) {
        state.start = el.scrollTop;
        state.end = el.scrollTop + el.clientHeight;
    } else {
        state.start = el.scrollLeft;
        state.end = el.scrollLeft + el.clientWidth;
    }
    console.log(state);
    return state;
};

/**
 * 添加虚拟列表项
 */
const addView = (index, item) => {
    const view = {
        item,
        position: 0,
        index,
    };
    views.value.push(view);
    return view;
};



/**
 * 取消使用虚拟列表项
 */
// const unuseView = view => {
//     delete views.value[
//         views.value.findIndex(v => {
//             return v.info.index === view.info.index;
//         })
//     ];
// };
/**
 * 对真实列表进行排序
 */
let _sortTimer;
const sortViews = () => {
    views.value.sort((viewA, viewB) => viewA.index - viewB.index);
};
/**
 * 更新列表
 */
const updataViews = (checkItem, checkPosition) => {
    let startIndex, endIndex;
    const count = data.value.length;
    if (count === 0) {
        startIndex = endIndex = totalSize.value = 0;
    } else {
        const scroll = getScroll();
        if (checkPosition) {
            let diff = scroll.start - _scrollPosition;
            // console.log(scroll, diff);
            if (diff < 0) diff = -diff;
            if (diff < itemSize.value) {
                return {
                    continuous: true,
                };
            }
        }
        // 记录本次滚动位置
        _scrollPosition = scroll.start;
        // 加上缓冲距离
        scroll.start -= buffer.value;
        scroll.end += buffer.value;
        // 计算开始下标和结束下标
        startIndex = ~~(scroll.start / itemSize.value);
        endIndex = Math.ceil(scroll.end / itemSize.value);
        // 处理临界情况
        startIndex < 0 && (startIndex = 0);
        endIndex > count && (endIndex = count);
        // 计算列表总大小
        totalSize.value = count * itemSize.value;
    }

    // 列表项
    let view;

    // 判断是否连续滚动
    const continuous = startIndex <= _endIndex && endIndex >= _stratIndex;

    /**
     * this.$_continuous为false；continuous为true时，即：
     * 如果上一次滚动是不相交的，本次滚动是相交的，就清空虚拟列表，将真实列表放入不使用的虚拟列表。
     *
     * this.$_continuous为true；continuous为true时，即：
     * 如果上一次滚动是相交的，本次滚动也是相交的，。
     */
    // if (_continuous !== continuous) {
    //     if (continuous) {
    //         for (let i = 0, l = views.value.length; i < l; i++) {
    //             view = views.value[i];
    //             unuseView(view);
    //         }
    //     }
    //     _continuous = continuous;
    // } else if (continuous) {
    //     for (let i = 0; i < views.value.length; i++) {
    //         view = views.value[i];
    //         if (view.nr.used) {
    //             // if (checkItem) {
    //             //     // 获取当前列表项在真是列表中的下标
    //             //     view.nr.index = data.value.findIndex(item =>
    //             //         keyField.value
    //             //             ? item[keyField.value] ===
    //             //               view.item[keyField.value]
    //             //             : item === view.item
    //             //     );
    //             // }

    //             // Check if index is still in visible range
    //             // 如果没有找到，或者找到的下标在可视范围之外，将该列表项设置为不使用
    //             if (
    //                 view.nr.index === -1 ||
    //                 view.nr.index < startIndex ||
    //                 view.nr.index >= endIndex
    //             ) {
    //                 unuseView(view);
    //             }
    //         }
    //     }
    // }

    // const unusedIndex = continuous ? null : new Map();
    // let item, type, unuseedPool, v;
    // for (let i = startIndex; i < endIndex; i++) {
    //     // 从数据源获取当前下标的数据项
    //     item = data.value[i];
    // }
    views.value = [];
    let item;
    for (let i = startIndex; i < endIndex; i++) {
        item = data.value[i];
        view = addView(i, item);
        // 更新列表项位置
        view.position = i * itemSize.value;
    }
    _stratIndex = startIndex;
    _endIndex = endIndex;
    clearTimeout(_sortTimer);
    _sortTimer = setTimeout(sortViews, 300);
    // console.log(data.value, startIndex, endIndex);
    // console.log(_views, _unusedViews, _stratIndex, _endIndex, _continuous);
    return {
        continuous,
    };
};
/**
 * 滚动事件
 */
let _refreshTimer;
const handleScroll = () => {
    if (!_scrollLock) {
        _scrollLock = true;
        requestAnimationFrame(() => {
            _scrollLock = false;
            const { continuous } = updataViews(false, true);
            if (!continuous) {
                clearTimeout(_refreshTimer);
                _refreshTimer = setTimeout(handleScroll, 100);
            }
        });
    }
};
</script>

<style lang="scss" scoped>
.recycle-scroller {
    position: relative;
    overflow-y: auto;
    &.direction-y .recycle-scroller__item {
        width: 100%;
    }
    &.direction-x .recycle-scroller__item {
        height: 100%;
    }
}
.recycle-scroller__wrapper {
    flex: 1;
    box-sizing: border-box;
    position: relative;
    overflow: hidden;
}
.recycle-scroller__item {
    position: absolute;
    top: 0;
    left: 0;
    will-change: transform;
}
</style>
