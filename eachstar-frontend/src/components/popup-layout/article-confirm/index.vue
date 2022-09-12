<template>
    <div class="article-confirm-box">
        <div class="container">
            <!-- 顶部栏 -->
            <div class="top-bar">
                <div class="title">
                    <span>完善文章</span>
                </div>
            </div>
            <!-- 表单 -->
            <div class="form">
                <div class="list-item">
                    <div class="label">预览</div>
                    <div class="content">
                        <!-- 预览 -->
                        <div class="article-list-component">
                            <div class="banner">
                                <async-img
                                    v-if="
                                        form.cover?.path &&
                                        form.cover.status !== -1
                                    "
                                    class="banner-img"
                                    :url="form.cover.path"
                                    suffix="?x-oss-process=image/resize,s_720" />
                                <div
                                    class="banner-text"
                                    :class="{
                                        'has-bg':
                                            form.cover?.path &&
                                            form.cover.status !== -1,
                                    }">
                                    <user-info
                                        class="user-info-box"
                                        :avatar="false"
                                        :user-info="loggedUser">
                                        <format-date
                                            class="post-date"
                                            :date="'2021-01-01T12:00:00'" />
                                    </user-info>
                                    <span class="title">{{ data.title }}</span>
                                </div>
                            </div>
                            <div class="content-box">
                                <span class="summary"
                                    >{{ this.form.summary }}...</span
                                >
                            </div>
                            <div class="assess-box">
                                <div
                                    class="assess-item"
                                    :class="{ active: false }">
                                    <span
                                        class="iconfont"
                                        :class="
                                            false
                                                ? 'icon-like-fill'
                                                : 'icon-like'
                                        " />
                                    <span>{{ 2333 }}</span>
                                </div>
                                <div class="assess-item">
                                    <span class="iconfont icon-comment" /><span
                                        >{{ 233 }}</span
                                    >
                                </div>
                                <div class="enter-btn">
                                    <span class="link"> 查看详情 </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="list-item">
                    <div class="label">封面</div>
                    <div class="content">
                        <!-- 上传文件用input（不可见） -->
                        <input
                            style="display: none"
                            ref="input"
                            type="file"
                            accept="image/jpeg, image/jpg, image/png"
                            @change="handleChange" />
                        <z-button
                            class="upload-img-btn"
                            ghost
                            :loading="uploadLoading"
                            @click="onUpload">
                            {{ form.cover ? '更换封面' : '选择封图' }}
                        </z-button>
                    </div>
                </div>
                <div class="list-item">
                    <div class="label">摘要</div>
                    <div class="content">
                        <textarea
                            class="summary-textarea"
                            v-model="form.summary"
                            maxlength="150"
                            rows="4"
                            placeholder="这里填写摘要"
                            spellcheck="false" />
                    </div>
                </div>
                <div class="list-item">
                    <div class="label">标签</div>
                    <div class="content">
                        <div
                            v-for="(item, index) in tagList"
                            :key="index"
                            class="tag"
                            :class="{ active: form.tags.indexOf(item.id) > -1 }"
                            @click="selectTag(item.id)">
                            <span>{{ item.name }}</span>
                        </div>
                        <div
                            class="tag add-tag"
                            :class="{ active: editTag }"
                            @click="onEditTag">
                            <template v-if="editTag">
                                <input
                                    class="tag-input"
                                    type="text"
                                    placeholder="新增标签"
                                    maxlength="15"
                                    @keydown.enter="onSubmit" />
                                <span
                                    class="iconfont icon-error"
                                    @click.capture="cleanInput" />
                            </template>
                            <template v-else>
                                <span class="iconfont icon-add" />
                                <span>新增标签</span>
                            </template>
                        </div>
                    </div>
                </div>
            </div>
            <div class="bottom-bar">
                <z-button class="close-btn" ghost round> 取消 </z-button>
                <z-button
                    class="release-btn"
                    type="primary"
                    round
                    :loading="relaseLoading"
                    @click="release">
                    {{ data.edit ? '确认保存' : '确认发布' }}
                </z-button>
            </div>
        </div>
    </div>
</template>

<script>
import userInfo from '@/components/user-info';
import { getTagList, addTag } from '@/api/tag';
import { pre, upload, add } from '@/api/file.js';
import uuid from '@/utils/uuid.js';
import compress from '@/utils/compress.js';

