import { createStore } from 'vuex';

/**
 * 弹出层模块
 */
const popupLayoutModule = {
    namespaced: true,
    state: {
        view: null,
        history: [],
    },
    getters: {
        getView(state) {
            return state.view;
        },
    },
    mutations: {
        setView(state, val) {
            // 开
            if (val !== null) {
                if (val.type) {
                    if (val.type === 'reLaunch') {
                        state.history = [];
                        state.view = val;
                    }
                } else {
                    state.history.push(val);
                    state.view = val;
                }
                // 关
            } else {
                if (state.history.length > 0) {
                    state.history.pop();
                }
                if (state.history.length === 0) {
                    state.view = null;
                } else {
                    state.view = state.history[state.history.length - 1];
                }
            }
        },
    },
    actions: {
        setView({ commit }, val) {
            commit('setView', val);
        },
    },
};

/**
 * 顶部导航模块
 */
const topNavModule = {
    namespaced: true,
    state: {
        show: true,
        back: false,
        current: -1,
    },
    getters: {
        getShow(state) {
            return state.show;
        },
        getBack(state) {
            return state.back;
        },
        getCurrent(state) {
            return state.current;
        },
    },
    mutations: {
        setShow(state, val) {
            state.show = val;
        },
        setBack(state, val) {
            state.back = val;
        },
        setCurrent(state, val) {
            state.current = val;
        },
    },
};

export default createStore({
    strict: true,
    state: {
        eventLock: false,
    },
    getters: {
        getEventLock(state) {
            return state.eventLock;
        },
    },
    mutations: {
        setEventLock(state, val) {
            state.eventLock = val;
        },
    },
    actions: {},
    modules: {
        pl: popupLayoutModule,
        nav: topNavModule,
    },
});
