/**
 * 人性化文件大小处理 (传入文件大小)
 */
export function beautifySize(size, unit) {
    const arrr = ['GB', 'MB', 'KB', 'B'];
    const arrn = [1024 * 1024 * 1024, 1024 * 1024, 1024, 1];
    if (unit != null) {
        return (size / arrn[unit]).toFixed(2) + arrr[unit];
    } else {
        for (let i = 0; i < 4; i++) {
            const inm = Math.floor(size / arrn[i]);
            if (inm != 0) {
                return (size / arrn[i]).toFixed(2) + ' ' + arrr[i];
            }
        }
    }
}
