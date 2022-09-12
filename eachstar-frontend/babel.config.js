module.exports = {
    presets: ['@vue/cli-plugin-babel/preset'],
    plugins: [
        [
            'prismjs',
            {
                languages: ['java', 'xml', 'yaml', 'html', 'js', 'json', 'css'],
            },
        ],
    ],
};
