<template>
    <div class="write-article-page">
        <!-- 顶部栏 -->
        <div class="top-bar">
            <div class="btn close-btn" @click="back">
                <span class="iconfont icon-arrow-left" />
                <span class="btn-text">返回</span>
            </div>
            <input
                class="title-input"
                type="text"
                v-model="form.title"
                placeholder="请输入标题（50字符以内）"
                maxLength="50" />
            <div class="btn release-btn" @click="release">
                <span class="iconfont icon-success" />
                <span class="btn-text">发布</span>
            </div>
        </div>
        <!-- 编辑器 -->
        <div class="editor-container">
            <v-md-editor
                v-model="form.text"
                height="100%"
                :toc-nav-position-right="true"
                :toolbar="toolbar"
                :left-toolbar="leftToolbarOpt"
                :right-toolbar="rightToolbarOpt" />
            <transition name="fade">
                <div v-if="filesShow" class="files-view-box">
                    <div class="wrapper">
                        <div
                            v-for="files in filesData"
                            :key="files"
                            class="files-item">
                            <!-- <template v-if="files.content.length > 0"> -->
                            <div class="title-box">
                                <span>{{ files.title }}</span>
                            </div>
                            <div class="content">
                                <fileList
                                    :id="files.id"
                                    :data="files.content"
                                    :group="files.type"
                                    @start="
                                        dragOptions.group = files.type;
                                        trashShow = true;
                                    "
                                    @end="
                                        dragOptions.group = '';
                                        trashShow = false;
                                    "
                                    @change="fileListChange" />
                            </div>
                            <!-- </template> -->
                        </div>
                        <div v-if="filesData.length === 0" class="empty-box">
                            <empty-info
                                tip="暂时没有文件哦"
                                :btn="{
                                    use: true,
                                    text: '上传文件',
                                    callback: onUpload,
                                }" />
                        </div>
                        <div class="close-btn">
                            <z-button
                                class="btn"
                                circle
                                @click="filesShow = !filesShow">
                                <span class="iconfont icon-error" />
                            </z-button>
                        </div>
                        <transition name="fade">
                            <div v-if="trashShow" class="trash">
                                <div class="background" />
                                <span class="iconfont icon-error" />
                                <draggable
                                    class="draggable-list"
                                    v-bind="dragOptions"
                                    v-model="trashData"
                                    item-key="id">
                                    <template #item="{ element }">
                                        <span style="display: none">{{
                                            element
                                        }}</span>
                                    </template>
                                </draggable>
                            </div>
                        </transition>
                    </div>
                </div>
            </transition>
        </div>
        <!-- 底部栏 -->
        <div class="bottom-box">
            <div class="bottom-bar">
                <div class="files-info" @click="filesShow = !filesShow">
                    <span v-if="!isUploading && filesNum == 0"
                        >当前没有附件</span
                    >
                    <span v-if="isUploading"
                        ><span
                            class="iconfont icon-loading" />正在上传中...</span
                    >
                    <span v-if="!isUploading && filesNum > 0"
                        >当前已有{{ filesNum }}个附件</span
                    >
                </div>
                <div class="word-num">
                    <span>{{ wordsNum }} 字数</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import draggable from 'vuedraggable';
import fileList from '@/components/file-list/index.vue';
import uuid from '@/utils/uuid.js';
import compress from '@/utils/compress.js';
import { pre, upload, add } from '@/api/file.js';
import { addArticle, getArticleDetail, modArticle } from '@/api/article.js';

