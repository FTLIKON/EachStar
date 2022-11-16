/**
 * 生成随机字符串
 */
export function randomString() {
  return Math.random().toString(36).slice(2);
}
