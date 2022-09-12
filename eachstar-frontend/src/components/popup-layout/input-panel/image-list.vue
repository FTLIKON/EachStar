<template>
    <draggable
        class="item-list"
        v-bind="dragOptions"
        v-model="items"
        @change="$emit('change', items)"
        item-key="id"
        handle=".control">
        <template #item="{ element }">
            <div
                class="image-item"
                :class="{ control: element.status === 1 }"
                @click="previewImage(element)">
                <async-img
                    class="image"
                    :url="element.path"
                    suffix="?x-oss-process=image/resize,s_96" />
                <span class="name">{{ element.name }}</span>
                <template v-if="element.status === 1">
                    <div class="remove-btn" @click.stop="removeImage(element)">
                        <span class="iconfont icon-close-fill" />
                    </div>
                </template>
                <div
                    class="progress-bar"
                    :class="statusText[element.status + 1]">
                    <div
                        class="bar"
                        :style="{
                            width: element.progress * 100 + '%',
                        }" />
                </div>
            </div>
        </template>
    </draggable>
</template>

<script>
import draggable from 'vuedraggable';
import { beautifySize } from '@/utils/formatSize';

export default {
    components: {
        draggable,
    },
    props: {
        data: {
            type: Array,
            required: true,
        },
    },
    data() {
        return {
            dragOptions: {
                animation: 200,
                group: 'image',
                disabled: false,
                ghostClass: 'ghost',
            },
            statusText: ['fail', 'uploading', 'success'],
            items: this.data,
        };
    },
    watch: {
        data: {
            handler(val) {
                this.items = val;
            },
            deep: true,
        },
    },
    emits: ['start', 'end', 'change'],
    methods: {
        /**
         * 格式化size
         */
        formatSize(size) {
            return beautifySize(size);
        },
        /**
         * 点击缩略图
         */
        previewImage(element) {
            let images = [],
                index = 0;
            for (let i = 0; i < this.items.length; i++) {
                const item = this.items[i];
                images.push({
                    id: item.id,
                    path: item.path,
                });
                if (element.id == item.id) {
                    if (element.status !== 1) return;
                    index = i;
                }
            }
            this.$PL.show(this, {
                name: 'img-preview',
                data: {
                    images: images,
                    index: index,
                },
            });
        },
        /**
         * 移除图片
         */
        removeImage(element) {
            for (let i = 0; i < this.items.length; i++) {
                const item = this.items[i];
                if (element.id == item.id) this.items.splice(i, 1);
            }
        },
    },
};
</script>

<style lang="scss" scoped>
.item-list {
    display: flex;
    background-color: white;
    border-radius: 8px;
    padding: 20px;
    margin-bottom: 10px;
    overflow: hidden;
    .image-item {
        position: relative;
        display: flex;
        width: 96px;
        height: 96px;
        align-items: center;
        overflow: hidden;
        transition: filter 0.1s;
        &:hover {
            cursor: pointer;
            .image {
                filter: brightness(0.9);
            }
            .remove-btn {
                opacity: 1;
                pointer-events: auto;
            }
        }
        & + .image-item {
            margin-left: 5px;
        }
        .image {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
        .name {
            position: absolute;
            bottom: 0;
            width: 100%;
            height: 18px;
            font-size: 12px;
            text-indent: 0.1em;
            background-color: rgba(0, 0, 0, 0.3);
            color: $white;
            overflow: hidden;
            text-overflow: ellipsis;
            -webkit-line-clamp: 1;
            -webkit-box-orient: vertical;
        }
        .remove-btn {
            position: absolute;
            display: flex;
            align-items: center;
            justify-content: center;
            top: 0;
            right: 0;
            width: 32px;
            height: 32px;
            transition: 0.2s;
            opacity: 0;
            pointer-events: none;
            &:hover {
                .iconfont {
                    color: $highlight;
                }
            }
            .iconfont {
                font-size: 24px;
                color: $white;
                text-shadow: 0 0 6px rgba(0, 0, 0, 0.05);
                transition: 0.1s;
            }
        }
        .progress-bar {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 4px;
            &.fail {
                .bar {
                    background-color: $danger;
                }
            }
            &.uploading {
                .bar {
                    background-color: $highlight;
                }
            }
            &.fail {
                .bar {
                    display: none;
                }
            }
            .bar {
                height: 4px;
            }
        }
    }
}
</style>
