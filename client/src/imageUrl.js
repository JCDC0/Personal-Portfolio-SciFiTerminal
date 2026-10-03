export function imageUrl(path) {
  if (!path) return ''
  if (/^https?:\/\//.test(path)) return path
  return import.meta.env.BASE_URL + path.replace(/^\/+/, '')
}