export default {
    components: {
        userInfo,
    },
    props: {
        data: {
            type: Object,
            required: true,
        },
    },
    data() {
        return {
            form: {
                cover: null,
                summary: '',
                tags: [],
            },
            tagList: [],
            uploadLoading: false,
            relaseLoading: false,
            editTag: false,
        };
    },
    computed: {
        loggedUser() {
            return this.$auth.get('user');
        },
    },
    created() {
        this.init();
    },
    activated() {
        const cover = this.data.cover;
        if (cover) {
            cover.progress = 1;
            cover.status = 1;
        }
        const tags = [];
        for (const tag of this.data.tags) {
            tags.push(tag.id);
        }
        this.form = {
            cover: cover,
            summary: this.data.summary,
            tags: tags,
        };
    },
    emits: ['close'],
    methods: {
        /**
         * 初始化
         */
        init() {
            getTagList().then(res => {
                this.tagList = res;
            });
        },
        /**
         * 选择标签
         */
        selectTag(id) {
            const options = this.form.tags;
            if (options.indexOf(id) > -1) {
                options.splice(options.indexOf(id), 1);
            } else {
                options.push(id);
            }
        },
        /**
         * 新增标签
         */
        onEditTag() {
            this.editTag = true;
            this.$nextTick(function () {
                document.querySelector('.tag-input').focus();
            });
        },
        /**
         * 新增标签输入框按键按下回车
         */
        onSubmit({ target: { value } }) {
            addTag(value)
                .then(res => {
                    this.tagList.push({
                        id: res,
                        name: value,
                    });
                    this.editTag = false;
                    this.$msg('success', '添加成功');
                })
                .catch(err => {
                    this.$msg('error', err);
                });
        },
        // 清空新增标签输入框内容
        cleanInput(e) {
            document.querySelector('.tag-input').value = '';
            e.stopPropagation();
            this.editTag = false;
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
            const file = files[0];
            const that = this;
            // 上传结束方法
            const uploadEnd = function (status) {
                if (status) {
                    that.form.cover.status = 1;
                } else {
                    that.form.cover.status = -1;
                    that.$msg('error', '上传失败');
                }
                that.form.cover.progress = 1;
                that.uploadLoading = false;
            };

            if (this.uploadLoading) return;
            this.uploadLoading = true;
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
            compress(file, 720).then(res => {
                that.form.cover.path = res;
            });
            this.form.cover = filesItem;
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
                    Promise.all([
                        // oss直传
                        upload(params),
                        // 服务器数据库新增数据
                        add({
                            name: file.name,
                            path: filePath,
                            type: file.type,
                            size: file.size,
                        }),
                    ])
                        .then(r => {
                            that.form.cover.path = filePath;
                            that.form.cover.id = r[1];
                            uploadEnd(true);
                        })
                        .catch(() => {
                            uploadEnd(false);
                        });
                })
                .catch(() => {
                    uploadEnd(false);
                });
        },
        /**
         * 发表文章
         */
        release() {
            if (this.relaseLoading) return;
            this.relaseLoading = true;
            // 判断标签是否为空
            if (this.uploadLoading) {
                this.$msg('error', '封面正在上传！');
                return;
            }
            // 判断标签是否为空
            if (this.form.tags.length === 0) {
                this.relaseLoading = false;
                this.$msg('error', '标签不可为空！');
                return;
            }
            // 进行文章发表
            const params = {
                tags: this.form.tags,
                summary: this.form.summary,
            };
            if (this.form.cover?.status === 1) {
                params.cover = this.form.cover.id;
            }
            this.data
                .func(params)
                .then(() => {
                    this.relaseLoading = false;
                    this.$msg('success', '发表成功');
                    this.$PL.hide(this);
                    setTimeout(() => {
                        this.$router.push({
                            path: '/article/index',
                        });
                    }, 1000);
                })
                .catch(() => {
                    this.relaseLoading = false;
                    this.$msg('error', '发表失败');
                });
        },
    },
};
</script>

<style lang="scss" scoped>
.article-confirm-box {
    position: fixed;
    width: fit-content;
    height: fit-content;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 200;
    .container {
        background-color: $white;
        border-radius: 8px;
        padding: 30px;
        box-shadow: 0 8px 16px rgba(0, 0, 0, 0.05);
    }
}

