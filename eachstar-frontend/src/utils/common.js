/**
 * 日期字符串
 */
export function parseTimeString(){
    let resTime;
    let cardTime = new Date(timeString);
    let nowTime = new Date();
    let diffTime = nowTime.getTime() + 9000 - cardTime.getTime();
    if (diffTime < 60 * 1000) {
      resTime = Math.floor(diffTime / 1000) + "秒前";
    } else if (diffTime < 3600 * 1000) {
      resTime = Math.floor(diffTime / (60 * 1000)) + "分钟前";
    } else if (diffTime < 3600 * 24 * 1000) {
      resTime = Math.floor(diffTime / (3600 * 1000)) + "小时前";
    } else {
      resTime = Math.floor(diffTime / (3600 * 24 * 1000)) + "天前";
    }
    return resTime;
}

/**
 * 时间数据转时间字符串
 */
export function timestampToTime(timestamp) {
    let now = new Date(timestamp*1000);
    let year = now.getFullYear();    
    let month = now.getMonth()+1;    
    let date = now.getDate();    
    let hour = now.getHours();    
    let minute = now.getMinutes();    
    let second = now.getSeconds();    
    return year+"-"+month+"-"+date+"   "+hour+":"+minute+":"+second;
}