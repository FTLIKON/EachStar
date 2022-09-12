<template>
    <div class="page-container">
        <router-view v-slot="{ Component }">
            <!-- <template v-if="route.meta.root"> -->
            <!-- <transition name="fade"> -->
            <keep-alive :include="['TweetIndex', 'ArticleIndex']">
                <component :is="Component" />
            </keep-alive>
            <!-- </transition> -->
            <!-- </template>
            <template v-else>
                <component :is="Component" />
            </template> -->
            <!-- 页面底部 -->
            <div id="page-end" />
        </router-view>
        <!-- <router-view></router-view> -->
    </div>
</template>

<script>
export default {
    data() {
        return {
            touchBottomObserver: null,
            // botttomLoading: false,
        };
    },
    watch: {
        $route: {
            handler() {
                const that = this;
                this.$nextTick(function () {
                    that.pagingObserver();
                });
            },
            immediate: true,
        },
    },
    methods: {
        pagingObserver() {
            const pageEnd = document.querySelector('#page-end');
            if (!pageEnd) return;
            if (this.touchBottomObserver) {
                this.touchBottomObserver.disconnect();
                this.touchBottomObserver = null;
            }
            this.touchBottomObserver = new IntersectionObserver(entries => {
                if (entries[0].intersectionRatio <= 0) return;
                // that.getArtcileList();
                console.log('触底');
                this.$emitter.emit('touch-bottom', '123');
            });
            this.touchBottomObserver.observe(
                document.querySelector('#page-end')
            );
        },
    },
};
</script>

<style lang="scss" scoped>
// 容器
.page-container {
    position: relative;
    // padding-top: $nav_height;
    // width: 100%;
    // height: 100vh;
    // overflow: hidden;
}

// 页面过渡动画
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.1s ease;
}
.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>
