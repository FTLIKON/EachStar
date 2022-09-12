<template>
    <div
        :class="['skeleton-item', `display-${type}`]"
        :style="{ width: parseValue(width), height: parseValue(height) }"></div>
</template>

<script setup>
defineProps({
    type: {
        type: String,
        required: false,
        default: 'line',
    },
    width: {
        type: [Number, String],
        required: false,
        default: '100%',
    },
    height: {
        type: [Number, String],
        required: false,
        default: 24,
    },
});
const parseValue = val => {
    return val + (~String.prototype.indexOf.call(val, '%') ? '' : 'px');
};
</script>

<style lang="scss" scoped>
.skeleton-item {
    margin: 0 0 10px;
    background: linear-gradient(90deg, #dee1e4 25%, #e6e8eb 35%, #dee1e4 50%);
    background-size: 400% 100%;
    animation: loading 1.4s ease infinite;
}
@keyframes loading {
    0% {
        background-position: 100% 50%;
    }
    100% {
        background-position: 0 50%;
    }
}
.display-line {
    border-radius: 8px;
}
.display-box {
    border-radius: 8px;
    aspect-ratio: 1;
}
.display-circle {
    border-radius: 100%;
    aspect-ratio: 1;
}
</style>
