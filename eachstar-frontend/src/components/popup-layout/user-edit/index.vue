<template>
    <div class="user-edit-box">
        <div class="title-box">
            <span class="main">编辑</span>
            <span class="sub">个人信息</span>
        </div>
        <div class="avatar-box">
            <async-img
                class="avatar-img"
                :url="avatarPath"
                suffix="?x-oss-process=image/resize,s_96" />
            <z-button
                class="upload-img-btn"
                ghost
                round
                :loding="uploadLoading"
                @click="onUpload">
                上传新头像
            </z-button>
        </div>
        <div class="form-box">
            <div
                v-for="(item, index) in form.slice(0, 3)"
                :key="index"
                class="form-item">
                <div class="label">
                    {{ item.label }}
                </div>
                <input
                    class="input"
                    :type="item.type"
                    v-model="item.value"
                    :maxlength="item.length"
                    :placeholder="'请输入' + item.label" />
            </div>
            <div class="form-item">
                <div class="label">认证</div>
                <div v-if="userInfo?.lv < 1" class="auth-box">
                    <input
                        class="input"
                        type="text"
                        v-model="authValue"
                        :maxlength="12"
                        placeholder="请输入邀请码" />
                    <z-button class="auth-btn" type="link"> 进行认证 </z-button>
                </div>
                <div v-else class="tip">
                    <span>{{ authTag[userInfo.lv] }}</span>
                </div>
            </div>
        </div>
        <div class="bottom-bar">
            <z-button
                class="save-btn"
                type="link"
                :loading="saveLoading"
                @click="save">
                <span class="iconfont icon-arrow-left" />
                <span>保存并返回</span>
            </z-button>
        </div>
        <!-- 上传文件用input（不可见） -->
        <input
            style="display: none"
            ref="input"
            type="file"
            accept="image/jpeg, image/jpg, image/png"
            @change="handleChange" />
    </div>
</template>

<script>
import {
    // getAuthInfo,
    modUser,
} from '@/api/user.js';
import { pre, upload, add } from '@/api/file.js';
import uuid from '@/utils/uuid.js';
import compress from '@/utils/compress.js';

export default {
    data() {
        return {
            userInfo: {},
            form: [
                {
                    label: '昵称',
                    value: '',
                    type: 'text',
                    length: 15,
                },
                {
                    label: '邮箱',
                    value: '',
                    type: 'email',
                    length: 30,
                },
                {
                    label: '签名',
                    value: '',
                    type: 'text',
                    length: 30,
                },
            ],
            authValue: '',
            authTag: ['普通用户', '管理员', '博主'],
            avatarFile: {},
            uploadLoading: false,
            saveLoading: false,
            modified: false,
        };
    },
    computed: {
        avatarPath() {
            if (this.avatarFile.status === 1) {
                return this.avatarFile.path;
            } else {
                if (this.userInfo.avatarPath) {
                    return this.userInfo.avatarPath;
                }
            }
            return '';
        },
    },
    watch: {
        form: {
            handler() {
                this.modified = true;
            },
            deep: true,
        },
    },
    created() {
        this.init();
    },
    activated() {
        this.init();
    },
    methods: {
        /**
         * 初始化
         */
        async init() {
            await this.$auth.update();
            console.log('init');
            this.userInfo = this.$auth.get('user');
            this.form[0].value =
                this.userInfo?.['nickname'] ?? this.form[0].value;
            this.form[1].value = this.userInfo?.['email'] ?? this.form[1].value;
            this.form[2].value =
                this.userInfo?.['signature'] ?? this.form[2].value;
            this.modified = false;

            // getAuthInfo().then(res => {
            //     this.userInfo = res;
            //     this.$auth.set(res);
            //     for (const key in res) {
            //         if (Object.hasOwnProperty.call(res, key)) {
            //             const element = res[key];
            //             if (key === 'nickname') {
            //                 this.form[0].value = element;
            //             }
            //             if (key === 'email') {
            //                 this.form[1].value = element;
            //             }
            //             if (key === 'signature') {
            //                 this.form[2].value = element;
            //             }
            //         }
            //         this.modified = false;
            //     }
            // });
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
                    that.avatarFile.status = 1;
                    that.$msg('success', '上传成功');
                } else {
                    that.avatarFile.status = -1;
                    that.$msg('error', '上传失败');
                }
                that.avatarFile.progress = 1;
                that.uploadLoading = false;
            };

            if (this.uploadLoading) return;
            this.uploadLoading = true;
            this.modified = true;
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
                that.avatarFile.path = res;
            });
            this.avatarFile = filesItem;
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
                            that.avatarFile.path = filePath;
                            that.avatarFile.id = r[1];
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
         * 保存修改信息
         */
        async save() {
            if (this.uploadLoading) {
                this.$msg('error', '图片上传中，请稍后');
                return;
            }
            if (!this.modified) {
                this.$PL.hide(this);
                return;
            }
            if (this.saveLoading) return;
            this.saveLoading = true;
            const params = {
                nickname: this.form[0].value,
                email: this.form[1].value,
                signature: this.form[2].value,
            };
            if (this.avatarFile.status === 1) {
                params.avatarPath = this.avatarFile.path;
            }
            await modUser(params)
                .then(async () => {
                    // getAuthInfo().then(res => {
                    //     this.$auth.set(res);
                    //     this.$msg('success', '修改成功');
                    //     this.$PL.hide(this);
                    //     this.saveLoading = false;
                    // });
                    await this.$auth.update();
                    this.$msg('success', '修改成功');
                    this.$PL.hide(this);
                    this.saveLoading = false;
                })
                .catch(() => {
                    this.$msg('error', '修改失败');
                    this.saveLoading = false;
                });
        },
    },
};
</script>

<style lang="scss" scoped>
.user-edit-box {
    box-sizing: border-box;
    position: fixed;
    width: 640px;
    height: fit-content;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) scale(1);
    background-color: $white;
    border-radius: 8px;
    padding: 40px 50px;
    z-index: 200;
}

.title-box {
    margin-bottom: 30px;
    .main {
        font-size: 36px;
        font-weight: bold;
        margin-right: 5px;
        letter-spacing: 0.05em;
    }
    .sub {
        font-size: 18px;
        color: $text2;
        letter-spacing: 0.05em;
    }
}

.avatar-box {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30px;
    .avatar-img {
        width: 96px;
        height: 96px;
        border-radius: 48px;
        object-fit: cover;
    }
    .upload-img-btn {
        font-size: 15px;
        color: $highlight;
        border-color: $highlight;
    }
}

.form-box {
    .form-item {
        border-bottom: solid 2px $divider;
        margin-bottom: 20px;
        .auth-box {
            display: flex;
            flex-direction: row;
            .auth-btn {
                flex-shrink: 0;
            }
        }
        .label {
            font-size: 15px;
            color: $text2;
            margin-bottom: 10px;
        }
        .input {
            font-size: 18px;
            outline: none;
            border: none;
            line-height: 28px;
            width: 100%;
        }
        .tip {
            font-size: 18px;
            line-height: 28px;
            width: 100%;
            color: $text2;
        }
    }
}

.bottom-bar {
    position: relative;
    .save-btn {
        font-size: 18px;
        .iconfont {
            font-size: 24px;
        }
    }
}
</style>
