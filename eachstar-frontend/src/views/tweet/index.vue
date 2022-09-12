<template>
    <div class="tweet-index-page">
        <div class="container">
            <div class="wrapper-box">
                <transition-group name="list" tag="div">
                    <tweet-list
                        v-for="tweet in page.data"
                        :key="tweet.id"
                        :tweet="tweet"
                        :item-id="tweet.id"
                        @view="viewTweet" />
                </transition-group>
                <div class="tip">
                    <span v-if="isLoading">{{ tipOptions.inLoading }}</span>
                    <span v-if="!page.next">{{ tipOptions.noMore }}</span>
                </div>
            </div>
            <time-line
                class="time-line"
                :records="page.data"
                :idx="currTweetId"
                @scroll-to="scrollTo" />
            <operation-bar :write="loggedUser?.lv == 2" @to-write="toWrite" />
        </div>
    </div>
</template>

<script>
import { getTweetList, addTweet } from '@/api/tweet';
import timeLine from '@/components/time-line';
import operationBar from '@/components/operation-bar';
import tweetList from './tweet-list';

export default {
    name: 'TweetIndex',
    components: {
        timeLine,
        operationBar,
        tweetList,
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
            // 当前动态id
            currTweetId: 0,
        };
    },
    computed: {
        loggedUser() {
            return this.$auth.get('user');
        },
    },
    activated() {
        const that = this;
        this.$emitter.on('touch-bottom', () => {
            that.loadMore();
        });
    },
    deactivated() {
        this.$emitter.off('touch-bottom');
    },
    methods: {
        /**
         * 获取动态列表
         */
        loadMore() {
            if (this.isLoading || !this.page.next) return;
            this.isLoading = true;
            const page = this.page;
            getTweetList(page.current, page.size).then(res => {
                this.page.data = [].concat(this.page.data, res.records); // this.page.data.concat(res.records);
                this.page.total += res.records.length;
                page.current++;
                if (this.page.total == res.total) this.page.next = false;
                this.isLoading = false;
            });
        },
        /**
         * 写动态
         */
        toWrite() {
            this.$PL.show(this, {
                name: 'input-panel',
                data: {
                    placeholder: '书写新动态',
                    upload: true,
                    func: async function ({ text, ids }) {
                        await addTweet(text, ids)
                            .then(() => {
                                setTimeout(function () {
                                    window.location.reload();
                                }, 1000);
                                return Promise.resolve();
                            })
                            .catch(err => {
                                return Promise.reject(err);
                            });
                    },
                },
            });
        },
        /**
         * 看到动态（用于通知 timeline 组件看到哪个动态）
         */
        viewTweet(id) {
            this.currTweetId = id;
        },
        /**
         * 滚动到指定 id 的动态
         */
        scrollTo(id) {
            const tweetDomList = document.querySelectorAll(
                '.tweet-list-component'
            );
            for (const tweetDom of tweetDomList) {
                if (tweetDom.getAttribute('item-id') == id) {
                    this.scrollTar = tweetDom.offsetTop;
                    window.scrollTo({
                        top: tweetDom.offsetTop - 75,
                        left: 0,
                        behavior: 'smooth',
                    });
                    return;
                }
            }
        },
    },
};
</script>

<style lang="scss" scoped>
.container {
    position: relative;
    width: $con_width;
    margin: 0 auto;
    padding-top: $nav_height;
}

.wrapper-box {
    margin-top: 50px;
    .tip {
        font-size: 14px;
        color: $text3;
        text-align: center;
        padding-bottom: 20px;
    }
    margin-bottom: 30px;
}
</style>
