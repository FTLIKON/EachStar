<template>
    <div class="input-panel-box">
        <!-- 文本域 -->
        <div class="text-box" @click="focus">
            <div
                id="textarea"
                class="textarea"
                :placeholder="data.placeholder"
                :value="value"
                spellcheck="false"
                @keyup="updateValue($event)"
                @blur="getblur"
                @dragstart="$event.preventDefault()"
                @dragover="$event.preventDefault()" />
        </div>
        <!-- 图片展示 -->
        <transition name="dropdown">
            <div class="images-box-outter" v-if="images.length > 0">
                <image-list :data="images" @change="imagesChange" />
            </div>
        </transition>
        <!-- 底部操作栏 -->
        <div class="bottom-bar">
            <div class="tool-box">
                <!-- 弹出表情下拉框按钮 -->
                <z-button class="btn expression-btn" @click="onExpressTrigger">
                    <span class="iconfont icon-grin" />
                </z-button>
                <!-- 上传图片按钮 -->
                <z-button
                    v-if="data.upload"
                    class="btn image-btn"
                    @click="onUpload">
                    <span class="iconfont icon-image" />
                </z-button>
            </div>
            <!-- 发表动态按钮 -->
            <z-button
                class="btn send-btn"
                :loading="isLoading"
                @click="release">
                发表
            </z-button>
        </div>
        <!-- 表情下拉框 -->
        <transition name="dropdown">
            <div v-if="expressTrigger" class="express-box">
                <div
                    v-for="(item, index) in express_sets"
                    :key="index"
                    class="express-item">
                    <img
                        class="express"
                        :src="require(`/src/${root_path + item}.png`)"
                        @click="addExpress(index)" />
                    <div class="preview-box">
                        <img
                            class="express"
                            :src="require(`/src/${root_path + item}.png`)"
                            @click="addExpress(index)" />
                    </div>
                </div>
            </div>
        </transition>
        <!-- 上传文件用input（不可见） -->
        <input
            style="display: none"
            ref="input"
            type="file"
            accept="image/gif, image/jpeg, image/jpg, image/png"
            multiple="multiple"
            @change="handleChange" />
    </div>
</template>

<script>
import { pre, upload, add } from '@/api/file.js';
import uuid from '@/utils/uuid.js';
import compress from '@/utils/compress.js';
import imageList from './image-list';

// 光标相关变量
let sel, range;
// 表情根目录
const root_path = 'assets/images/express/';
// 表情集合
const express_sets = [
    '爱你',
    '心眼',
    '闭嘴',
    '便便',
    '大笑',
    '点赞',
    '恶魔',
    '饿死',
    '发呆',
    '犯困',
    '奋斗',
    '愤怒',
    '尴尬',
    '感冒',
    '哼',
    '坏笑',
    '开心',
    '瞌睡',
    '骷髅',
    '酷',
    '冷',
    '冷酷',
    '鼻血',
    '流汗',
    '流泪',
    '骂人',
    '懵逼',
    '呕吐',
    '三条线',
    '什么',
    '生气',
    '衰',
    '睡着',
    '无聊',
    '献吻',
    '笑出泪',
    '笑掉大牙',
    '笑脸',
    '斜眼',
    '心碎',
    '爱心',
    '星星眼',
    '凶',
    '疑问',
    '幽灵',
    '晕',
    '炸弹',
    '猪头',
];

