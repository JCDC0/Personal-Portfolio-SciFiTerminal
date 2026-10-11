export function dbId(project) {
  return `DB-${String(project.id).padStart(3, '0')}`
}

export function recordStatus(project) {
  if (project.live_url) return { label: 'ONLINE', tone: 'live' }
  if (project.repo_url) return { label: 'SOURCE AVAILABLE', tone: 'open' }
  return { label: 'CLASSIFIED', tone: 'closed' }
}

export function recordPath(project) {
  const slug = project.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
  return `/srv/records/${dbId(project).toLowerCase()}/${slug}`
}
