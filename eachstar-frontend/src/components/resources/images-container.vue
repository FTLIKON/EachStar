<template>
    <div class="images-container-component">
        <div :class="['inner', 'columns-' + columns]">
            <div
                v-for="(image, index) in images"
                :key="image.id"
                class="image-box">
                <async-img
                    class="image"
                    :url="image.path"
                    :suffix="'?x-oss-process=image/resize,s_' + size"
                    @click="previewImage(index)" />
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        images: {
            type: Array,
            default() {
                return [];
            },
            required: false,
        },
    },
    data() {
        return {
            columns: 0,
        };
    },
    computed: {
        size() {
            if (this.columns > 1) {
                return 248 - 40 * this.columns;
            } else {
                return 800;
            }
        },
    },
    created() {
        const size = this.images.length;
        switch (size) {
            case 0:
            case 1:
                this.columns = 1;
                break;

            case 2:
                this.columns = 2;
                break;

            case 4:
                this.columns = 2;
                break;

            default:
                this.columns = 3;
                break;
        }
    },
    methods: {
        /**
         * 预览图片
         */
        previewImage(index) {
            this.$PL.show(this, {
                name: 'img-preview',
                data: {
                    images: this.images,
                    index: index,
                },
            });
        },
    },
};
</script>

<style lang="scss" scoped>
.images-container-component {
    overflow: hidden;
}

.inner {
    display: grid;
    grid-row-gap: 10px;
    grid-column-gap: 10px;
    &.columns-1 {
        .image-box {
            aspect-ratio: unset;
            width: fit-content;
            height: fit-content;
            max-width: 100%;
            max-height: 50vh;
        }
    }
    &.columns-2 {
        grid-template-columns: repeat(2, 168px);
        .image-box {
            width: 168px;
        }
    }
    &.columns-3 {
        grid-template-columns: repeat(3, 128px);
        .image-box {
            width: 128px;
        }
    }
}

.image-box {
    display: flex;
    aspect-ratio: 1;
    margin-right: 5px;
    border-radius: 8px;
    overflow: hidden;
    .image {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: 0.1s;
        &:hover {
            cursor: pointer;
            filter: brightness(0.9);
        }
    }
}
</style>
