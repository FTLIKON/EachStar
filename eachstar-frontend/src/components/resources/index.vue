<template>
    <div class="resources-component">
        <div v-for="(fileData, index) in filesData" :key="index">
            <div v-if="fileData.type == 'image'" class="images-box">
                <images-container :images="fileData.content" />
            </div>
        </div>
    </div>
</template>

<script>
import imagesContainer from './images-container';

export default {
    components: {
        imagesContainer,
    },
    props: {
        files: {
            type: Array,
            required: false,
            default() {
                return [];
            },
        },
    },
    data() {
        return {
            filesData: [],
        };
    },
    watch: {
        files: {
            handler() {
                this.init();
            },
            immediate: true,
            deep: true,
        },
    },
    methods: {
        /**
         * 初始化
         */
        init() {
            const files = this.files;
            const filesData = this.filesData;
            // 遍历内部资源列表
            function ergodic(outter, inners) {
                for (let j = 0; j < inners.length; j++) {
                    const inner = inners[j];
                    // 如果内部资源中和外部资源有相同的类型
                    if (
                        inner.type ==
                        outter.type.slice(0, outter.type.indexOf('/'))
                    ) {
                        // 向内部资源中添加外部资源
                        inner.content.push(outter);
                        return true;
                    }
                }
                return false;
            }
            // 遍历外部资源列表
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                // 遍历内部资源列表
                if (!ergodic(file, this.filesData)) {
                    // 如果内部资源中没有和外部资源相同的类型，创建新的内部资源
                    const fileData = {
                        type: file.type.slice(0, file.type.indexOf('/')),
                        content: [],
                    };
                    fileData.content.push(file);
                    // 将新的内部资源加入到内部资源列表
                    filesData.push(fileData);
                }
            }
        },
    },
};
</script>

<style lang="scss" scoped></style>
