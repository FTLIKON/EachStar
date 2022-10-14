<template>
    <button @click="toggleDark()">
        123
        <span class="ml-2">{{ isDark ? 'Dark' : 'Light' }}</span>
    </button>
</template>

<script setup>
import { useToggle } from '@vueuse/shared'
// import { isDark } from '../../.vitepress/theme/composables/dark'

const isDark = true
const toggleDark = useToggle(isDark)
</script>

<style>

</style>