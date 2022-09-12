module.exports = {
    /**
     * 标题
     */
    title: '中二Devil的个人博客',

    /**
     * 作者
     */
    author: '中二Devil',

    /**
     * 版权所有
     */
    copyRight: '著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。',

    /**
     * 网站地址
     */
    baseURL: 'https://z2devil.cn',

    /**
     * @description 后端接口地址
     */
    // apiURL: 'https://z2devil.cn/api',
    apiURL: 'http://localhost:8000/api',

    /**
     * @description 后端下载/查看文件接口地址
     */
    downloadUrl: 'https://z2devil-bucket.oss-cn-beijing.aliyuncs.com/',

    /**
     * @description 记住密码状态下的token在Cookie中存储的天数
     */
    tokenExpires: 30,

    /**
     * @description 请求超时时间，毫秒（默认30秒）
     */
    timeout: 30000,

    /**
     * 请求体数据类型
     */
    contentType: 'application/json',

    /**
     * oss 相关
     */
    oss_accessid: 'LTAI5tSfHizt7iAEjigoefXg',
    oss_endpoint: 'oss-cn-beijing.aliyuncs.com',
    oss_bucket: 'z2devil-bucket',
    oss_root: 'blog/',

    /**
     * 上传图片最大大小（15MB）
     */
    maxImageSize: 15 * 1024 * 1024,
};
