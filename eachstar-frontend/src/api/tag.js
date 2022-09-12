import { get, post, dele } from '@/utils/request';

/**
 * 获取标签列表
 */
export function getTagList() {
    return get('/tag');
}

/**
 * 新增标签
 */
export function addTag(name) {
    const data = {
        name: name,
    };
    return post('/tag', data);
}

/**
 * 删除标签
 */
export function deleteTag(id) {
    return dele('/tag/' + id);
}
