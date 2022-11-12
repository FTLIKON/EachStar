import * as crypto from 'crypto'

export const hash = (s: string | number) => {
  if (typeof s === 'number') return s
  let hash = 0
  for (let i = 0; i < s.length; i++) {
    const chr = s.charCodeAt(i)
    hash = (hash << 5) - hash + chr
    hash |= 0 // Convert to 32bit integer
  }
  return Math.abs(hash)
}

export const sha256 = (s: crypto.BinaryLike) =>
  crypto.createHash('sha256').update(s).digest()
