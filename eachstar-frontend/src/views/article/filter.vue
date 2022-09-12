<template>
    <transition name="scroll">
        <div v-show="trigger" class="filter-box">
            <div class="filter-bar">
                <z-button
                    class="all-btn"
                    :type="optionsTrigger ? 'primary' : 'normal'"
                    @click="optionsTrigger = !optionsTrigger">
                    <span class="iconfont icon-bars" />
                    <span>全部</span>
                </z-button>
                <div class="input-box">
                    <input
                        class="input"
                        type="search"
                        v-model="value"
                        maxlength="40"
                        placeholder="搜索你想要的的内容"
                        @keydown.enter="onSearch" />
                </div>
                <z-button class="search-btn" @click="onSearch">
                    <span class="iconfont icon-search" />
                </z-button>
            </div>
            <transition name="dropdown">
                <div v-show="optionsTrigger" class="options-box">
                    <div
                        v-for="(item, index) in tagList"
                        :key="index"
                        class="option"
                        :class="{
                            active: selectedOptions.indexOf(item.id) > -1,
                        }"
                        @click="selectOption(item.id)">
                        <span>{{ item.name }}</span>
                    </div>
                </div>
            </transition>
        </div>
    </transition>
</template>

<script>
import { getTagList } from '@/api/tag';

export default {
    props: {
        trigger: {
            type: Boolean,
            required: true,
        },
    },
    data() {
        return {
            optionsTrigger: false,
            optionsHeight: 0,
            tagList: [],
            selectedOptions: [],
            value: '',
        };
    },
    watch: {
        trigger: {
            handler(val) {
                if (!val) return;
                this.$nextTick(function () {
                    document.querySelector('.input').focus();
                });
            },
        },
        optionsTrigger: {
            handler(val) {
                this.$nextTick(function () {
                    if (val) {
                        this.optionsHeight =
                            document.querySelector('.options-box').clientHeight;
                    } else {
                        this.optionsHeight = 0;
                        this.selectedOptions = [];
                    }
                    this.onOptionsTrigger();
                });
            },
        },
    },
    created() {
        this.initTagList();
    },
    emits: ['options-trigger', 'search'],
    methods: {
        /**
         * 筛选选项下拉框trigger
         */
        onOptionsTrigger() {
            this.$emit('options-trigger', this.optionsHeight);
        },
        /**
         * 初始化标签列表
         */
        initTagList() {
            getTagList().then(res => {
                this.tagList = res;
            });
        },
        /**
         * 选择筛选条件
         */
        selectOption(id) {
            const options = this.selectedOptions;
            if (options.indexOf(id) > -1) {
                options.splice(options.indexOf(id), 1);
            } else {
                options.push(id);
            }
        },
        /**
         * 搜索
         */
        onSearch() {
            this.$emit('search', {
                keyword: this.value.trim(),
                tags: this.selectedOptions,
            });
        },
    },
};
</script>

<style lang="scss" scoped>
.filter-box {
    z-index: 10;
    position: absolute;
    width: $con_width;
    top: $nav_height + 50px;
    left: 50%;
    transform: translateX(-50%);
    transition: 0.4s;
    .filter-bar {
        display: flex;
        margin-bottom: 10px;
        .all-btn {
            font-size: 15px;
            margin-right: 10px;
            box-shadow: 0 8px 16px rgba(0, 0, 0, 0.05);
            .iconfont {
                font-size: 20px;
                vertical-align: middle;
                margin-right: 10px;
            }
            span {
                vertical-align: middle;
            }
        }
        .input-box {
            display: flex;
            flex-grow: 2;
            align-items: center;
            justify-content: center;
            padding: 0 15px;
            border-radius: 8px;
            background-color: $white;
            box-shadow: 0 8px 16px rgba(0, 0, 0, 0.05);
            .input {
                width: 100%;
                font-size: 15px;
                outline: none;
                border: none;
                &::placeholder {
                    color: $text3;
                }
            }
        }
        .search-btn {
            width: 40px;
            margin-left: 10px;
            padding: unset;
            box-shadow: 0 8px 16px rgba(0, 0, 0, 0.05);
            .iconfont {
                font-size: 20px;
            }
        }
    }
    .options-box {
        box-sizing: border-box;
        position: absolute;
        width: 100%;
        padding: 10px;
        border-radius: 8px;
        background-color: $white;
        box-shadow: 0 8px 16px rgba(0, 0, 0, 0.05);
        .option {
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
            &:hover {
                cursor: pointer;
                color: $text1;
                border: 0.5px solid $text3;
            }
            &.active {
                color: $highlight;
                border: 0.5px solid $highlight;
            }
            // &+.option {
            //     margin-left: 10px;
            // }
        }
    }
}

.scroll-enter-active,
.scroll-leave-active {
    transition: all 0.3s ease;
}
.scroll-enter-from,
.scroll-leave-to {
    top: $nav_height - 40px;
    opacity: 0;
}

.dropdown-enter-active,
.dropdown-leave-active {
    transition: all 0.3s ease;
}
.dropdown-enter-from,
.dropdown-leave-to {
    opacity: 0;
    transform: translateY(-30px);
}
</style>
