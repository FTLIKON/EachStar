import * as qs from 'qs'

export const parseQs = (str?: any): Record<string, any> => {
  if (typeof str !== 'string') return {}
  return qs.parse(decodeURIComponent(str))
}

export const formatQs = (obj: any) => qs.stringify(obj)

export const assignQs = (url: string, obj: Record<string, string>) => {
  const u = new URL(url)
  u.search = formatQs({
    ...parseQs(u.search.replace(/^\?/, '')),
    ...obj,
  })
  return u.toString()
}
