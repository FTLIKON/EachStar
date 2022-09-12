<template>
    <div class="empty-info-component">
        <img
            class="image"
            :src="require('/src/assets/images/tip/empty_data.png')" />
        <span class="text">{{ tip }}</span>
        <z-button
            v-if="btn.use"
            class="button"
            type="primary"
            round
            @click="btn.callback">
            {{ btn.text }}
        </z-button>
    </div>
</template>

<script>
export default {
    props: {
        tip: {
            type: String,
            required: false,
            default() {
                return '暂时没有数据哦';
            },
        },
        btn: {
            type: Object,
            required: false,
            default() {
                return {
                    use: false,
                    text: '做点什么',
                    callback: null,
                };
            },
        },
    },
    data() {
        return {};
    },
    methods: {},
};
</script>

<style lang="scss" scoped>
.empty-info-component {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: fit-content;
    height: fit-content;
    margin: 0 auto;
    overflow: hidden;
    .image {
        width: 256px;
        height: 256px;
        user-select: none;
    }
    .text {
        font-size: 17px;
        line-height: 1.5em;
        text-align: center;
        color: $text2;
    }
    .button {
        margin-top: 20px;
    }
}
</style>