export default {
    components: {
        fileList,
        draggable,
    },
    props: {
        id: {
            type: [Number, String],
            require: false,
            default() {
                return 0;
            },
        },
    },
    data() {
        const that = this;
        this.toolbar = {
            imageLink: {
                title: '插入图片',
                icon: 'v-md-icon-img',
                action(editor) {
                    editor.insert(function (selected) {
                        const prefix = '![Description](';
                        const suffix = '){{{width="auto" height="auto"}}}\n';
                        const placeholder = 'https://';
                        const content = selected || placeholder;
                        return {
                            text: `${prefix}${content}${suffix}`,
                            selected: content,
                        };
                    });
                },
            },
            imageUpload: {
                title: '上传附件',
                icon: 'iconfont icon-editor-upload',
                action(editor) {
                    that.onUpload(editor);
                },
            },
        };
        return {
            // md-editor 工具栏
            leftToolbarOpt:
                'undo redo | h bold italic strikethrough quote | ul ol table hr code | link imageLink imageUpload',
            rightToolbarOpt: 'preview toc',
            // 发表文章表单
            form: {
                // 文章标题
                title: '',
                // 文章内容
                text: '',
                // 资源
                resource: [],
                // 封图
                cover: null,
                // 摘要
                summary: '',
                // 标签
                tags: [],
            },
            // 展示文件管理
            filesShow: false,
            // 文件类型
            fileTypes: [
                {
                    id: 0,
                    name: '图片',
                    type: 'image',
                },
                {
                    id: 1,
                    name: '视频',
                    type: 'video',
                },
                {
                    id: 2,
                    name: '音频',
                    type: 'audio',
                },
            ],
            // 文件数据
            filesData: [],
            // 文件上传中
            isUploading: false,
            // 展示垃圾桶
            trashShow: false,
            // 垃圾桶的拖拽设置
            dragOptions: {
                animation: 200,
                group: '',
                disabled: false,
                ghostClass: 'ghost',
            },
            // 垃圾桶数据
            trashData: [],
        };
    },
    computed: {
        /**
         * 字数
         */
        wordsNum() {
            return this.form.text.length;
        },
        /**
         * 排序后的filesData
         */
        sortFilesData() {
            const fs = this.filesData;
            return fs.sort((a, b) => {
                const x = a['id'];
                const y = b['id'];
                return x < y ? -1 : x > y ? 1 : 0;
            });
        },
        /**
         * 文件数量
         */
        filesNum() {
            let res = 0;
            for (let i = 0; i < this.filesData.length; i++) {
                const files = this.filesData[i];
                res += files.content.length;
            }
            return res;
        },
    },
    watch: {
        /**
         * 文件数据，如果当前类别文件为空则清除该类别
         */
        filesData: {
            handler(val) {
                const that = this;
                for (const key in val) {
                    if (Object.hasOwnProperty.call(val, key)) {
                        const files = val[key];
                        if (files.content.length === 0) {
                            setTimeout(() => {
                                that.filesData.splice(key, 1);
                            }, 300);
                        }
                    }
                }
                // TODO将id提取出来
                const resources = [];
                for (let i = 0; i < this.filesData.length; i++) {
                    const files = this.filesData[i];
                    for (let j = 0; j < files.content.length; j++) {
                        const file = files.content[j];
                        if (file.status == 1) resources.push(file.id);
                    }
                }
                this.form.resources = resources;
            },
            deep: true,
        },
    },
    beforeCreate() {
        this.$store.commit('nav/setShow', false);
    },
    created() {
        if (this.id === 0) return;
        getArticleDetail(this.id).then(res => {
            this.form.title = res.title;
            this.form.text = res.content;
            this.form.resource = res.files;
            this.form.cover = res.cover;
            this.form.summary = res.summary;
            this.form.tags = res.tags;
        });
    },
    beforeUnmount() {
        this.$store.commit('nav/setShow', true);
    },
    methods: {
        /**
         * 返回上一页
         */
        back() {
            this.$router.go(-1);
        },
        /**
         * 发布
         */
        release() {
            const that = this;
            if (!this.form.title || this.form.title.length == 0) {
                this.$msg('error', '标题不可为空');
                return;
            }
            if (!this.form.text || this.form.text.length == 0) {
                this.$msg('error', '内容不可为空');
                return;
            }
            this.$PL.show(this, {
                name: 'article-confirm',
                data: {
                    edit: this.id === 0 ? false : true,
                    title: that.form.title,
                    cover: that.form.cover,
                    summary: that.form.summary,
                    tags: that.form.tags,
                    func: async function ({ cover, summary, tags }) {
                        const params = {
                            title: that.form.title,
                            content: that.form.text,
                            summary: summary,
                            wordsNum: that.wordsNum,
                            resources: that.form.resources,
                            cover: cover,
                            tags: tags,
                        };
                        if (that.id === 0) {
                            await addArticle(params)
                                .then(() => {
                                    return Promise.resolve();
                                })
                                .catch(err => {
                                    return Promise.reject(err);
                                });
                        } else {
                            params.id = that.id;
                            await modArticle(params)
                                .then(() => {
                                    return Promise.resolve();
                                })
                                .catch(err => {
                                    return Promise.reject(err);
                                });
                        }
                    },
                },
            });
        },
        /**
         * 上传文件
         */
        onUpload() {
            const that = this;
            const input = document.createElement('input');
            input.setAttribute('type', 'file');
            input.setAttribute('multiple', 'multiple');
            input.addEventListener('change', function (e) {
                // const callback = function(params) {
                //     editor.insert(function () {
                //         const prefix = '\n![' + params.desc + '](';
                //         const suffix = '){{{width="'+params.width+'" height="'+params.height+'"}}}\n';
                //         return {
                //             text: `${prefix}${params.url+'?x-oss-process=image/resize,l_1024'}${suffix}`
                //         };
                //     });
                // };
                const files = e.target.files;
                if (files.length == 0) return;
                if (files.length > 6) {
                    that.$msg('error', '不能大于6张图片');
                    files.splice(0, 6);
                }
                for (let i = 0; i < files.length; i++) {
                    that.uploadFile(files[i]);
                }
            });
            input.click();
        },
        /**
         * 文件列表变化
         */
        fileListChange({ id, content }) {
            const files = this.getByKey(this.filesData, 'id', id);
            files.content = content;
        },
        /**
         * 查询数组中匹配键值对的对象
         */
        getByKey(arr, key, val) {
            for (const item of arr) {
                if (
                    Object.prototype.hasOwnProperty.call(item, key) &&
                    item[key] == val
                ) {
                    return item;
                }
            }
            return null;
        },
        /**
         * 上传结束方法
         */
        uploadEnd(files, id, status) {
            this.getByKey(files.content, 'id', id).progress = 1;
            this.getByKey(files.content, 'id', id).status = status;
            if (status < 0) this.$msg('error', '上传失败');
            this.isUploading = false;
        },
        /**
         * 文件上传
         */
        uploadFile(file) {
            const that = this;
            // 生成唯一id
            const fileId = uuid();
            const fileType = file.type.slice(0, file.type.indexOf('/'));
            const filesItem = {
                id: fileId,
                name: file.name,
                size: file.size,
                path: '',
                progress: 0,
                status: 0, // 0: 上传中 1: 上传成功 -1: 上传失败
            };
            const typeObj = that.getByKey(that.fileTypes, 'type', fileType);
            let files;
            if (typeObj) {
                files = that.getByKey(that.filesData, 'type', fileType);
                if (files) {
                    // 插入到filesData
                    files.content.push(filesItem);
                } else {
                    that.filesData.push({
                        id: typeObj.id,
                        title: typeObj.name,
                        type: typeObj.type,
                        content: [filesItem],
                    });
                    files = that.getByKey(that.filesData, 'type', fileType);
                }
                if (fileType == 'image') {
                    compress(file, 96).then(res => {
                        that.getByKey(files.content, 'id', fileId).path = res;
                    });
                }
            } else {
                files = that.getByKey(that.filesData, 'type', 'other');
                if (files) {
                    // 插入到filesData
                    files.content.push(filesItem);
                } else {
                    that.filesData.push({
                        id: 999,
                        title: '其他',
                        type: 'other',
                        content: [filesItem],
                    });
                    files = that.getByKey(that.filesData, 'type', 'other');
                }
            }
            this.isUploading = true;
            // *****************以下为请求部分*****************
            // 进行上传预请求，获取policy和签名
            pre()
                .then(res => {
                    // 新文件名
                    const fileName =
                        fileId +
                        file.name.substring(
                            file.name.lastIndexOf('.'),
                            file.name.length
                        );
                    // 新文件路径
                    const filePath =
                        that.$settings.oss_root +
                        file.type.substring(0, file.type.indexOf('/') + 1) +
                        fileName;
                    // oss直传参数
                    const params = {
                        policy: res.policy,
                        signature: res.signature,
                        id: fileId,
                        name: fileName,
                        path: filePath,
                        file: file,
                    };
                    // oss直传上传进度函数
                    // const callback = async function (e) {
                    //     if (e.lengthComputable) {
                    //         const f = that.getByKey(files.content, 'id', e.id);
                    //         if (f) f.progress = e.loaded / e.total;
                    //     }
                    // };
                    const callback = async function (e) {
                        const f = that.getByKey(files.content, 'id', fileId);
                        if (f) f.progress = e.loaded / e.total;
                    };
                    Promise.all([
                        // oss直传
                        upload(params, callback),
                        // 服务器数据库新增数据
                        add({
                            name: file.name,
                            path: filePath,
                            type: file.type,
                            size: file.size,
                        }),
                    ])
                        .then(r => {
                            that.uploadEnd(files, fileId, 1);
                            // 换成oss缩略图
                            that.getByKey(files.content, 'id', fileId).path =
                                filePath;
                            // 换成数据库中的id
                            that.getByKey(files.content, 'id', fileId).id =
                                r[1];
                            // 编辑器中插入图片
                            // insertImage({
                            //     url: that.$settings.downloadUrl +filePath,
                            //     desc: file.name,
                            //     width: 'auto',
                            //     height: 'auto',
                            // });
                        })
                        .catch(() => {
                            that.uploadEnd(files, fileId, -1);
                        });
                })
                .catch(() => {
                    that.uploadEnd(files, fileId, -1);
                });
        },
    },
};
</script>

