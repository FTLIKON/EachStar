<template>
    <div class="article-detail-page">
        <div class="article-detail-inner">
            <div
                v-if="$route.path.indexOf('/detail') === -1"
                class="view-mask"
                @click="leave" />
            <div class="container">
                <template v-if="!articleData">
                    <Skeleton custom class="skeleton">
                        <SkeletonItem width="75%" :height="42"></SkeletonItem>
                        <SkeletonItem
                            class="skeleton-item-tag"
                            :width="100"
                            height="32"></SkeletonItem>
                        <SkeletonItem
                            class="skeleton-item-tag"
                            :width="75"
                            height="32"></SkeletonItem>
                        <SkeletonItem
                            class="skeleton-item-tag"
                            :width="75"
                            height="32"></SkeletonItem>
                        <SkeletonItem width="30%"></SkeletonItem>
                    </Skeleton>
                    <Skeleton class="skeleton"></Skeleton>
                </template>
                <template v-else>
                    <!-- 横幅 -->
                    <div class="banner">
                        <async-img
                            v-if="articleData?.cover"
                            class="banner-img"
                            :url="articleData?.cover.path"
                            suffix="?x-oss-process=image/resize,s_820" />
                        <div
                            class="banner-text"
                            :class="{ 'has-bg': articleData?.cover }">
                            <div class="main-title">
                                {{ articleData?.title }}
                            </div>
                            <div class="tags-box">
                                <div
                                    v-for="tag in articleData?.tags"
                                    :key="tag.id"
                                    class="tag">
                                    <span class="text">{{ tag.name }}</span>
                                </div>
                            </div>
                            <div class="other-info">
                                <span class="author">{{
                                    articleData?.userInfo.nickname
                                }}</span>
                                <span class="date">{{ postDate }}</span>
                            </div>
                        </div>
                    </div>
                    <!-- 主要内容 -->
                    <div class="wrapper-box">
                        <v-md-preview
                            :text="articleData?.content"
                            @copy-code-success="handleCopyCodeSuccess" />
                    </div>
                    <!-- 评论区 -->
                    <div class="comments-box">
                        <comment-list
                            ref="comment-list"
                            :cate="2"
                            :id="id"
                            @to-comment="commentIt" />
                    </div>
                </template>
            </div>
        </div>
        <teleport to="body">
            <!-- 操作栏 -->
            <operation-bar
                :z-index="52"
                center
                :left="410"
                :like="{
                    use: loggedUser?.lv > 1,
                    liked: articleData?.isLiked,
                    count: articleData?.likes,
                }"
                @to-like="likeIt"
                :comment="loggedUser?.lv > 1"
                @to-comment="commentIt"
                :tools="[
                    {
                        use: loggedUser?.lv > 1,
                        icon: 'icon-edit',
                        title: '编辑',
                        event: editIt,
                    },
                    {
                        use: loggedUser?.lv > 1,
                        icon: 'icon-trash',
                        title: '删除',
                        event: deleteIt,
                    },
                ]"
                :top="
                    $route.path.indexOf('/detail') === -1 ? scrollTop : true
                " />
        </teleport>
    </div>
</template>

<script>
import { getArticleDetail, deleteArticle } from '@/api/article.js';
import { beautifyTime } from '@/utils/formatDate.js';
import { like } from '@/api/prefer';
import { addComment } from '@/api/comment';
import commentList from '@/components/comment/index';
import operationBar from '@/components/operation-bar';
import { gsap } from 'gsap';
import Config from '/setting';

