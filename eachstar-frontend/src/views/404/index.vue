<template>
    <div class="none-network-page">
        <img :src="require('/src/assets/images/tip/none_network.png')" />
        <h1>肥肠抱歉，您访问的页面不见了</h1>
        <z-button type="primary" round @click="$router.push('/')">
            回到首页
        </z-button>
    </div>
</template>

<style lang="scss" scoped>
.none-network-page {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: fit-content;
    height: fit-content;
    margin: 0 auto;
}
</style>
