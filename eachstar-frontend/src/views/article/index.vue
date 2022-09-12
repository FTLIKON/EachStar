<template>
    <div class="article-index-page">
        <!-- 筛选栏 -->
        <filter-box
            :trigger="filterTrigger"
            @options-trigger="onOptionsTrigger"
            @search="onSearch" />
        <div class="container">
            <!-- 主要 -->
            <div
                class="wrapper-box"
                :style="{
                    marginTop: filterTrigger
                        ? 120 + optionsHeight + 'px'
                        : '50px',
                }">
                <transition-group name="list" tag="div">
                    <article-list
                        v-for="article in page.data"
                        :key="article.id"
                        :article="article"
                        :item-id="article.id"
                        @to-detail="toDetail" />
                </transition-group>
                <div class="tip">
                    <span v-if="isLoading">{{ tipOptions.inLoading }}</span>
                    <span v-if="!page.next">{{ tipOptions.noMore }}</span>
                </div>
            </div>
            <!-- 操作栏 -->
            <operation-bar :write="loggedUser?.lv == 2" @to-write="toWrite" />
        </div>
        <!-- 预览层 -->
        <div class="view-layout">
            <transition name="fade">
                <div v-if="viewDetail" class="view-mask" />
            </transition>
            <router-view class="view-window" />
        </div>
    </div>
</template>

<script>
import { getArticleList } from '@/api/article';
import operationBar from '@/components/operation-bar';
import articleList from './article-list';
import filterBox from './filter';

export default {
    name: 'ArticleIndex',
    components: {
        operationBar,
        articleList,
        filterBox,
    },
    data() {
        return {
            isLoading: false,
            page: {
                current: 1,
                size: 10,
                total: 0,
                data: [],
                next: true,
            },
            tipOptions: {
                noMore: '没有更多了',
                inLoading: '加载中...',
            },
            filterTrigger: false,
            optionsHeight: 0,
            keyword: '',
            tags: [],
            viewDetail: false,
        };
    },
    computed: {
        loggedUser() {
            return this.$auth.get('user');
        },
    },
    watch: {
        viewDetail: {
            handler(val) {
                if (val) {
                    document.removeEventListener('wheel', this.scrollEvent, {
                        passive: false,
                    });
                    document.querySelector('body').style.overflow = 'hidden';
                } else {
                    document.addEventListener('wheel', this.scrollEvent, {
                        passive: false,
                    });
                    document.querySelector('body').style.overflow = '';
                }
            },
        },
    },
    mounted() {
        const that = this;
        this.$emitter.on('article-like', (id, val) => {
            for (let i = 0; i < that.page.data.length; i++) {
                const li = that.page.data[i];
                if (li.id === id) {
                    li.isLiked = val > 0;
                    li.likes += val;
                    break;
                }
            }
        });
    },
    activated() {
        const that = this;
        this.$emitter.on('touch-bottom', () => {
            that.getArtcileList();
        });
        this.$emitter.on('view-leave', () => {
            that.viewDetail = false;
        });
        // 滚动监听事件（筛选框）
        document.addEventListener('wheel', this.scrollEvent, {
            passive: false,
        });
    },
    deactivated() {
        this.$emitter.off('touch-bottom');
        this.$emitter.off('view-leave');
        // 卸载滚动监听事件
        document.removeEventListener('wheel', this.scrollEvent, {
            passive: false,
        });
    },
    beforeUnmount() {
        this.$emitter.off('article-like');
    },
    methods: {
        /**
         * 滚动事件
         */
        scrollEvent(e) {
            const that = this;
            // 如果开启了弹出层，返回
            if (that.$store.getters['pl/getView'] !== null) return;
            // 如果不在页面顶部，返回
            const scrollTop = document.documentElement.scrollTop;
            if (scrollTop != 0) return;
            // 获取主要内容元素
            const wrapper = document.querySelector('.wrapper-box');
            const isAniming = wrapper.getAnimations().length > 0;
            if (!isAniming) {
                // 上滑
                if (e.deltaY < 0) {
                    if (that.filterTrigger) return;
                    that.filterTrigger = true;
                    wrapper.animate(
                        [
                            { marginTop: '50px' },
                            { marginTop: 120 + this.optionsHeight + 'px' },
                        ],
                        {
                            duration: 400,
                            easing: 'ease',
                        }
                    );
                }
                // 下滑
                if (e.deltaY > 0) {
                    if (that.filterTrigger) e.preventDefault();
                    that.filterTrigger = false;
                }
            } else {
                e.preventDefault();
            }
        },
        /**
         * filter 筛选条件展开事件
         */
        onOptionsTrigger(val) {
            this.optionsHeight = val;
        },
        /**
         * 搜索
         */
        onSearch({ keyword, tags }) {
            this.keyword = keyword;
            this.tags = tags;
            this.getArtcileList('init');
        },
        /**
         * 获取文章列表
         */
        getArtcileList(val) {
            if (val && val == 'init') {
                this.page = {
                    current: 1,
                    size: 10,
                    total: 0,
                    data: [],
                    next: true,
                };
            }
            if (this.isLoading || !this.page.next) return;
            this.isLoading = true;
            const page = this.page;
            const params = {
                current: page.current,
                size: page.size,
            };
            if (this.keyword != '') params.keyword = this.keyword;
            if (this.tags.length != 0) params.tags = this.tags;
            getArticleList(params).then(res => {
                this.page.data = this.page.data.concat(res.records);
                this.page.total += res.records.length;
                page.current++;
                if (this.page.total == res.total) this.page.next = false;
                this.isLoading = false;
                if (this.keyword != '') this.highlightHandle();
            });
        },
        /**
         * 查看详情
         */
        toDetail(id) {
            this.viewDetail = true;
            this.$router.push({
                path: '/article/' + id,
            });
        },
        /**
         * 写文章
         */
        toWrite() {
            this.$router.push('/article/write');
        },
        /**
         * 搜索结果高亮处理
         */
        highlightHandle() {
            this.$nextTick(function () {
                const regex = new RegExp(this.keyword, 'gi');
                const summaryNodes = document.querySelectorAll('.summary');
                for (let i = 0; i < summaryNodes.length; i++) {
                    const node = summaryNodes[i];
                    summaryNodes[i].innerHTML = node.innerHTML.replace(
                        regex,
                        function (word) {
                            return `<span class='highlight-text'>${word}</span>`;
                        }
                    );
                }
                const titleNodes = document.querySelectorAll('.title');
                for (let i = 0; i < titleNodes.length; i++) {
                    const node = titleNodes[i];
                    titleNodes[i].innerHTML = node.innerHTML.replace(
                        regex,
                        function (word) {
                            return `<span class='highlight-text'>${word}</span>`;
                        }
                    );
                }
            });
        },
    },
};
</script>

<style lang="scss" scoped>
.article-index-page {
    position: relative;
    overflow: hidden;
}

.container {
    position: relative;
    width: $con_width;
    margin: 0 auto;
    padding-top: $nav_height;
}

.wrapper-box {
    transition: 0.4s;
}

.wrapper-box {
    margin-bottom: 30px;
    .tip {
        font-size: 14px;
        color: $text3;
        text-align: center;
        padding-bottom: 20px;
    }
    :deep(.highlight-text) {
        background-color: yellow;
    }
}

.view-mask {
    z-index: 50;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.2);
    transition: 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.view-window {
    z-index: 50;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow: auto;
    // backdrop-filter: blur(5px);
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>
