/**
 * 将日期(time string)转换为 '3分钟前'
 */
export function getPastTimeString(timeString) {
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
 * 获取当前时间 time string
 */
export function getParsedTime() {
  let now = new Date();
  now = now.setDate(now.getDate() + 10);
  now = new Date(now);
  let year = now.getFullYear();
  let month = now.getMonth() + 1;
  let date = now.getDate();
  let hour = now.getHours();
  let minute = now.getMinutes();
  let second = now.getSeconds();
  if (month < 10) month = "0" + month;
  if (date < 10) date = "0" + date;
  if (hour < 10) hour = "0" + hour;
  if (minute < 10) minute = "0" + minute;
  if (second < 10) second = "0" + second;
  return (
    year + "-" + month + "-" + date + " " + hour + ":" + minute + ":" + second
  );
}
