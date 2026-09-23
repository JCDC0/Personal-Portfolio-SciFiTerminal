const BASE = import.meta.env.VITE_API_BASE_URL || ''

async function request(path, options) {
  const response = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })

  if (!response.ok) {
    let message = `${response.status} ${response.statusText}`
    const body = await response.json().catch(() => null)
    if (body?.error) message = body.error
    throw new Error(message)
  }

  return response.status === 204 ? null : response.json()
}

export const listProjects = () => request('/api/projects')

export const getProject = (id) => request(`/api/projects/${id}`)

export const sendMessage = (input) =>
  request('/api/messages', { method: 'POST', body: JSON.stringify(input) })
