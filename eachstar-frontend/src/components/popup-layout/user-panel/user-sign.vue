<template>
    <div class="user-sign-inner">
        <div class="title-box">
            <span class="main">登入</span>
            <span class="sub">登录或注册</span>
        </div>
        <div class="content-box">
            <div class="input-box">
                <input
                    class="input"
                    type="text"
                    maxlength="50"
                    v-model="value"
                    :placeholder="tips"
                    autofocus />
            </div>
        </div>
        <div class="button-box">
            <z-button
                class="btn send-btn"
                ghost
                round
                :loading="sendLoading"
                @click="sendCode">
                {{ btnText }}
            </z-button>
            <z-button
                class="btn sign-btn"
                type="primary"
                :class="{ active: isSended }"
                circle
                :disabled="!isSended"
                :loading="signLoading"
                @click="signIn">
                <span class="iconfont icon-arrow-right" />
            </z-button>
        </div>
    </div>
</template>

<script>
import { sendVerifyCode, sign } from '@/api/user';

export default {
    data() {
        return {
            isSended: false,
            value: '',
            email: '',
            sendLoading: false,
            signLoading: false,
            btnText: '发送验证码',
            tips: '请输入邮箱',
            timmer: 0,
        };
    },
    watch: {
        value(val) {
            if (!this.isSended) {
                this.email = val;
            }
        },
    },
    emits: ['close'],
    methods: {
        /**
         * 发送验证码
         */
        sendCode() {
            if (this.email !== '') {
                this.sendLoading = true;
                sendVerifyCode(this.email)
                    .then(() => {
                        this.sendLoading = false;
                        this.isSended = true;
                        this.value = '';
                        this.btnText = '重新发送验证码';
                        this.tips = '请输入验证码';
                        this.$msg('success', '发送成功');
                    })
                    .catch(err => {
                        this.sendLoading = false;
                        this.$msg('error', err);
                    });
            }
        },
        /**
         * 登入
         */
        signIn() {
            const that = this;
            if (this.isSended || this.value != null) {
                this.signLoading = true;
                sign(this.email, this.value)
                    .then(res => {
                        this.signLoading = false;
                        this.$auth.update({ token: res.token, user: res.user });
                        // this.$auth.set(res.user, res.token);
                        this.$emit('close');
                        this.$msg('success', '登入成功');
                        setTimeout(() => {
                            if (that.$route.path === '/404') {
                                that.$router.back();
                            } else {
                                location.reload();
                            }
                        }, 1000);
                    })
                    .catch(err => {
                        this.signLoading = false;
                        this.$msg('error', err);
                    });
            }
        },
    },
};
</script>

<style lang="scss" scoped>
.button-box {
    .btn {
        margin-left: 20px;
    }
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

.content-box {
    margin-bottom: 50px;
    .input-box {
        border-bottom: 2px solid $divider;
        .input {
            border: none;
            outline: none;
            font-size: 18px;
            width: 100%;
            line-height: 45px;
            &::placeholder {
                color: $text3;
                letter-spacing: 0.05em;
            }
        }
    }
}

.button-box {
    display: flex;
    float: right;
    .btn {
        position: relative;
        margin-left: 20px;
    }
    .send-btn {
        color: $highlight;
        border-color: $highlight;
    }
}
</style>
