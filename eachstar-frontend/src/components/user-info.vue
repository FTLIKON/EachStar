<template>
    <div class="user-info-component">
        <async-img
            v-if="avatar && userInfo.avatarPath"
            class="user-avatar"
            :url="userInfo.avatarPath"
            suffix="?x-oss-process=image/resize,s_32" />
        <span class="user-name">{{ userInfo.nickname }}</span>
        <slot />
    </div>
</template>

<script>
export default {
    props: {
        avatar: {
            type: Boolean,
            default: true,
            required: false,
        },
        userInfo: {
            type: Object,
            required: true,
        },
    },
    data() {
        return {};
    },
};
</script>

<style lang="scss" scoped>
.user-info-component {
    display: flex;
    flex-direction: row;
    align-items: center;
}

.user-avatar {
    width: 32px;
    height: 32px;
    border-radius: 100%;
    margin-right: 5px;
    object-fit: cover;
}

.user-name {
    font-size: 14px;
    color: $text2;
    margin-right: 5px;
}
</style>
