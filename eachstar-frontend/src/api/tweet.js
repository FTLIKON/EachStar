import { get, post, dele } from '@/utils/request';

/**
 * 获取动态列表
 */
export function getTweetList(current, size) {
    const data = {
        current: current,
        size: size,
    };
    return get('/tweet', data);
}

/**
 * 获取动态
 */
export function getTweet(id) {
    return get('/tweet/' + id);
}

/**
 * 发表动态
 */
export function addTweet(content, resources) {
    const data = {
        content: content,
        resources: resources,
    };
    return post('/tweet', data);
}

/**
 * 删除动态
 */
export function deleteTweet(id) {
    return dele('/tweet/' + id);
}
