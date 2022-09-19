<template>
    <teleport to="body">
        <transition name="fade">
            <div v-if="display" class="mask" @click="hide" />
        </transition>
        <transition
            name="zoom"
            @after-enter="keep = true"
            @after-leave="keep = false">
            <keep-alive>
                <component
                    :is="view ? view.name : null"
                    :data="view ? view.data : null"
                    @close="hide" />
            </keep-alive>
        </transition>
    </teleport>
</template>

<script>
import userPanel from './user-panel/index';
import userEdit from './user-edit/index';
import imgPreview from './img-preview/index';
import inputPanel from './input-panel/index';
import articleConfirm from './article-confirm/index';

export default {
    components: {
        'user-panel': userPanel,
        'user-edit': userEdit,
        'img-preview': imgPreview,
        'input-panel': inputPanel,
        'article-confirm': articleConfirm,
    },
    data() {
        return {
            keep: false,
        };
    },
    computed: {
        display() {
            return this.$store.getters['pl/getView'] !== null;
        },
        view() {
            return this.$store.getters['pl/getView'];
        },
    },
    created() {
        const that = this;
        document.onkeydown = function (event) {
            const e =
                event || window.event || arguments.callee.caller.arguments[0];
            if (e.keyCode == 65 && e.shiftKey) {
                that.$PL.show(that, {
                    name: 'user-panel',
                });
            }
        };
    },
    methods: {
        hide() {
            this.$PL.hide(this);
        },
        scrollFunction(e) {
            e = e || window.event;
            e?.preventDefault(); //禁止浏览器默认事件
        },
    },
};
</script>

<style lang="scss" scoped>
.mask {
    z-index: 100;
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background-color: rgba(0, 0, 0, 0.2);
    // backdrop-filter: blur(6px);
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

.zoom-enter-active,
.zoom-leave-active {
    transition: all 0.5s ease;
}

.zoom-enter-from,
.zoom-leave-to {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.7);
}

.slide-enter-active,
.slide-leave-active {
    transition: all 0.5s ease;
}

.slide-enter-from,
.slide-leave-to {
    opacity: 0;
    transform: translate(-50%, -50%) translateY(30px);
}
</style>
