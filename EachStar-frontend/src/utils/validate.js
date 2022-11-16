import { getUserType } from "@/api/login.js";

/**
 * 过滤特殊字符
 */
export function stripScript(str) {
  var pattern = new RegExp(
    "[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）&;—|{ }【】‘；：”“'。，、？]"
  );
  var rs = "";
  for (var i = 0; i < str.length; i++) {
    rs = rs + str.substr(i, 1).replace(pattern, "");
  }
  return rs;
}

/**
 * 验证邮箱
 */
export function validateEmail(value) {
  let reg = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;
  return !reg.test(value) ? true : false;
}

/**
 * 验证发布链接
 */
export function validateUrl(value, type = getUserType()) {
  console.log(value, type)
  if (type == "GitHub") {
    let reg =
      /^(https:\/\/github.com\/)+([a-zA-Z0-9-_]{1,39})+(\/)+([a-zA-Z0-9-_.]{1,100}$)/;
    return reg.test(value) ? true : false;
  } else {
    let reg =
      /^(https:\/\/gitee.com\/)+([a-zA-Z0-9-_]{1,39})+(\/)+([a-zA-Z0-9-_.]{1,100}$)/;
    return reg.test(value) ? true : false;
  }
}

/**
 * 验证密码 6至20位的字母+数字
 */
export function validatePass(value) {
  let reg = /^(?!\D+$)(?![^a-zA-Z]+$)\S{6,20}$/;
  return !reg.test(value) ? true : false;
}

/**
 * 验证验证码
 */
export function validateVCode(value) {
  let reg = /^[a-z0-9]{6}$/;
  return !reg.test(value) ? true : false;
}
