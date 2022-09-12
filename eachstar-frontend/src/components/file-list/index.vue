<template>
    <draggable
        class="draggable-list"
        v-bind="dragOptions"
        v-model="items"
        @start="$emit('start')"
        @end="$emit('end')"
        @change="$emit('change', { id: id, content: items })"
        item-key="id"
        handle=".control">
        <template #item="{ element }">
            <div class="item-outter">
                <div class="progress" :class="statusText[element.status + 1]">
                    <div
                        class="bar"
                        :style="{
                            width: element.progress * 100 + '%',
                        }" />
                </div>
                <div class="file-item" @click="onClickItem(element)">
                    <div
                        class="icon"
                        :style="{
                            cursor: group == 'image' ? 'zoom-in' : '',
                        }"
                        @click.stop="onClickIcon(element)">
                        <template v-if="group == 'image'">
                            <async-img
                                :url="element.path"
                                suffix="?x-oss-process=image/resize,s_48" />
                        </template>
                        <template v-else>
                            <span :class="['iconfont', 'icon-file-' + group]" />
                        </template>
                    </div>
                    <div class="info">
                        <span class="name">{{ element.name }}</span>
                        <span class="size">{{ formatSize(element.size) }}</span>
                    </div>
                    <div class="control">
                        <span class="iconfont icon-bars" />
                    </div>
                </div>
            </div>
        </template>
    </draggable>
</template>

<script>
import draggable from 'vuedraggable';
import { beautifySize } from '@/utils/formatSize';

export default {
    props: {
        id: {
            type: Number,
            required: true,
        },
        data: {
            type: Array,
            required: true,
        },
        group: {
            type: String,
            required: true,
        },
    },
    components: {
        draggable,
    },
    data() {
        return {
            statusText: ['fail', 'uploading', 'success'],
            items: this.data,
        };
    },
    computed: {
        dragOptions() {
            return {
                animation: 200,
                group: this.group,
                disabled: false,
                ghostClass: 'ghost',
            };
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
         * 点击文件
         */
        async onClickItem(element) {
            if (this.group !== 'image' || element.status !== 1) return;
            const that = this;
            try {
                await navigator.clipboard.writeText(
                    this.$settings.downloadUrl + element.path
                );
                that.$msg('success', '已复制图片路径');
            } catch (err) {
                that.$msg('success', '图片路径复制失败');
            }
        },
        /**
         * 点击缩略图
         */
        onClickIcon(element) {
            if (this.group !== 'image' || element.status !== 1) return;
            let images = [],
                index = 0;
            for (let i = 0; i < this.items.length; i++) {
                const item = this.items[i];
                images.push({
                    id: item.id,
                    path: item.path,
                });
                if (element.id == item.id) index = i;
            }
            this.$PL.show(this, {
                name: 'img-preview',
                data: {
                    images: images,
                    index: index,
                },
            });
        },
    },
};
</script>

<style lang="scss" scoped>
.draggable-list {
    .item-outter {
        box-sizing: border-box;
        position: relative;
        height: 78px;
        overflow: hidden;
        border-radius: 8px;
        .file-item {
            box-sizing: border-box;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 10px;
            border-radius: 8px;
            background-color: $white;
            // box-shadow: 0 6px 18px rgba(0, 0, 0, 0.05);
            &.active {
                border: solid 2px #000;
            }
            .icon {
                display: flex;
                flex-shrink: 0;
                justify-content: center;
                align-items: center;
                width: 48px;
                height: 48px;
                border-radius: 6px;
                margin-right: 10px;
                overflow: hidden;
                img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }
                .iconfont {
                    font-size: 32px;
                }
            }
            .info {
                display: flex;
                flex-direction: column;
                flex-grow: 1;
                overflow: hidden;
                .name {
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
                .size {
                    font-size: 14px;
                    color: $text3;
                }
            }
            .control {
                display: flex;
                flex-shrink: 0;
                align-items: center;
                justify-content: center;
                width: 48px;
                height: 48px;
                color: $text3;
                cursor: grab;
                user-select: none;
                span {
                    font-size: 24px;
                }
            }
        }
        .progress {
            position: absolute;
            width: 100%;
            height: 2px;
            top: 0;
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
            &.success {
                display: none;
            }
            .bar {
                height: 100%;
                transition: 0.2s;
            }
        }
    }
}
</style>
