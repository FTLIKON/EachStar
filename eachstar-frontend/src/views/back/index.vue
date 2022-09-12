<template>
    <div class="back-page">
        <div class="container">
            <!-- <Skeleton custom>
                <SkeletonItem :height="180"></SkeletonItem>
                <SkeletonItem :height="180"></SkeletonItem>
                <SkeletonItem :height="180"></SkeletonItem>
                <SkeletonItem :height="180"></SkeletonItem>
                <SkeletonItem :height="180"></SkeletonItem>
            </Skeleton> -->
            <!-- <template v-if="idx === 0">
                <keep-alive>
                    <Com.A />
                </keep-alive>
            </template>
            <template v-else>
                <keep-alive>
                    <Com.B />
                </keep-alive>
            </template> -->
            <!-- <component :is="coms[idx].com"></component> -->
            <!-- <Scroller.recycle
                class="scroller"
                :data="dataList"
                :item-size="200"
                :page-mode="true">
                <template #default="props">
                    <div class="data-list-item">
                        <div class="td index">
                            {{ props.index }}
                        </div>
                        <div class="td value">
                            {{ props.item + '-' + props.position }} Scoped
                        </div>
                    </div>
                </template>
            </Scroller.recycle> -->
            <!-- <z-button @click="changeIdx"> 切换 </z-button> -->
            <div class="box">
                <div class="child" v-for="i in 6" :key="i"></div>
            </div>
        </div>
    </div>
</template>

<script setup>
// import // ref,
// // onMounted,
// 'vue';
// // import * as Com from './com';
// import * as Scroller from '@/components/virtual-scroller';

// const dataList = new Array(1000).fill(0).map((v, i) => {
//     return i;
// });

// let coms = [
//     {
//         name: 'a',
//         com: Com.A
//     },
//     {
//         name: 'b',
//         com: Com.B
//     }
// ];

// const idx = ref(0);

// const changeIdx = function () {
//     idx.value = idx.value === 0 ? 1 : 0;
// };

// onMounted(() => {
//     console.log(123);
// });
</script>

<style lang="scss" scoped>
// * {
// cursor: none!important;
// }
.container {
    width: $con_width;
    padding-top: $nav_height;
    margin: 50px auto 0;
}

.scroller {
    // height: 800px;
    background-color: rgb(233, 233, 233);
}
.data-list-item {
    // height: 200px;
}
.box {
}
.child {
    box-sizing: border-box;
    display: inline-block;
    width: 64px;
    height: 64px;
    border-radius: 8px;
    font-size: 0;
    margin-right: 10px;
    background-color: red;
}
.child:first-child:nth-last-child(n + 3),
.child:first-child:nth-last-child(n + 3) ~ .child {
    border: dashed 2px black;
}
$num: 4;
.child:nth-child(#{$num}):nth-last-child(n-#{$num}),
.child:nth-child(#{$num}):nth-last-child(n-#{$num}) ~ .child {
    background-color: blue;
}
</style>
