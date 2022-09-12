import { get, post, dele } from '@/utils/request';

/**
 * 获取评论列表
 */
export function getCommentList(wCate, wId, current, size) {
    let data = {
        wCate: wCate,
        wId: wId,
        current: current,
        size: size,
    };
    return get('/comment', data);
}

/**
 * 获取子评论列表
 */
export function getChildCommentList(id, current, size) {
    let data = {
        current: current,
        size: size,
    };
    return get('/comment/child/' + id, data);
}

/**
 * 获取评论
 */
export function getComment(id) {
    return get('/comment/' + id);
}

/**
 * 发表评论
 */
export function addComment(data) {
    return post('/comment', data);
}

/**
 * 删除评论
 */
export function deleteComment(id) {
    return dele('/comment/' + id);
}
