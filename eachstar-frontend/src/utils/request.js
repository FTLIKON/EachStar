import axios from 'axios';
import authUtils from '@/utils/auth';
import Config from '/setting';
import store from '@/store';

// 创建axios实例
const service = axios.create({
    baseURL: Config.apiURL, // api 的 base_url
    timeout: Config.timeout, // 请求超时时间
});

// request拦截器
service.interceptors.request.use(
    config => {
        if (authUtils.has()) {
            // 让每个请求携带自定义token
            config.headers['Authorization'] = authUtils.get('token');
        }
        config.headers['Content-Type'] = Config.contentType;
        // 对参数进行qs的序列化
        // config.data = qs.stringify(config.data);
        return config;
    },
    error => {
        // 对请求错误做些什么，自己定义
        return new Promise(function (resolve, reject) {
            reject(error);
        }).catch(function (reason) {
            console.error('catch:', reason);
        });
    }
);

// response 拦截器
service.interceptors.response.use(
    response => {
        const http = response;
        // console.log('http', http);
        if (http.status === 200) {
            const res = response.data;
            // console.log('res', res);
            if (res.code === 200) {
                return Promise.resolve(res.data);
            } else {
                return Promise.reject(res.msg);
            }
        } else {
            const res = response.data;
            // console.log('res', res);
            if (res) {
                return Promise.reject(res.msg);
            } else {
                return Promise.reject('服务器异常');
            }
        }
    },
    error => {
        const http = error.response;
        // console.log('http', http);
        if (http.status === 200) {
            const res = error.response.data;
            // console.log('res', res);
            if (res.code === 401) {
                authUtils.clear();
                if (
                    !store.getters['pl/getView'] ||
                    store.getters['pl/getView'].name === 'user-edit'
                ) {
                    store.dispatch('pl/setView', {
                        name: 'user-panel',
                        type: 'reLaunch',
                    });
                }
                return Promise.reject('未登录或当前登录状态过期');
            } else {
                return Promise.reject(res.msg);
            }
        } else {
            const res = error.response.data;
            // console.log('res', res);
            if (res) {
                if (res.code === 401) {
                    authUtils.clear();
                    if (
                        !store.getters['pl/getView'] ||
                        store.getters['pl/getView'].name === 'user-edit'
                    ) {
                        store.dispatch('pl/setView', {
                            name: 'user-panel',
                            type: 'reLaunch',
                        });
                    }
                    return Promise.reject('未登录或当前登录状态过期');
                } else {
                    return Promise.reject(res.msg);
                }
            } else {
                return Promise.reject('服务器异常');
            }
        }
    }
);

/**
 * get方法封装
 */
export function get(url, data) {
    return service.get(url, {
        params: data,
    });
}

/**
 * delete方法封装
 */
export function dele(url, data) {
    return service.delete(url, {
        params: data,
    });
}

/**
 * post方法封装
 */
export function post(url, param) {
    return service.post(url, param);
}

/**
 * put方法封装
 */
export function put(url, param) {
    return service.put(url, param);
}

/**
 * 纯净 request（供 oss 上传使用）
 */
export function pureRequest(options) {
    const service = axios.create({
        baseURL: options?.baseURL ?? Config.apiURL, // api 的 base_url
        timeout: options?.timeout ?? Config.timeout, // 请求超时时间
    });
    return service;
}

export default service;
