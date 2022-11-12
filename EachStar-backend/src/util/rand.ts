export const randStr = (length: number, randChar: () => string) => {
  let r = ''
  for (let i = 0; i < length; i += 1) r += randChar()
  return r
}

export const randDigit = (base = 10) =>
  ((Math.random() * base) << 0).toString(base)

export const randInt = (length: number) => randStr(length, randDigit)
export const randHex = (length: number) => randStr(length, () => randDigit(16))
export const randBase36 = (length: number) =>
  randStr(length, () => randDigit(36))

export const sample = <T>(a: T | T[]) =>
  Array.isArray(a) ? a[(Math.random() * a.length) << 0] : a
