import { useCallback, useEffect, useState } from 'react'
import { listProjects } from './api'

export function useProjects() {
  const [status, setStatus] = useState('loading')
  const [projects, setProjects] = useState([])
  const [error, setError] = useState(null)
  const [slow, setSlow] = useState(false)

  const load = useCallback(async () => {
    setStatus('loading')
    setError(null)
    const timer = setTimeout(() => setSlow(true), 3000)
    try {
      setProjects(await listProjects())
      setStatus('ready')
    } catch (caught) {
      setError(caught)
      setStatus('error')
    } finally {
      clearTimeout(timer)
      setSlow(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  return { status, projects, error, slow, load }
}
