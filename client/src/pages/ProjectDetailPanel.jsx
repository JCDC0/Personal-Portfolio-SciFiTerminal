import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getProject } from '../api'

export default function ProjectDetailPanel() {
  const { id } = useParams()
  const [status, setStatus] = useState('loading')
  const [project, setProject] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    let active = true
    setStatus('loading')
    getProject(id)
      .then((found) => {
        if (!active) return
        setProject(found)
        setStatus('ready')
      })
      .catch((caught) => {
        if (!active) return
        setError(caught)
        setStatus(caught.message === 'Not found' ? 'missing' : 'error')
      })
    return () => {
      active = false
    }
  }, [id])

  return (
    <section className="panel">
      <Link to="/projects" className="back">&larr; Back to projects</Link>

      {status === 'loading' && <p className="muted">Loading...</p>}

      {status === 'missing' && (
        <>
          <h1>Project not found</h1>
          <p className="muted">There is no project with id {id}.</p>
        </>
      )}

      {status === 'error' && <p className="error" role="alert">{error.message}</p>}

      {status === 'ready' && (
        <article>
          <p className="mono muted">PROJECT // {String(project.id).padStart(3, '0')}</p>
          <h1>{project.title}</h1>

          <h2>Problem</h2>
          {project.problem ? <p>{project.problem}</p> : <p className="muted">Not written yet.</p>}

          <h2>What I built</h2>
          {project.summary ? <p>{project.summary}</p> : <p className="muted">Not written yet.</p>}

          {project.tech.length > 0 && (
            <ul className="tags">
              {project.tech.map((tag) => <li key={tag} className="tag">{tag}</li>)}
            </ul>
          )}

          <div className="actions">
            {project.live_url && (
              <a className="button" href={project.live_url} target="_blank" rel="noreferrer">Live site</a>
            )}
            {project.repo_url && (
              <a className="button secondary" href={project.repo_url} target="_blank" rel="noreferrer">Source code</a>
            )}
          </div>
        </article>
      )}
    </section>
  )
}
