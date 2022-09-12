<template>
    <svg class="svg-icon" aria-hidden="true">
        <use :xlink:href="`#icon-${icon}`" />
    </svg>
</template>

<script>
export default {
    props: {
        icon: {
            type: String,
            required: true,
        },
    },
};
</script>

<style lang="scss" scoped>
.svg-icon {
    width: 1em;
    height: 1em;
    vertical-align: -0.15em;
    fill: currentColor;
    overflow: hidden;
}
</style>
