export default function throttle(fn, wait = 200) {
    let pre = Date.now();
    return function () {
        const context = this;
        const args = arguments;
        const now = Date.now();
        if (now - pre >= wait) {
            fn.apply(context, args);
            pre = Date.now();
        }
    };
}
