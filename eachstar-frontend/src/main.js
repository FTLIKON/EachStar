import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';

const app = createApp(App);

/**
 * setting 相关
 */
import settings from '/setting.js';
app.config.globalProperties.$settings = settings;

/**
 * 认证相关
 */
import authUtils from '@/utils/auth.js';
app.config.globalProperties.$auth = authUtils;

/**
 * 图片相关
 */
import asyncImg from '@/components/basic/async-img.vue';
app.component('AsyncImg', asyncImg);

/**
 * 空数据提示相关
 */
import emptyInfo from '@/components/basic/empty-info.vue';
app.component('EmptyInfo', emptyInfo);

/**
 * message 提示框相关
 */
import { msg } from '@/components/basic/message/index.js';
import '@/components/basic/message/style.scss';
app.config.globalProperties.$msg = msg;

/**
 * confirm 提示框相关
 */
import { confirm } from '@/components/basic/confirm/index.js';
import '@/components/basic/confirm/style.scss';
app.config.globalProperties.$confirm = confirm;

/**
 * popupLayout 弹出层相关
 */
import { show, hide } from '@/components/popup-layout/script';
const pl = {
    show: show,
    hide: hide,
};
app.config.globalProperties.$PL = pl;

/**
 * 格式化时间相关
 */
import formatDate from '@/components/basic/format-date';
app.component('FormatDate', formatDate);

/**
 * 自定义按钮相关
 */
import zButton from '@/components/basic/z-button';
app.component('ZButton', zButton);

/**
 * vue-md-editor
 */
import VMdEditor from '@kangc/v-md-editor';
import VMdPreview from '@kangc/v-md-editor/lib/preview';
import VMdTheme from '@kangc/v-md-editor/lib/theme/vuepress';
import Prism from 'prismjs';
VMdEditor.use(VMdTheme, {
    Prism,
    codeHighlightExtensionMap: {
        vue: 'html',
    },
});
VMdPreview.use(VMdTheme, {
    Prism,
    codeHighlightExtensionMap: {
        vue: 'html',
    },
});
import createLineNumbertPlugin from '@kangc/v-md-editor/lib/plugins/line-number/index';
VMdEditor.use(createLineNumbertPlugin());
VMdPreview.use(createLineNumbertPlugin());
import createCopyCodePlugin from '@kangc/v-md-editor/lib/plugins/copy-code/index';
import '@kangc/v-md-editor/lib/plugins/copy-code/copy-code.css';
import '@/styles/markdown.css';
VMdEditor.use(createCopyCodePlugin());
VMdPreview.use(createCopyCodePlugin());
app.use(VMdEditor);
app.use(VMdPreview);

import emitter from './emitter/index.js';
app.config.globalProperties.$emitter = emitter;

import svgImg from '@/components/basic/svg-img';
app.component('SvgImg', svgImg);

import skeleton from '@/components/skeleton';
app.use(skeleton);

import './assets/svgs';

/**
 * 其他
 */
app.use(store);
app.use(router);
app.mount('#app');
