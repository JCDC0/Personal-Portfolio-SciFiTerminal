import { Link } from 'react-router-dom'
import ProjectThumbs from '../components/ProjectThumbs.jsx'
import { dbId, recordStatus } from './records.js'

export default function RecordCard({ project, index, total, active, onClick, onFocus, onPointer }) {
  const state = recordStatus(project)

  return (
    <article className={`record-card${active ? ' is-active' : ''}`}>
      <Link
        to={`/projects/${project.id}`}
        className="record-link"
        onPointerDown={onPointer}
        onClick={onClick}
        onFocus={onFocus}
      >
        <ProjectThumbs project={project} className="record-thumbs" />
        <span className="record-body">
          <span className="record-meta mono">
            <span className="record-id">{dbId(project)}</span>
            <span>{index + 1} / {total}</span>
            <span className={`status-${state.tone}`}>{state.label}</span>
          </span>
          <span className="record-title">{project.title}</span>
          {project.summary && <span className="record-summary">{project.summary}</span>}
          {project.tech.length > 0 && <span className="record-tech mono">{project.tech.join(' / ')}</span>}
        </span>
      </Link>
    </article>
  )
}
