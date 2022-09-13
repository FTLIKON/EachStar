<template>
    <div class="user-center-inner">
        <div class="title-box">
            <span class="main">用户</span>
            <span class="sub">个人中心</span>
        </div>
        <div class="content-box">
            <div class="basic-info-box">
                <div class="basic-info">
                    <async-img
                        class="avatar"
                        :url="userInfo.avatarPath"
                        suffix="?x-oss-process=image/resize,s_72" />
                    <div class="info">
                        <div class="info-item">
                            <span class="tag">{{ tag[userInfo.lv] }}</span>
                            <span class="name">{{ userInfo.nickname }}</span>
                        </div>
                        <div class="info-item">
                            <span class="email">{{ userInfo.email }}</span>
                        </div>
                    </div>
                </div>
                <z-button class="edit-btn" ghost round @click="toEdit">
                    编辑个人资料
                </z-button>
            </div>
            <div class="signature">
                <span>{{ userInfo.signature }}</span>
            </div>
        </div>
        <div class="button-box">
            <z-button
                v-for="(option, index) in options"
                :key="index"
                class="btn"
                type="link"
                @click="option.func">
                {{ option.name }}
            </z-button>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            userInfo: {},
            operationList: [
                {
                    name: '管理平台',
                    func: this.toManage,
                    use: false,
                },
                {
                    name: '登出',
                    func: this.logout,
                    use: true,
                },
            ],
            tag: ['普通用户', '管理员', '博主'],
        };
    },
    computed: {
        options() {
            return this.operationList.filter(option => option.use == true);
        },
    },
    watch: {
        userInfo: {
            handler(val) {
                if (val?.lv) this.operationList[0].use = val.lv === 2;
            },
            immediate: true,
            deep: true,
        },
    },
    created() {
        this.userInfo = this.$auth.get('user');
    },
    activated() {
        this.userInfo = this.$auth.get('user');
    },
    emits: ['close'],
    methods: {
        toEdit() {
            this.$PL.show(this, {
                name: 'user-edit',
                data: {},
            });
        },
        toManage() {
            this.$msg('success', '管理平台');
        },
        logout() {
            this.$auth.clear();
            this.$msg('success', '退出成功');
            this.$emit('close');
            setTimeout(() => {
                location.reload();
            }, 1000);
        },
    },
};
</script>

<style lang="scss" scoped>
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
    margin-bottom: 40px;
    padding-bottom: 40px;
    border-bottom: 2px solid $divider;
    .basic-info-box {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 20px;
        .basic-info {
            display: flex;
            flex-direction: row;
            align-items: center;
            .avatar {
                width: 72px;
                height: 72px;
                border-radius: 36px;
                margin-right: 10px;
                object-fit: cover;
            }
            .info {
                display: flex;
                flex-direction: column;
                .info-item {
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    & + .info-item {
                        margin-top: 10px;
                    }
                    .tag {
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        height: 20px;
                        font-size: 12px;
                        line-height: 20px;
                        background-color: #000;
                        color: $white;
                        padding: 0 5px;
                        margin-right: 5px;
                        border-radius: 4px;
                    }
                    .name {
                        font-size: 15px;
                        font-weight: bold;
                    }
                    .email {
                        color: $text2;
                    }
                }
            }
        }
    }
    .edit-btn {
        font-size: 15px;
        color: $highlight;
        border-color: $highlight;
    }
    .signature {
        font-size: 15px;
        color: $text2;
    }
}

.button-box {
    .btn {
        font-size: 17px;
        color: $text2;
        &:hover {
            color: $text1;
        }
        &:last-child {
            font-weight: bold;
            color: $danger;
            &:hover {
                color: $danger_hover;
            }
        }
    }
}
</style>
