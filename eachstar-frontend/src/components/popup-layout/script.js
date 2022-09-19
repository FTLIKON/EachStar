export function show(that, view) {
    that.$store.dispatch('pl/setView', view);
}

export function hide(that) {
    that.$store.dispatch('pl/setView', null);
}
