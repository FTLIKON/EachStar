<template>
    <div>
        <img
            class="image"
            :src="$settings.downloadUrl + src"
            @load="isLoading = false"
            @click="hide" />
        <i v-if="isLoading" class="loader" />
    </div>
</template>

<script>
export default {
    props: {
        src: {
            type: String,
            required: true,
        },
    },
    data() {
        return {
            isLoading: true,
        };
    },
    methods: {
        hide() {
            this.$PL.hide(this);
        },
    },
};
</script>

<style lang="scss" scoped>
.image {
    max-width: 100%;
    max-height: 100%;
    pointer-events: auto;
}
.loader {
    position: absolute;
    display: flex;
    left: 50%;
    top: 50%;
    width: 64px;
    height: 64px;
    transform: translate(-50%, -50%);
    border: 6px solid transparent;
    border-radius: 50%;
    border-top: 6px solid $white;
    border-left: 6px solid $white;
    animation: spin 1s linear infinite;
    z-index: 2;
}

@keyframes spin {
    0% {
        transform: translate(-50%, -50%) rotate(0deg);
    }
    100% {
        transform: translate(-50%, -50%) rotate(360deg);
    }
}
</style>
