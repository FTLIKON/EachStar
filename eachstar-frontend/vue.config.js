const Config = require('./setting');
const path = require('path');

// cdn预加载使用
const externals = {
    // 'vue': 'Vue',
    // 'vuex': 'Vuex',
    // 'vue-router': 'VueRouter',
    // 'axios': 'axios',
    // 'prismjs': 'Prism',
    // 'ali-oss': 'OSS',
    // 'vuedraggable': 'vuedraggable',
    // '@kangc/v-md-editor': 'VMdEditor',
    // '@kangc/v-md-editor/lib/preview': 'VMdPreview',
    // '@kangc/v-md-editor/lib/theme/vuepress': 'VMdTheme',
    // 'gsap': 'exports',
};
const cdn = {
    css: [
        'https://z2devil-bucket.oss-cn-beijing.aliyuncs.com/cdn/css/md-editor.css',
        'https://z2devil-bucket.oss-cn-beijing.aliyuncs.com/cdn/css/md-preview.css',
        'https://z2devil-bucket.oss-cn-beijing.aliyuncs.com/cdn/css/md-vuepress.css',
    ],
    js: [
        // 'https://cdn.jsdelivr.net/npm/vue@3.2.20/dist/vue.global.min.js',
        // 'https://cdn.jsdelivr.net/npm/vuex@4.0.2/dist/vuex.global.min.js',
        // 'https://cdn.jsdelivr.net/npm/vue-router@4.0.12/dist/vue-router.global.min.js',
        // 'https://cdn.jsdelivr.net/npm/axios@0.21.1/dist/axios.min.js',
        // 'https://cdn.jsdelivr.net/npm/prismjs@1.24.1/prism.min.js',
        // 'https://cdn.jsdelivr.net/npm/ali-oss@6.16.0/lib/client.min.js',
        // 'https://cdn.jsdelivr.net/npm/vuedraggable@4.1.0/dist/vuedraggable.umd.min.js',
        // 'https://cdn.jsdelivr.net/npm/@kangc/v-md-editor@2.3.14/lib/base-editor.js',
        // 'https://cdn.jsdelivr.net/npm/@kangc/v-md-editor@2.3.14/lib/preview.js',
        // 'https://oss.z2devil.cn/cdn/js/md-vuepress.js',
        // 'https://cdn.jsdelivr.net/npm/gsap@3.9.1/dist/gsap.min.js',
    ],
};

//引入插件
const CompressionWebpackPlugin = require('compression-webpack-plugin');
// const TerserPlugin = require("terser-webpack-plugin");
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
//匹配此 {RegExp} 的资源
const productionGzipExtensions = /\.(js|css|json|txt|html|ico|svg)(\?.*)?$/i;
module.exports = {
    css: {
        loaderOptions: {
            sass: {
                additionalData: `@import "@/styles/index.scss";`,
            },
        },
    },
    configureWebpack: config => {
        const plugins = [];
        // gzip 压缩
        plugins.push(
            new CompressionWebpackPlugin({
                filename: '[path].gz[query]', // 目标资源名称
                algorithm: 'gzip',
                test: productionGzipExtensions, // 处理所有匹配此 {RegExp} 的资源
                threshold: 10240, // 只处理比这个值大的资源。按字节计算(楼主设置10K以上进行压缩)
                minRatio: 0.8, // 只有压缩率比这个值小的资源才会被处理
            })
        );
        // bundle 分析
        plugins.push(new BundleAnalyzerPlugin());
        if (process.env.NODE_ENV === 'production') {
            config.mode = 'production';
            // 打包文件大小
            config.performance = {
                maxEntrypointSize: 10000000,
                maxAssetSize: 30000000,
            };
            // 代码压缩
            config.optimization.minimize = true;
            config.optimization.minimizer[0].options.terserOptions.compress.drop_console = true;
            config.optimization.minimizer[0].options.terserOptions.compress.pure_funcs =
                ['console.log'];
            // 分chunk
            config.optimization.splitChunks = {
                chunks: 'all',
                maxInitialRequests: Infinity, // 默认为 30，调整为允许无限入口资源
                minSize: 30000, // 30K以下的依赖不做拆分
                cacheGroups: {
                    vendors: {
                        name: 'chunk-vendors',
                        test: /[\\/]node_modules[\\/]/,
                        priority: -10,
                        chunks: 'initial',
                    },
                    editor: {
                        test: /[\\/]node_modules[\\/](@kangc[\\/]v-md-editor|prismjs)/,
                        name: 'chunk-editor',
                        chunks: 'all',
                    },
                    vuedraggable: {
                        test: /[\\/]node_modules[\\/](vuedraggable|sortablejs)/,
                        name: 'chunk-vuedraggable',
                        chunks: 'all',
                    },
                    gsap: {
                        test: /[\\/]node_modules[\\/](gsap)/,
                        name: 'chunk-gsap',
                        chunks: 'all',
                    },
                },
            };
            config.plugins = [...config.plugins, ...plugins];
        }
    },
    chainWebpack: config => {
        config.plugin('html').tap(args => {
            args[0].title = Config.title;
            return args;
        });
        config.entry('app').clear().add('./src/main.js');
        // 通过externals加载外部CDN资源
        config.set('externals', externals);
        config.plugin('html').tap(args => {
            args[0].cdn = cdn;
            return args;
        });
        // 配置svg加载规则
        config.module.rules.delete('svg'); //重点:删除默认配置中处理svg,
        config.module
            .rule('svg-sprite-loader')
            .test(/\.svg$/)
            .include.add(path.join(__dirname, 'src/assets/svgs')) //处理svg目录
            .end()
            .use('svg-sprite-loader')
            .loader('svg-sprite-loader')
            .options({
                symbolId: 'icon-[name]',
            });
    },
};
