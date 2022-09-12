<template>
    <div>
        <div id="map" />
    </div>
</template>

<script>
const mapboxgl = require('mapbox-gl');
export default {
    data() {
        return {};
    },
    mounted() {
        this.initmap();
    },
    methods: {
        initmap() {
            mapboxgl.accessToken =
                'pk.eyJ1IjoiZmVuZzYzMTQ3MTc1MCIsImEiOiJjazBvMTQzdGQwNTQzM2VzOHljaG1neWN6In0.TyJHXIwI3lvVMFHyDCIO4g'; //这里请换成自己的token
            var map = new mapboxgl.Map({
                container: 'map', // container id 绑定的组件的id
                style: 'mapbox://styles/feng631471750/cktio73gb6d0h17p9bi4tgp42', //地图样式，可以使用官网预定义的样式,也可以自定义
                center: [118.726533, 32.012005], // 初始坐标系，这个是南京建邺附近
                zoom: 9, // starting zoom 地图初始的拉伸比例
                pitch: 0, //地图的角度，不写默认是0，取值是0-60度，一般在3D中使用
                bearing: 0, //地图的初始方向，值是北的逆时针度数，默认是0，即是正北
                antialias: false, //抗锯齿，通过false关闭提升性能
            });
            //地图监听点击，触发回调
            map.on('click', function (e) {
                console.log(e);
            });
        },
    },
};
</script>

<style lang="scss" scoped>
// @import url(https://api.mapbox.com/mapbox-gl-js/v2.4.1/mapbox-gl.css);

#map {
    position: absolute;
    top: 56px;
    bottom: 0;
    width: 100%;
    height: calc(100vh - 56px);
}

.nav-bar {
    position: fixed;
    width: 100%;
    background-color: rgb(151, 44, 252);
    top: 0;
}

.search-box {
    position: fixed;
    width: 100%;
    background-color: rgb(230, 20, 20);
    // top: 0;
}
</style>
