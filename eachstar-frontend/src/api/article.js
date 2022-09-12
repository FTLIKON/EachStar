import { get, post, dele, put, pureRequest } from '@/utils/request';
import authUtils from '@/utils/auth';
import Config from '/setting';

/**
 * 获取文章列表
 * @param {number} current 当前页
 * @param {number} size 每页数据量
 * @returns array
 */
export function getArticleList(params) {
    return get('/article', params);
}

/**
 * 获取文章
 */
export function getArticle(id) {
    return get('/article/' + id);
}

/**
 * 获取文章详情
 */
export function getArticleDetail(id) {
    return get('/article/detail/' + id);
}

/**
 * 发表文章
 */
export function addArticle(params) {
    return post('/article', params);
}

/**
 * 编辑文章
 */
export function modArticle(params) {
    return put('/article', params);
}

/**
 * 删除文章
 */
export function deleteArticle(id) {
    return dele('/article/' + id);
}

/**
 * 导出文章
 */
export function exportArticle(id) {
    const service = pureRequest();
    service.interceptors.request.use(
        config => {
            if (authUtils.has()) {
                // 让每个请求携带自定义token
                config.headers['Authorization'] = authUtils.get('token');
            }
            config.headers['Content-Type'] = Config.contentType;
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
    service
        .post('/article/export/' + id, undefined, { responseType: 'blob' })
        .then(res => {
            let fileURL = window.URL.createObjectURL(new Blob([res.data]));
            let fileLink = document.createElement('a');
            fileLink.href = fileURL;
            fileLink.setAttribute(
                'download',
                decodeURIComponent(
                    res.headers['content-disposition']
                        .split(';')[1]
                        .split('=')[1]
                ).replace(/\+/g, ' ')
            );
            document.body.appendChild(fileLink);
            fileLink.click();
        });
}
