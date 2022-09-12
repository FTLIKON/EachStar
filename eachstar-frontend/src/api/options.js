import { get, post, dele } from '@/utils/request';

/**
 * 获取配置列表
 */
export function getOptions() {
    return get('/config-options');
}

/**
 * 获取配置值
 */
export function getValue(name, value, range) {
    const data = {
        configName: name,
        configValue: value,
        configRange: range,
    };
    return get('/config-options/value', data);
}

/**
 * 添加或修改配置
 */
export function saveOrUpdateOption(name, value, range) {
    const data = {
        configName: name,
        configValue: value,
        configRange: range,
    };
    return post('/config-options', data);
}

/**
 * 删除配置
 */
export function deleteOption(id) {
    return dele('/config-options/' + id);
}
