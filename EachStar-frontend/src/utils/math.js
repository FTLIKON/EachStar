// 获取最小下界(非负数)
export function min_floor(a, b) {
  if (b <= 1) b = 1;
  if (a > b) return Math.floor(b);
  return Math.floor(a);
}
