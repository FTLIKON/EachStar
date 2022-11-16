import api_server from "@/config";
import { getCookie, setCookie } from "@/lib/cookie";


/**
 * 初始化&类型
 */

// 登陆页
export function goLogin(type) {
  window.location.href = api_server + "/oauth/" + type.toLowerCase() + "/login";
}

// 记载使用类型
export function setUserType(type) {
  setCookie("usingType", type);
}

// 获取使用类型
export function getUserType() {
  let type = getCookie("usingType");
  if (type != "GitHub" && type != "Gitee") {
    setCookie("usingType", "GitHub"); // default
    return "GitHub";
  }
  return type;
}

// 获取github和gitee相反字符串
export function getOtherType(type) {
  if (type.toLowerCase() == "github") {
    return "Gitee";
  } else {
    return "GitHub";
  }
}

/**
 * 用户信息相关
 */

// 登陆态
export function isLogin(ctype = getUserType()) {
  let type = ctype.toLowerCase();
  return getCookie(type + "Id") != "";
}

// 获取用户信息
export function getUser(ctype = getUserType()) {
  let type = ctype.toLowerCase();
  let user = {
    name: getCookie(type + "Name"),
    avatar: getCookie(type + "Avatar"),
  };
  return user;
}

// 获取用户积分
export function getUserPrice(ctype = getUserType()) {
  let type = ctype.toLowerCase();
  return getCookie(type + "Price");
}
