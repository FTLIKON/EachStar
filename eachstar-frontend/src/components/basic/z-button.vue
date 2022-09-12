<template>
    <button
        :class="[
            'z-button',
            type == 'normal' ? 'type-normal' : 'type-' + type,
            {
                'is-disabled': disabled,
                'is-round': round,
                'is-circle': circle,
                'is-ghost': ghost,
                'is-loading': loading,
            },
        ]"
        :disabled="disabled || loading"
        @click="handleClick">
        <i v-if="loading" class="loader" />
        <div class="inner" :style="{ opacity: loading ? 0 : 1 }">
            <slot />
        </div>
    </button>
</template>

<script>
import throttle from '@/utils/throttle';

export default {
    props: {
        type: {
            type: String,
            default: 'normal',
            required: false,
        },
        disabled: {
            type: Boolean,
            default: false,
            required: false,
        },
        circle: {
            type: Boolean,
            default: false,
            required: false,
        },
        round: {
            type: Boolean,
            default: false,
            required: false,
        },
        ghost: {
            type: Boolean,
            default: false,
            required: false,
        },
        loading: {
            type: Boolean,
            default: false,
            required: false,
        },
    },
    data() {
        return {};
    },
    emits: ['click'],
    methods: {
        handleClick: throttle(function (evt) {
            this.$emit('click', evt);
        }),
    },
};
</script>

<style lang="scss" scoped>
.z-button {
    position: relative;
    display: flex;
    line-height: 1;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    width: fit-content;
    min-height: 40px;
    padding: 10px 20px;
    border-radius: 8px;
    outline: none;
    border: none;
    cursor: pointer;
    overflow: hidden;
    transition: 0.1s;
    .inner {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
    }
    .loader-mask {
        position: absolute;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        border-color: rgba(0, 0, 0, 0.5);
        z-index: 1;
    }
    .loader {
        position: absolute;
        display: flex;
        left: 50%;
        top: 50%;
        width: 16px;
        height: 16px;
        transform: translate(-50%, -50%);
        border: 2px solid transparent;
        border-radius: 50%;
        border-top: 2px solid rgb(195, 195, 195);
        border-left: 2px solid rgb(195, 195, 195);
        animation: spin 1s linear infinite;
        z-index: 2;
    }
}
.type-normal {
    @include color($text2, $white);
    &:hover {
        @include color($text1, $white_hover);
    }
}
.type-primary {
    @include color($white, $highlight);
    &:hover {
        @include color($white_hover, $highlight_hover);
    }
}
.type-dashed {
    @include color($text2, transparent);
    @include border(dashed, 1px, $border);
    &:hover {
        @include color($text1, transparent);
        @include border(dashed, 1px, $border_hover);
    }
}
.type-link {
    @include color($highlight, transparent);
    @include border(none, 0px, unset);
    padding: 10px 0;
    &:hover {
        // text-decoration: underline;
        // text-underline-offset: 2px;
        @include color($highlight_hover, transparent);
        @include border(none, 0px, unset);
    }
}

.is-disabled {
    background-color: $text3;
    color: $white;
    cursor: not-allowed;
    &:hover {
        background-color: rgba(0, 0, 0, 0.5);
    }
}
.is-circle {
    aspect-ratio: 1;
    height: unset;
    padding: unset;
    border-radius: 100vmax;
}
.is-round {
    border-radius: 20px;
}
.is-ghost {
    box-sizing: border-box;
    background-color: transparent;
    @include border(solid, 1px, $border);
    &:hover {
        @include color($white, $highlight_hover);
        @include border(solid, 1px, $highlight_hover);
    }
}
.is-loading {
    cursor: not-allowed;
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
