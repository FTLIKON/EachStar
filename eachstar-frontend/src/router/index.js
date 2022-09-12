import { createRouter, createWebHistory } from 'vue-router';
import authUtils from '@/utils/auth';
import store from '@/store';

// 【前端工程化】require.context 批量导入路由
// let views = {};
// require.context('@/views', true, /index.vue$/).keys().forEach(path => {
// 	console.log('views', path, path.match(/\/.*?\//));
// 	let name = path.match(/\/.*?\//);
// 	if (!name) return;
// 	name = name[0].replaceAll('/', '');
// 	views[name] = () => import('@/views/' + name + '/index');
// });
// const index = () => import('@/views/index');

const index = () => import(/* webpackChunkName: "index" */ '@/views/index');

const tweetIndex = () =>
    import(/* webpackChunkName: "tweet" */ '@/views/tweet/index');
const articleIndex = () =>
    import(/* webpackChunkName: "article" */ '@/views/article/index');
const articleDetail = () =>
    import(/* webpackChunkName: "article" */ '@/views/article-detail/index');
const articleWrite = () =>
    import(/* webpackChunkName: "article" */ '@/views/write-article/index');
const aboutIndex = () =>
    import(/* webpackChunkName: "other" */ '@/views/about/index');
// const mapIndex = () => import( /* webpackChunkName: "other" */ '@/views/map/index');
const backIndex = () =>
    import(/* webpackChunkName: "other" */ '@/views/back/index');
const errorIndex = () =>
    import(/* webpackChunkName: "other" */ '@/views/404/index');

const routes = [
    {
        path: '/',
        component: index,
        redirect: () => {
            return {
                path: '/tweet/index',
            };
        },
        children: [
            {
                path: '/tweet/index',
                component: tweetIndex,
                meta: {
                    root: true,
                    contents: 0,
                    paging: true,
                },
            },
            {
                path: '/article/index',
                component: articleIndex,
                meta: {
                    root: true,
                    contents: 1,
                    paging: true,
                },
                children: [
                    {
                        path: '/article/:id',
                        component: articleDetail,
                        props: true,
                        // beforeEnter: (to, from) => {
                        // 	// reject the navigation
                        // 	if (from.path !== '/article/index') {
                        // 		return { path: to.path + '/detail', };
                        // 	}
                        // 	return true;
                        // },
                    },
                ],
            },
            {
                path: '/article/:id/detail',
                component: articleDetail,
                props: true,
            },
            {
                path: '/article/write',
                component: articleWrite,
                props: route => ({
                    id: route.query.id,
                }),
                meta: {
                    auth: 2,
                },
            },
            {
                path: '/about/index',
                component: aboutIndex,
                meta: {
                    root: true,
                    contents: 2,
                },
            },
            {
                path: '/back/index',
                component: backIndex,
            },
        ],
    },
    {
        path: '/404',
        component: errorIndex,
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

/**
 * 全局导航守卫
 */

// 前置守卫
router.beforeEach(async (to, from, next) => {
    if (to.matched.length === 0) {
        next('/404');
    } else if (to.meta.auth) {
        const auth = await authUtils.auth();
        if (auth >= to.meta.auth) {
            next();
        } else {
            next('/404');
        }
    } else {
        next();
    }
});

// 解析守卫
// router.beforeResolve(async to => {
// 	if (to.meta.auth) {
// 		if (authUtils.has() && authUtils.user().lv >= to.meta.auth) {
// 			return true;
// 		}else {
// 			return false;
// 		}
// 	}else {
// 		return true;
// 	}
// });

// 后置守卫
router.afterEach(to => {
    if (!to.meta.root) {
        store.commit('nav/setBack', true);
    } else {
        store.commit('nav/setBack', false);
    }
    if (to.meta.contents != null) {
        store.commit('nav/setCurrent', to.meta.contents);
    } else {
        store.commit('nav/setCurrent', -1);
    }
});

export default router;
