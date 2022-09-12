<template>
    <img
        :class="['async-img', { show: loaded && show }]"
        :src="realUrl"
        @load="load"
        @click="handleClick" />
</template>

<script>
export default {
    props: {
        url: {
            type: String,
            required: true,
        },
        prefix: {
            type: String,
            require: false,
            default: '',
        },
        suffix: {
            type: String,
            require: false,
            default: '',
        },
    },
    data() {
        return {
            loaded: false,
            show: false,
            realUrl: '',
        };
    },
    watch: {
        url: {
            handler() {
                this.init();
            },
            immediate: true,
        },
    },
    emits: ['click', 'load', 'onLoaded'],
    created() {
        this.show = true;
    },
    activated() {
        this.show = true;
    },
    deactivated() {
        this.show = false;
    },
    methods: {
        /**
         * 初始化
         */
        init() {
            const val = this.url;
            if (!val) return;
            if (
                val.indexOf('https://') !== -1 ||
                val.indexOf('data:image/') !== -1
            ) {
                this.realUrl = val;
            } else {
                this.realUrl = this.$settings.downloadUrl + val + this.suffix;
            }
            const that = this;
            const img = new Image();
            img.src = this.realUrl;
            img.onload = function () {
                that.$emit('onLoaded', img);
            };
        },
        /**
         * 加载
         */
        load() {
            this.loaded = true;
        },
        /**
         * 处理点击事件
         */
        handleClick(evt) {
            this.$emit('click', evt);
        },
    },
};
</script>

<style lang="scss" scoped>
.async-img {
    position: relative;
    object-fit: cover;
    opacity: 0;
    overflow: hidden;
    transition: 0.4s;
    &.show {
        opacity: 1;
    }
}
</style>