<style lang="scss" scoped>
.write-article-page {
    position: fixed;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    width: 100%;
    height: 100%;
}

// 顶部操作栏
.top-bar {
    display: flex;
    flex-direction: row;
    align-items: center;
    width: 100%;
    height: 50px;
    border-bottom: 1px solid #ddd;
    .btn {
        display: flex;
        align-items: center;
        height: 100%;
        padding: 0 15px;
        cursor: pointer;
        transition: 0.1s;
        .iconfont {
            display: block;
            margin: 0 10px;
            font-size: 24px;
        }
        .btn-text {
            display: block;
            font-size: 18px;
            margin-right: 10px;
        }
        &.release-btn {
            &:hover {
                background-color: $highlight;
                color: $white;
            }
        }
    }
    .title-input {
        display: block;
        flex-grow: 2;
        box-sizing: border-box;
        height: 100%;
        border-radius: 8px;
        outline: none;
        border: none;
        font-size: 18px;
        background-color: transparent;
    }
}

// v-md-editor
.editor-container {
    position: relative;
    height: calc(100% - 50px - 32px);
    :deep(.v-md-editor) {
        box-shadow: none;
        // 工具栏
        .v-md-editor__toolbar {
            padding: 6px 25px;
            .v-md-editor__toolbar-item {
                margin-right: 5px;
                &:not(:first-child) {
                    margin: 0;
                }
            }
        }
        .v-md-editor__editor-wrapper {
            cursor: auto;
            .scrollbar__view {
                height: 100%;
                .v-md-textarea-editor {
                    // max-width: $con_width;
                    // margin: 0 auto;
                    // min-height: 100%;
                    pre {
                        height: 100%;
                    }
                    textarea {
                        height: 100%;
                    }
                }
            }
        }
        .vuepress-markdown-body {
            max-width: $con_width;
            margin: 0 auto;
        }
        // 代码框
        .v-md-pre-wrapper {
            // 滚动条（任意写一个样式即可修改其他伪元素样式）
            &::-webkit-scrollbar,
            &::-webkit-scrollbar-track {
                background-color: transparent;
            }
            // 滚动条滑块
            &::-webkit-scrollbar-thumb {
                border-radius: 4px;
                background-color: #bbb;
            }
        }
    }
    .files-view-box {
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        background-color: $back;
        overflow-y: auto;
        z-index: 2;
        .wrapper {
            position: relative;
            width: 640px;
            min-height: 100%;
            margin: 0 auto;
            .files-item {
                margin-bottom: 100px;
                &:first-child {
                    margin-top: 30px;
                }
                .title-box {
                    font-size: 32px;
                    font-weight: bold;
                    margin-bottom: 20px;
                    color: $text1;
                }
            }
            .empty-box {
                position: absolute;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                font-size: 18px;
                color: rgba(0, 0, 0, 0.6);
                .tip {
                    margin-bottom: 50px;
                }
                .upload-btn {
                    display: flex;
                    .iconfont {
                        margin-right: 5px;
                    }
                    .text {
                        font-size: 15px;
                    }
                }
            }
            .close-btn {
                position: fixed;
                display: flex;
                left: 0;
                bottom: 100px;
                width: 100%;
                justify-content: center;
                .btn {
                    width: 48px;
                    height: 48px;
                    border-radius: 24px;
                    // box-shadow: 0 6px 18px rgba(0, 0, 0, 0.05);
                }
            }
            .trash {
                position: fixed;
                display: flex;
                justify-content: flex-end;
                align-items: flex-end;
                width: 100px;
                height: 100px;
                right: 0;
                bottom: 32px;
                .background {
                    position: absolute;
                    border-bottom: 100px solid $danger;
                    border-left: 100px solid transparent;
                    z-index: -1;
                }
                .iconfont {
                    position: absolute;
                    font-size: 32px;
                    color: #fff;
                    z-index: -1;
                    margin: 14px;
                }
                .draggable-list {
                    width: 100%;
                    height: 100%;
                    opacity: 0;
                }
            }
        }
    }
}

// 底部操作栏
.bottom-bar {
    box-sizing: border-box;
    position: fixed;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    height: 32px;
    padding: 0 25px;
    border-top: 1px solid #ddd;
    bottom: 0;
    z-index: 10;
    .files-info {
        display: flex;
        align-items: center;
        height: 100%;
        font-size: 13px;
        cursor: pointer;
        & > span {
            display: flex;
            flex-direction: row;
            align-items: center;
            user-select: none;
        }
        .iconfont.icon-loading {
            animation: spin 1s linear infinite;
            backface-visibility: hidden;
        }
    }
    .word-num {
        font-size: 13px;
    }
}

@keyframes spin {
    0% {
        transform: rotate(0deg) translateZ(0);
    }
    100% {
        transform: rotate(-360deg) translateZ(0);
    }
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>
