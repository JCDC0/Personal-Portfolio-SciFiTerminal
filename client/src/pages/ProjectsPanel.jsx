import ProjectCard from '../components/ProjectCard.jsx'
import { useProjects } from '../useProjects.js'

export default function ProjectsPanel() {
  const { status, projects, error, slow, load } = useProjects()

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
