<template>
    <div
        class="img-preview-box"
        :style="{
            '--btn-width': btn_width + 'px',
        }">
        <div
            class="images-row"
            :style="{
                transform: 'translateX(' + -screenWidth * current + 'px)',
            }">
            <div
                v-for="(image, index) in data.images"
                :key="index"
                class="image-box"
                :style="{
                    width: screenWidth - btn_width * 2 + 'px',
                }">
                <async-img class="image" :url="image.path" />
            </div>
        </div>
        <div class="btn pre-btn-box" @click="current > 0 ? current-- : current">
            <span class="iconfont" />
        </div>
        <div
            class="btn next-btn-box"
            @click="current < data.images.length - 1 ? current++ : current">
            <span class="iconfont" />
        </div>
    </div>
</template>

<script>
const btn_width = 100;

export default {
    props: {
        data: {
            type: Object,
            required: true,
        },
    },
    data() {
        return {
            current: 0,
            screenWidth: 0,
        };
    },
    beforeCreate() {
        this.btn_width = btn_width;
    },
    activated() {
        this.screenWidth = this.onWindowResize;
        window.addEventListener('resize', this.onWindowResize);
        const that = this;
        this.keyEvent = document.onkeydown;
        document.onkeydown = function (event) {
            const e =
                event || window.event || arguments.callee.caller.arguments[0];
            if (e.keyCode == 37) {
                that.current > 0 ? that.current-- : that.current;
            }
            if (e.keyCode == 39) {
                that.current < that.data.images.length - 1
                    ? that.current++
                    : that.current;
            }
        };
    },
    deactivated() {
        window.removeEventListener('resize', this.onWindowResize);
        document.onkeydown = this.keyEvent;
    },
    watch: {
        data: {
            handler(val) {
                this.$nextTick(function () {
                    this.onWindowResize();
                });
                this.current = val.index;
            },
            deep: true,
            immediate: true,
        },
    },
    methods: {
        onWindowResize() {
            const box = document.querySelector('.img-preview-box');
            if (box.clientWidth && box.clientWidth != 0)
                this.screenWidth = box.clientWidth;
        },
    },
};
</script>

<style lang="scss" scoped>
.img-preview-box {
    $btn-width: var(--btn-width);
    position: fixed;
    width: 100%;
    height: 100%;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 200;
    pointer-events: none;
    .images-row {
        position: relative;
        display: flex;
        flex-direction: row;
        height: 100%;
        width: fit-content;
        .image-box {
            $btn-width: var(--btn-width);
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 $btn-width;
            .image {
                max-width: 100%;
                max-height: 100%;
            }
        }
    }
    .btn {
        position: fixed;
        display: flex;
        align-items: center;
        justify-content: center;
        width: $btn-width;
        height: 100%;
        top: 0;
        opacity: 0;
        transition: 0.4s;
        cursor: pointer;
        pointer-events: auto;
        &:hover {
            opacity: 1;
        }
        &.pre-btn-box {
            left: 0;
            background-image: linear-gradient(
                to right,
                rgba(0, 0, 0, 0.3),
                rgba(0, 0, 0, 0)
            );
        }
        &.next-btn-box {
            right: 0;
            background-image: linear-gradient(
                to left,
                rgba(0, 0, 0, 0.3),
                rgba(0, 0, 0, 0)
            );
        }
    }
}
</style>
