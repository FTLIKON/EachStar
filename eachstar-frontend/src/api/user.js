import { get, post, put } from '@/utils/request';

/**
 * 发送验证码
 */
export function sendVerifyCode(email) {
    const data = {
        email: email,
    };
    return get('/auth/verify-code', data);
}

/**
 * 登录或注册
 */
export function sign(email, code) {
    const data = {
        email: email,
        verifyCode: code,
    };
    return post('/auth/sign', data);
}

/**
 * 获取用户信息
 */
export function getUserInfo(id) {
    return get('/user/' + id);
}

/**
 * 获取当前用户信息
 */
export function getAuthInfo() {
    return get('/auth/info');
}

/**
 * 修改用户信息
 */
export function modUser(params) {
    return put('/user', params);
}
