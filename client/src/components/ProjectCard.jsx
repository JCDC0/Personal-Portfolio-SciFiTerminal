import { Link } from 'react-router-dom'

export default function ProjectCard({ project }) {
  return (
    <li className="card project-card">
      <Link to={`/projects/${project.id}`}>
        <h3>{project.title}</h3>
      </Link>
      {project.summary
        ? <p>{project.summary}</p>
        : <p className="muted">No summary yet.</p>}
      {project.tech.length > 0 && (
        <ul className="tags">
          {project.tech.map((tag) => <li key={tag} className="tag">{tag}</li>)}
        </ul>
      )}
    </li>
  )
}
