<template>
    <span>{{ formatDate(date) }}</span>
</template>

<script>
import { beautifyTime } from '@/utils/formatDate';

export default {
    props: {
        date: {
            type: String,
            required: true,
        },
        format: {
            type: String,
            default: 'normal',
            required: false,
        },
    },
    methods: {
        formatDate(date) {
            return this.format === 'normal' ? beautifyTime(date) : null;
        },
    },
};
</script>
