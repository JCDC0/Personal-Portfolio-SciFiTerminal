import seed from './seed.json'

const MESSAGES_KEY = 'portfolio:messages'

const delay = (ms = 250) => new Promise((resolve) => setTimeout(resolve, ms))

function readMessages() {
  try {
    return JSON.parse(localStorage.getItem(MESSAGES_KEY)) || []
  } catch {
    localStorage.removeItem(MESSAGES_KEY)
    return []
  }
}

export async function listProjects() {
  await delay()
  return seed
}

export async function getProject(id) {
  await delay()
  const found = seed.find((project) => String(project.id) === String(id))
  if (!found) throw new Error('Not found')
  return found
}

export async function sendMessage(input) {
  await delay()
  if (!input.name?.trim() || !input.email?.trim() || !input.message?.trim()) {
    throw new Error('Name, email and message are required')
  }
  const created = {
    ...input,
    id: crypto.randomUUID(),
    created_at: new Date().toISOString(),
  }
  localStorage.setItem(MESSAGES_KEY, JSON.stringify([...readMessages(), created]))
  return created
}
