import skeleton from './src/skeleton.vue';
import skeletonItem from './src/skeleton-item.vue';

export default {
    install: app => {
        // Plugin code goes here
        app.component('Skeleton', skeleton);
        app.component('SkeletonItem', skeletonItem);
    },
};