// 顶部操作栏
.top-bar {
    flex: 1;
    margin-bottom: 20px;
    .title {
        color: $text1;
        font-size: 36px;
        font-weight: bold;
    }
}

// 表单
.form {
    width: $con_width;
    .list-item {
        .label {
            color: $text2;
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 10px;
        }
        .content {
            margin-bottom: 20px;
            .upload-img-btn {
                width: 100%;
                font-weight: bold;
                font-size: 17px;
            }
            .summary-textarea {
                box-sizing: border-box;
                outline: none;
                resize: none;
                width: 100%;
                padding: 10px;
                border-radius: 8px;
                @include border(solid, 1px, $border);
                font-family: 'Microsoft YaHei', Arial, sans-serif;
                font-size: 15px;
                line-height: 1.2em;
            }
            .tag {
                box-sizing: border-box;
                display: inline-block;
                height: 32px;
                padding: 5px 10px;
                font-size: 14px;
                border-radius: 8px;
                border: 0.5px solid $divider;
                color: $text2;
                transition: 0.1s;
                margin-right: 10px;
                margin-bottom: 10px;
                vertical-align: middle;
                &:hover {
                    cursor: pointer;
                    color: $text1;
                    border: 0.5px solid $text3;
                }
                &.active {
                    color: $highlight;
                    border: 0.5px solid $highlight;
                }
                &:last-child {
                    display: inline-flex;
                    align-items: center;
                }
            }
            .add-tag {
                .tag-input {
                    outline: none;
                    border: none;
                    width: 100px;
                    margin-right: 5px;
                }
                .iconfont {
                    &.icon-error {
                        border-radius: 14px;
                        padding: 2px;
                        &:hover {
                            background-color: rgba(0, 0, 0, 0.05);
                        }
                    }
                    &.icon-add {
                        padding: 2px;
                    }
                }
            }
        }
    }
}

// 预览
.article-list-component {
    position: relative;
    background-color: $white;
    border-radius: 8px;
    border: solid rgba(0, 0, 0, 0.1) 1px;
    overflow: hidden;
    &:hover .enter-btn {
        opacity: 1;
    }
}
.banner {
    position: relative;
    margin-bottom: 10px;
    font-size: 0;
    .banner-img {
        width: 100%;
        height: 108px;
        left: 0;
        top: 0;
        border-radius: 12px 12px 0 0;
        object-fit: cover;
        z-index: 0;
        user-select: none;
    }
    .banner-text {
        &:not(.has-bg) {
            margin: 20px 20px 0;
        }
        &.has-bg {
            position: absolute;
            left: 20px;
            bottom: 10px;
            .user-info-box {
                :deep(.user-name) {
                    font-weight: bold;
                    color: $white;
                    @include stroke(#000);
                }
                .post-date {
                    font-weight: bold;
                    color: $white;
                    @include stroke(#000);
                }
            }
            .title {
                font-weight: bold;
                color: $white;
                @include stroke(#000);
            }
        }
        .user-info-box {
            margin-bottom: 10px;
            .post-date {
                font-size: 14px;
                color: $text3;
            }
        }
        .title {
            display: block;
            font-size: 18px;
            font-weight: bold;
            color: $text1;
        }
    }
}
.content-box {
    margin: 0 20px 10px;
    .summary {
        display: block;
        font-size: 15px;
        color: $text2;
    }
}

.assess-box {
    margin: 0 20px 10px;
    display: flex;
    flex-direction: row;
    transform: translateX(-5px);
    .assess-item {
        display: flex;
        align-items: center;
        align-content: center;
        margin-right: 10px;
        font-size: 14px;
        color: $text2;
        cursor: pointer;
        padding: 5px;
        transition: 0.2s;
        &:hover {
            color: $text1;
        }
        &.active {
            .iconfont {
                color: $danger;
            }
        }
        .iconfont {
            font-size: 20px;
            margin-right: 2px;
        }
    }
    .enter-btn {
        display: flex;
        flex-grow: 2;
        justify-content: flex-end;
        opacity: 0;
        transition: 0.1s;
        .link {
            text-decoration: none;
            color: #0a59f7;
            font-size: 14px;
            align-self: center;
            cursor: pointer;
        }
    }
}

.bottom-bar {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    .close-btn {
        font-weight: bold;
        font-size: 16px;
        margin-right: 20px;
    }
    .release-btn {
        align-self: flex-end;
        font-size: 16px;
    }
}
</style>
