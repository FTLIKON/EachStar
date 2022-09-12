<template>
    <div class="text-content">
        <pre class="pre" v-html="passText" width="500" />
    </div>
</template>

<script>
// 表情根目录
const root_path = 'assets/images/express/';

export default {
    props: {
        text: {
            type: String,
            required: false,
            default: '',
        },
    },
    data() {
        return {
            passText: '',
        };
    },
    watch: {
        text: {
            handler(val) {
                this.passText = val.replace(/\[[^\]]+\]/g, item => {
                    let code = item.match(/[[]?([^\]]*)[\]]?/i)[1];
                    if (code.slice(0, 6) === '#icon-') {
                        return `<img src=${require('/src/' +
                            root_path +
                            code.replace('#icon-', '') +
                            '.png')}
                            alt='[${code.slice(-2)}]'
                            style='display: inline-block; width: 24px; padding: 0 2px; vertical-align: sub;'>`;
                    } else {
                        return item;
                    }
                });
            },
            immediate: true,
        },
    },
};
</script>

<style lang="scss" scoped>
.text-content {
    font-size: 15px;
    line-height: 1.5em;
    color: $text1;
    .pre {
        font-family: 'Microsoft YaHei';
        white-space: pre-wrap;
        word-wrap: break-word;
        word-break: break-word;
        margin: unset;
    }
}
</style>
