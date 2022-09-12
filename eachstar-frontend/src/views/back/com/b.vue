<template>
    <div>
        <span>组件B</span>
        <picture>
            <source
                media="(min-width: 650px)"
                srcset="@/assets/svgs/devil.svg"
                type="image/svg" />
            <!-- <source media="(min-width: 650px)" srcset="@/assets/images/express/三条线.png"> -->
            <!-- <source media="(min-width: 465px)" srcset="@/assets/images/express/什么.png"> -->
            <img src="@/assets/images/express/便便.png" />
        </picture>
    </div>
</template>

<script>
export default {
    data() {
        return {};
    },
};
</script>

<style scoped></style>
