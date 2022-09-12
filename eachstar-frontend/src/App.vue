<template>
    <div id="main">
        <top-nav v-if="navShow" />
        <router-view />
        <popup-layout ref="popupLayout" />
        <a class="gov-record" href="https://beian.miit.gov.cn/" target="_blank"
            >豫ICP备2021001737号</a
        >
    </div>
</template>

<script>
import topNav from '@/components/top-nav';
import popupLayout from '@/components/popup-layout/index';

export default {
    components: {
        'top-nav': topNav,
        popupLayout,
    },
    computed: {
        navShow() {
            return this.$store.getters['nav/getShow'];
        },
        eventLock() {
            return this.$store.getters['getEventLock'];
        },
    },
    created() {
        const that = this;
        window.addEventListener(
            'click',
            function (e) {
                if (that.eventLock) {
                    e.stopPropagation();
                }
            },
            true
        );
    },
};
</script>

<style lang="scss">
@import url(//at.alicdn.com/t/font_2012018_tkf4x0svmo.css);

#main {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
}

// 滚动条（任意写一个样式即可修改其他伪元素样式）
::-webkit-scrollbar,
::-webkit-scrollbar-track {
    width: 6px;
    height: 6px;
    background-color: transparent;
    // background-color: #fff;
}
// 滚动条滑块
::-webkit-scrollbar-thumb {
    border-radius: 3px;
    background-color: #c9cdd4;
}

body {
    margin: 0;
    padding: 0;
    background-color: $back;
    font-family: 'Microsoft YaHei', Arial, sans-serif;
    color: $text1;
}

ul {
    margin-block-start: unset;
    margin-block-end: unset;
    margin-inline-start: unset;
    margin-inline-end: unset;
    padding-inline-start: unset;
    list-style-type: none;
}

.page {
    position: relative;
    width: 100%;
    height: 100vh;
    overflow: auto;
}

.gov-record {
    position: fixed;
    bottom: 10px;
    left: 50%;
    transform: translateX(-50%);
    font-size: 12px;
    text-decoration: none;
    color: rgba(0, 0, 0, 0.1);
    transition: 0.1s;
    &:hover {
        color: rgba($color: #000, $alpha: 0.3);
    }
}
</style>