export default {
    name: 'ArticleDetial',
    components: {
        commentList,
        operationBar,
    },
    props: {
        id: {
            type: [String, Number],
            required: true,
        },
    },
    data() {
        return {
            // 文章数据
            articleData: null,
        };
    },
    computed: {
        postDate() {
            return beautifyTime(this.articleData?.postDate);
        },
        loggedUser() {
            return this.$auth.get('user');
        },
    },
    watch: {
        id: {
            handler(val) {
                if (val > 0) {
                    this.init();
                }
            },
            immediate: true,
        },
    },
    created() {
        const listBody = document.querySelector(
            `.article-list-component[mark="${this.id}"]`
        );
        if (listBody) {
            const rect = listBody.getBoundingClientRect();
            this.$nextTick(function () {
                const tl = gsap.timeline();
                tl.to('.article-detail-page', {
                    delay: 0,
                    duration: 0,
                    left: rect.left,
                    top: rect.top,
                    width: rect.width,
                    height: rect.height,
                    opacity: 0,
                    'border-radius': 8,
                    overflow: 'hidden',
                })
                    .to('.article-detail-page', {
                        duration: 0.2,
                        opacity: 1,
                        ease: 'cubic-bezier(0.4, 0, 0.2, 1)',
                    })
                    .to('.article-detail-page', {
                        duration: 0.1,
                        left: rect.left - 50,
                        width: rect.width + 100,
                        ease: 'cubic-bezier(0.4, 0, 0.2, 1)',
                    })
                    .to('.article-detail-page', {
                        duration: 0.3,
                        top: 0,
                        height: '100%',
                        ease: 'cubic-bezier(0.4, 0, 0.2, 1)',
                    })
                    .to('.article-detail-page', {
                        duration: 0,
                        left: 0,
                        width: '100%',
                        'border-radius': 0,
                        overflow: '',
                    })
                    .from('body>.operation-bar-component', {
                        duration: 0.2,
                        x: -20,
                        opacity: 0,
                        ease: 'cubic-bezier(0.4, 0, 0.2, 1)',
                    });
            });
        }
    },
    beforeRouteEnter(to, from, next) {
        if (from.path !== '/article/index') {
            next(vm => {
                if (!~vm.$route.path.indexOf('/detail')) {
                    vm.$router.replace({ path: to.path + '/detail' });
                }
            });
        } else {
            next();
        }
    },
    beforeRouteLeave() {
        this.$emitter.emit('view-leave');
    },
    methods: {
        async handleCopyCodeSuccess(code) {
            const content = `${code}\n作者：${Config.author}\n来源：${
                Config.title
            }\n链接：${Config.baseURL + this.$route.fullPath}\n${
                Config.copyRight
            }`;
            await navigator.clipboard.writeText(content);
            this.$msg('success', '已复制代码');
        },
        /**
         * 初始化
         */
        init() {
            getArticleDetail(this.id)
                .then(res => {
                    this.articleData = res;
                })
                .catch(() => {
                    this.$router.replace({
                        path: '/404',
                    });
                });
        },
        /**
         * 喜欢
         */
        likeIt() {
            if (!this.$auth.has()) return;
            like(2, this.articleData.id)
                .then(() => {
                    this.articleData.isLiked = !this.articleData.isLiked;
                    this.articleData.likes += this.articleData.isLiked ? 1 : -1;
                    this.$emitter.emit(
                        'article-like',
                        this.articleData.id,
                        this.articleData.isLiked ? 1 : -1
                    );
                    this.$msg('success', '点赞成功');
                })
                .catch(() => {
                    this.$msg('error', '点赞失败');
                });
        },
        /**
         * 评论
         */
        commentIt() {
            const that = this;
            this.$PL.show(this, {
                name: 'input-panel',
                data: {
                    placeholder: '评论该文章',
                    func: async function ({ text }) {
                        const params = {
                            wcate: 2,
                            wid: that.id,
                            content: text,
                        };
                        await addComment(params)
                            .then(() => {
                                that.$refs['comment-list'].init();
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
         * 编辑
         */
        editIt() {
            this.$router.push('/article/write?id=' + this.id);
        },
        /**
         * 删除
         */
        deleteIt() {
            const that = this;
            this.$confirm({
                title: '提示',
                content: '确定要删除该文章吗',
                optionsText: ['确定', '取消'],
                success: () => {
                    deleteArticle(that.id)
                        .then(() => {
                            that.$msg('success', '删除成功');
                            that.$store.commit('setEventLock', true);
                            setTimeout(function () {
                                that.$store.commit('setEventLock', false);
                                that.$router.go(-1);
                            }, 1000);
                        })
                        .catch(() => {
                            that.$msg('error', '删除失败');
                        });
                },
                fail: () => {
                    console.log('取消');
                },
            });
        },
        /**
         * 滚动到顶部
         */
        scrollTop() {
            const scrollTop = document.querySelector('.view-window').scrollTop;
            gsap.to('.view-window', {
                scrollTop: 0,
                duration: scrollTop / 10000,
            });
        },
        /**
         * 离开当前组件
         */
        leave() {
            this.$router.go(-1);
        },
    },
};
</script>

<style lang="scss" scoped>
.article-detail-inner {
    position: relative;
}

.view-mask {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    // background-color: rgba(0, 0, 0, 0.1);
    // transition: 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.container {
    box-sizing: border-box;
    position: relative;
    width: $detail_width;
    min-height: 100vh;
    margin: auto;
    background-color: $white;
    box-shadow: 0 8px 48px rgba(0, 0, 0, 0.05);
    overflow: hidden;
}
.skeleton {
    margin: 50px 50px 0;
    .skeleton-item-tag {
        display: inline-block;
        margin-right: 10px;
    }
    &:first-child {
        margin-top: 100px;
    }
}
.banner {
    position: relative;
    margin-bottom: 10px;
    font-size: 0;
    overflow: hidden;
    .banner-img {
        width: 100%;
        height: $nav_height + 240px;
        left: 0;
        top: 0;
        object-fit: cover;
        z-index: 0;
        user-select: none;
    }
    .banner-text {
        padding-bottom: 20px;
        border-bottom: solid 2px $divider_light;
        .main-title {
            font-size: 36px;
            font-weight: bold;
            color: $text1;
            margin-bottom: 10px;
        }
        .tags-box {
            margin-bottom: 10px;
            .tag {
                box-sizing: border-box;
                display: inline-block;
                height: 32px;
                padding: 5px 10px;
                font-size: 14px;
                border-radius: 8px;
                border: 0.5px solid $divider;
                color: $text2;
                transition: 0.1s;
                margin-right: 10px;
                vertical-align: middle;
                &:last-child {
                    display: inline-flex;
                    align-items: center;
                }
            }
        }
        .other-info {
            .author {
                font-size: 14px;
                color: $text1;
                margin-right: 3px;
            }
            .date {
                font-size: 14px;
                color: $text3;
            }
        }
        &:not(.has-bg) {
            margin: 100px 50px 0;
        }
        &.has-bg {
            box-sizing: border-box;
            position: absolute;
            width: 100%;
            padding: 0 50px;
            left: 0;
            bottom: 20px;
            border: none;
            .main-title {
                color: $text1;
                @include stroke($white);
            }
            .tags-box {
                .tag {
                    background-color: #fff;
                    // @include stroke($white);
                    // padding: 0;
                    // border: none;
                    // box-shadow: #fff 1px 0 0, #fff 0 1px 0, #fff -1px 0 0, #fff 0 -1px 0;
                }
            }
            .other-info {
                .author {
                    font-weight: bold;
                    color: $text2;
                    @include stroke($white);
                }
                .date {
                    font-weight: bold;
                    color: $text2;
                    @include stroke($white);
                }
            }
        }
    }
}

.wrapper-box {
    min-height: 50vh;
    // padding-bottom: 40px;
    // border-bottom: solid 2px $divider_light;
    margin: 40px 50px 40px;
    :deep(.vuepress-markdown-body) {
        background-color: unset;
        padding: 0;
        // font-family: msjh, Arial, sans-serif;
    }
}

.comments-box {
    padding: 50px;
    background-color: rgba(0, 0, 0, 0.03);
}
</style>
