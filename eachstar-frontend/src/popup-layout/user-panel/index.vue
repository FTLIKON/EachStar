<template>
    <div class="user-panel-box">
        <user-sign v-if="!isLogged" @close="$emit('close')" />
        <user-center v-if="isLogged" @close="$emit('close')" />
    </div>
</template>

<script>
import userSign from './user-sign';
import userCenter from './user-center';

export default {
    components: {
        userSign,
        userCenter,
    },
    data() {
        return {
            isLogged: false,
        };
    },
    activated() {
        this.isLogged = this.$auth.has();
    },
    emits: ['close'],
};
</script>

<style lang="scss" scoped>
.user-panel-box {
    box-sizing: border-box;
    position: fixed;
    width: 640px;
    height: fit-content;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) scale(1);
    background-color: $white;
    border-radius: 8px;
    padding: 40px 50px;
    z-index: 200;
}
</style>
