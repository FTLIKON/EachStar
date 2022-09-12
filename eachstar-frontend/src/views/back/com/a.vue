<template>
    <div>
        <span>组件A</span>
        <!-- <span>{{ x }}-{{ y }}</span> -->
        <!-- <div class="mouse" 
            :style="{ 
                'left': x +'px', 
                'top': y +'px' 
            }"></div> -->
    </div>
</template>

<script>
// import { useMouse } from '@vueuse/core'
export default {
    data() {
        return {};
    },
    setup() {
        // const { x, y } = useMouse({ touch: false });
        // return { x, y };
    },
};
</script>

<style scoped>
.mouse {
    z-index: 999;
    position: fixed;
    width: 10px;
    height: 10px;
    background-color: red;
}
</style>