export default {
    components: {
        imageList,
    },
    props: {
        data: {
            type: Object,
            required: true,
        },
    },
    data() {
        return {
            value: '',
            images: [],
            expressTrigger: false,
            marginTop: 0,
            isLoading: false,
        };
    },
    created() {
        this.root_path = root_path;
        this.express_sets = express_sets;
    },
    activated() {
        this.$nextTick(() => {
            document.querySelector('#textarea').focus();
        });
    },
    emits: ['close'],
    methods: {
        /**
         * 更新值
         */
        updateValue() {
            this.value = document.querySelector('#textarea').innerHTML;
        },
        /**
         * 获取焦点并插入内容
         */
        insertHtmlAtCaret(html) {
            if (window.getSelection) {
                // IE9 and non-IE
                if (sel.getRangeAt && sel.rangeCount) {
                    var el = document.createElement('div');
                    el.innerHTML = html;
                    var frag = document.createDocumentFragment(),
                        node,
                        lastNode;
                    while ((node = el.firstChild)) {
                        lastNode = frag.appendChild(node);
                    }
                    range.deleteContents();
                    range.insertNode(frag);
                    // Preserve the selection
                    if (lastNode) {
                        range = range.cloneRange();
                        range.setStartAfter(lastNode);
                        range.collapse(true);
                        sel.removeAllRanges();
                        sel.addRange(range);
                    }
                }
            } else if (document.selection?.type != 'Control') {
                // IE < 9
                document.selection.createRange().pasteHTML(html);
            }
            this.updateValue();
        },
        /**
         * 添加表情
         */
        addExpress(id) {
            this.insertHtmlAtCaret(
                `<img src=${require('/src/' +
                    root_path +
                    express_sets[id] +
                    '.png')}
                        alt='[${'#icon-' + express_sets[id]}]'
                        style='display: inline-block; width: 24px; padding: 0 2px; vertical-align: sub; -webkit-user-modify: read-write-plaintext-only;'>`
            );
        },
        /**
         * 失去焦点时获取光标的位置
         */
        getblur() {
            sel = window.getSelection();
            range = sel.focusNode ? sel.getRangeAt(0) : null;
        },
        /**
         * 点击表情列表按钮
         */
        onExpressTrigger() {
            this.expressTrigger = !this.expressTrigger;
        },
        /**
         * 点击上传文件按钮
         */
        onUpload() {
            this.$refs.input.value = '';
            this.$refs.input.click();
        },
        /**
         * 处理选择的文件
         */
        handleChange({ target: { files } }) {
            if (files.length == 0) return;
            if (files.length > 6) {
                this.$msg('error', '不能大于6张图片');
                files.splice(0, 6);
            }
            for (let i = 0; i < files.length; i++) {
                this.uploadFile(files[i]);
            }
        },
        /**
         * 上传文件
         */
        uploadFile(file) {
            const that = this;
            // 获取目标id的图片
            const getFile = function (fileId) {
                for (let i = 0; i < that.images.length; i++) {
                    if (that.images[i].id == fileId) return that.images[i];
                }
            };
            // 上传结束方法
            const uploadEnd = function (id, status) {
                getFile(id).progress = 1;
                getFile(id).status = status;
                if (status < 0) that.$msg('error', '上传失败');
            };
            // 生成唯一id
            const fileId = uuid();
            const filesItem = {
                id: fileId,
                name: file.name,
                size: file.size,
                path: '',
                progress: 0,
                status: 0, // 0: 上传中 1: 上传成功 -1: 上传失败
            };
            compress(file, 96).then(res => {
                filesItem.path = res;
            });
            this.images.push(filesItem);
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
                    const callback = async function (e) {
                        // const callback = async e => {
                        // if (e.lengthComputable) {
                        //     const f = getFile(e.id);
                        //     if (f) f.progress = e.loaded / e.total;
                        // }
                        const f = getFile(fileId);
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
                            uploadEnd(fileId, 1);
                            // 换成oss缩略图
                            getFile(fileId).path = filePath;
                            // 换成数据库中的id
                            getFile(fileId).id = r[1];
                        })
                        .catch(() => {
                            uploadEnd(fileId, -1);
                        });
                })
                .catch(() => {
                    uploadEnd(fileId, -1);
                });
        },
        /**
         * images同步改变
         */
        imagesChange(items) {
            this.images = items;
        },
        /**
         * 停止loading
         */
        stopLoading() {
            this.isLoading = false;
        },
        /**
         * 发表动态
         */
        release() {
            if (this.isLoading) return;
            this.isLoading = true;
            // 判断动态内容是否为空
            const content = this.value.replace(/<[^>]+>/g, item => {
                return item.match(/alt=['"]?([^'"]*)['"]?/i)[1];
            });
            if (content == '') {
                this.isLoading = false;
                this.$msg('error', '内容不可为空！');
                return;
            }
            const ids = [];
            for (let i = 0; i < this.images.length; i++) {
                const element = this.images[i];
                if (element.status != 1) {
                    this.$msg('error', '图片未全部上传成功！');
                    this.isLoading = false;
                    return;
                }
                ids.push(element.id);
            }
            const params = {
                text: content,
                ids: ids,
            };
            this.data
                .func(params)
                .then(() => {
                    this.isLoading = false;
                    this.$emit('close');
                    this.$msg('success', '发表成功');
                })
                .catch(err => {
                    this.isLoading = false;
                    this.$msg('error', err);
                });
        },
    },
};
</script>

<style lang="scss" scoped>
.input-panel-box {
    position: fixed;
    width: $con_width;
    height: fit-content;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 200;
}

.text-box {
    box-sizing: border-box;
    width: 100%;
    padding: 20px;
    border-radius: 8px;
    margin-bottom: 10px;
    background-color: $white;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.05);
    .textarea {
        line-height: 1.5em;
        outline: none;
        word-wrap: break-word;
        word-break: break-word;
        white-space: pre-wrap;
        background-color: transparent;
        vertical-align: baseline;
        -webkit-user-modify: read-write-plaintext-only;
        &:empty::before {
            content: attr(placeholder);
            color: $text3;
            pointer-events: none;
        }
    }
}

.bottom-bar {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    width: 100%;
    margin-bottom: 10px;
    .tool-box {
        display: flex;
        flex-direction: row;
        .expression-btn {
            margin-right: 10px;
        }
        .iconfont {
            font-size: 20px;
        }
    }
    .send-btn {
        font-weight: bold;
        font-size: 15px;
        color: $highlight;
        &:hover {
            color: $highlight_hover;
        }
    }
    .btn {
        box-shadow: 0 8px 16px rgba(0, 0, 0, 0.05);
    }
}

.express-box {
    position: fixed;
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    box-sizing: border-box;
    width: $con_width;
    height: fit-content;
    padding: 20px;
    border-radius: 8px;
    background-color: $white;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.05);
    .express-item {
        position: relative;
        display: flex;
        align-items: center;
        width: 28px;
        margin: 6px;
        transition: 0.1s;
        & > .express {
            width: 100%;
            cursor: pointer;
            transition: 0.1s;
            &:hover {
                filter: brightness(0.8);
                & + .preview-box {
                    position: absolute;
                    display: flex;
                    top: 40px;
                    left: 0;
                    z-index: 300;
                }
            }
        }
        .preview-box {
            display: none;
            animation: show 0.2s;
            .express {
                width: 96px;
            }
        }
    }
}

@keyframes show {
    0% {
        transform: translateY(-5px);
        opacity: 0;
    }
    100% {
        transform: translateY(0px);
        opacity: 1;
    }
}

.dropdown-enter-active,
.dropdown-leave-active {
    transition: all 0.3s ease;
}
.dropdown-enter-from,
.dropdown-leave-to {
    opacity: 0;
    transform: translateY(-30px);
    &.images-box-outter {
        height: 0;
    }
}
</style>
