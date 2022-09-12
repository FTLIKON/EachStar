<template>
    <div class="skeleton">
        <template v-if="custom">
            <slot></slot>
        </template>
        <template v-else>
            <skeleton-item width="70%" />
            <skeleton-item v-for="i in 3" :key="i" />
            <skeleton-item width="35%" />
        </template>
    </div>
</template>

<script setup>
import skeletonItem from './skeleton-item';
defineProps({
    custom: {
        type: Boolean,
        required: false,
        default: false,
    },
});
</script>

<style lang="scss" scoped></style>
