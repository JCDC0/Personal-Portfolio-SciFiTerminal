import { useEffect, useState } from 'react'
import { listProjects } from '../api'
import ProjectCard from '../components/ProjectCard.jsx'
import SurveillanceWall from '../components/SurveillanceWall.jsx'
import { useMediaQuery } from '../hooks.js'

export default function ProjectsPanel() {
  const wide = useMediaQuery('(min-width: 769px)')
  const [status, setStatus] = useState('loading')
  const [projects, setProjects] = useState([])
  const [error, setError] = useState(null)
  const [slow, setSlow] = useState(false)

  async function load() {
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
  }

  useEffect(() => {
    load()
  }, [])

  if (status === 'ready' && projects.length > 0 && wide) {
    return (
      <section className="stage" aria-labelledby="projects-title">
        <h1 id="projects-title" className="sr-only">Projects</h1>
        <SurveillanceWall projects={projects} />
      </section>
    )
  }

  return (
    <section className="panel">
      <p className="mono muted">PROJECTS // {status === 'ready' ? `${projects.length} FOUND` : status.toUpperCase()}</p>
      <h1>Projects</h1>

      {status === 'loading' && (
        <p className="muted">
          Loading{slow ? '. The server may be waking up, which can take up to a minute.' : '...'}
        </p>
      )}

      {status === 'error' && (
        <p className="error" role="alert">
          {error.message} <button onClick={load}>Try again</button>
        </p>
      )}

      {status === 'ready' && projects.length === 0 && (
        <p className="muted">No projects to show yet.</p>
      )}

      {status === 'ready' && projects.length > 0 && (
        <ul className="list project-grid">
          {projects.map((project) => <ProjectCard key={project.id} project={project} />)}
        </ul>
      )}
    </section>
  )
}
