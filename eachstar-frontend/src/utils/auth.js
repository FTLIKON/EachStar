import { getAuthInfo } from '@/api/user';

const has = function () {
    return JSON.parse(localStorage.getItem('auth')) ? true : false;
};

const get = function (key) {
    const data = JSON.parse(localStorage.getItem('auth'));
    if (data) {
        return key ? data[key] : data;
    } else {
        return null;
    }
};

const clear = function () {
    localStorage.removeItem('auth');
};

const update = async function (data) {
    if (data) {
        localStorage.setItem('auth', JSON.stringify(data));
        return;
    }
    await getAuthInfo()
        .then(res => {
            localStorage.setItem(
                'auth',
                JSON.stringify({ token: get('token'), user: res })
            );
        })
        .catch(() => {
            clear();
        });
};

const auth = async function () {
    await update();
    return ~~get('user')?.['lv'];
};

/**
 * 声明工具类对象
 */
const authUtils = {
    has,
    get,
    clear,
    update,
    auth,
};

export default authUtils;
