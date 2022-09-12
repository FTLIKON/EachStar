/**
 * 人性化时间处理 (传入时间戳)
 */
export function beautifyTime(strDate, unit) {
    const timestamp = new Date(strDate);
    let mistiming = Math.round(new Date()) - timestamp;
    const postfix = mistiming > 0 ? '前' : '后';
    mistiming = Math.abs(mistiming / 1000);
    const arrr = ['年', '个月', '周', '天', '小时', '分钟', '秒'];
    const arrn = [31536000, 2592000, 604800, 86400, 3600, 60, 1];
    if (unit != null) {
        const inm = Math.floor(mistiming / arrn[unit]);
        if (inm != 0) {
            return inm + arrr[unit] + postfix;
        } else {
            return inm + 1 + arrr[unit] + '内';
        }
    } else {
        for (let i = 0; i < 7; i++) {
            const inm = Math.floor(mistiming / arrn[i]);
            if (inm != 0) {
                return inm + arrr[i] + postfix;
            }
        }
    }
}

// 时间格式为 2020.08.09
export function timestampToData(strDate) {
    var date = new Date(strDate);
    var Y = date.getFullYear() + '.';
    var M =
        (date.getMonth() + 1 < 10
            ? '0' + (date.getMonth() + 1)
            : date.getMonth() + 1) + '.';
    var D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + '';
    return Y + M + D;
}

// 时间格式为 2020-08-09
export function timestampToDataByLine(strDate) {
    var date = new Date(strDate);
    var Y = date.getFullYear() + '-';
    var M =
        (date.getMonth() + 1 < 10
            ? '0' + (date.getMonth() + 1)
            : date.getMonth() + 1) + '-';
    var D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + '';
    return Y + M + D;
}

// 时间格式为 2020-08-09 06:05:04
export function timestampToTime(strDate) {
    var date = new Date(strDate);
    var Y = date.getFullYear() + '-';
    var M =
        (date.getMonth() + 1 < 10
            ? '0' + (date.getMonth() + 1)
            : date.getMonth() + 1) + '-';
    var D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' ';
    var h =
        (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
    var m =
        (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) +
        ':';
    var s =
        date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
    return Y + M + D + h + m + s;
}

// 时间格式为 2020年08月09日 06:05:04
export function timestampToTimeByStr(strDate) {
    var date = new Date(strDate);
    var Y = date.getFullYear() + '年';
    var M =
        (date.getMonth() + 1 < 10
            ? '0' + (date.getMonth() + 1)
            : date.getMonth() + 1) + '月';
    var D =
        (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + '日 ';
    var h =
        (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
    var m =
        (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) +
        ':';
    var s =
        date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
    return Y + M + D + h + m + s;
}
