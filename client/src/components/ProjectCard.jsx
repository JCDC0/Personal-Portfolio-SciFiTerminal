import { Link } from 'react-router-dom'
import ProjectThumbs from './ProjectThumbs.jsx'

export default function ProjectCard({ project }) {
  return (
    <li className="card project-card">
      <ProjectThumbs project={project} className="card-image" />
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
