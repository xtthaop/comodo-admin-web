// 字符串驼峰转横线
export function toHorizontalLine(str) {
  return str.replace(/\B([A-Z])/g, '-$1').toLowerCase()
}
