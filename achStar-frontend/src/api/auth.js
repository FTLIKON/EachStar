import service from "../utils/request";

/**
 * 登录
 */
export function login(data) {
  return service.request({
    method: "post",
    url: "/auth/login/",
    data: data,
  });
}

/**
 * 注册
 */
export function register(data) {
  return service.request({
    method: "post",
    url: "/auth/register",
    data: data,
  });
}
