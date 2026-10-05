import { existsSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import express from 'express'
import cors from 'cors'
import { pool } from './db/pool.js'
import * as projects from './projectsRepo.js'
import * as messages from './messagesRepo.js'

const app = express()

const allowedOrigins = (process.env.CORS_ORIGINS || 'http://localhost:5173')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean)

app.use(cors({ origin: allowedOrigins }))
app.use(express.json({ limit: '100kb' }))

app.get('/healthz', (request, response) => {
  response.json({ ok: true })
})

app.get('/readyz', async (request, response) => {
  try {
    await pool.query('SELECT 1')
    response.json({ ok: true, db: 'up' })
  } catch (error) {
    console.error('readyz failed:', error.message)
    response.status(503).json({ ok: false, db: 'down' })
  }
})

const MAX_ID = 2147483647
const LIMITS = { name: 120, email: 254, message: 2000 }

function parseId(raw) {
  const id = Number(raw)
  return Number.isInteger(id) && id > 0 && id <= MAX_ID ? id : null
}

function validateMessage(body) {
  const errors = []
  const value = {}
  for (const [field, max] of Object.entries(LIMITS)) {
    const text = typeof body[field] === 'string' ? body[field].trim() : ''
    if (!text) errors.push(`${field} is required`)
    else if (text.length > max) errors.push(`${field} must be ${max} characters or fewer`)
    value[field] = text
  }
  if (value.email && !value.email.includes('@')) errors.push('email must be a valid address')
  return { errors, value }
}

app.get('/api/projects', async (request, response, next) => {
  try {
    response.json(await projects.getAll(pool))
  } catch (error) {
    next(error)
  }
})

app.get('/api/projects/:id', async (request, response, next) => {
  const id = parseId(request.params.id)
  if (!id) return response.status(404).json({ error: 'Not found' })
  try {
    const project = await projects.getById(pool, id)
    if (!project) return response.status(404).json({ error: 'Not found' })
    response.json(project)
  } catch (error) {
    next(error)
  }
})

app.post('/api/messages', async (request, response, next) => {
  const { errors, value } = validateMessage(request.body ?? {})
  if (errors.length > 0) return response.status(400).json({ error: errors.join('; ') })
  try {
    response.status(201).json(await messages.create(pool, value))
  } catch (error) {
    next(error)
  }
})

const clientDist = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../client/dist')

if (existsSync(clientDist)) {
  app.use(express.static(clientDist))
  app.get('*', (request, response, next) => {
    if (request.path.startsWith('/api/') || path.extname(request.path)) return next()
    response.sendFile(path.join(clientDist, 'index.html'))
  })
}

app.use((request, response) => {
  response.status(404).json({ error: 'No such route' })
})

app.use((error, request, response, next) => {
  if (error.type === 'entity.parse.failed') {
    return response.status(400).json({ error: 'Request body must be valid JSON' })
  }
  if (error.type === 'entity.too.large') {
    return response.status(413).json({ error: 'Request body is too large' })
  }
  console.error(error)
  response.status(500).json({ error: 'Something went wrong on the server' })
})

const port = process.env.PORT || 3000

app.listen(port, () => {
  console.log(`API listening on http://localhost:${port}`)
  console.log(`CORS allows: ${allowedOrigins.join(', ')}`)
})
