import { useClock } from '../hooks.js'
import { dbId, recordPath, recordStatus } from './records.js'
import { WORKSPACES } from './layout.js'

function pad(value) {
  return String(value).padStart(2, '0')
}

function stamp(date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`
}

export default function VoidHud({ name, project, index, total }) {
  const now = useClock()
  const status = project && recordStatus(project)

  return (
    <div className="hud void-hud" aria-hidden="true">
      <div className="hud-frame" />
      <div className="hud-tl">
        <div>{project ? dbId(project) : `VM-2215 // ${WORKSPACES[name].label.toUpperCase()}`}</div>
        <div className="hud-dim">
          {project ? `PROJECT RECORDS // RECORD ${index + 1} OF ${total}` : 'WORKSPACE MOUNTED'}
        </div>
      </div>
      <div className="hud-tr">
        <div className="session">SESSION ACTIVE</div>
        <div className="hud-dim">{stamp(now)}</div>
      </div>
      {project && (
        <div key={project.id} className="hud-subject">
          <div className="hud-subject-title">RECORD: {project.title}</div>
          <div className="hud-dim">PATH: {recordPath(project)}</div>
          <div className="hud-subject-row">
            <span className="hud-chip">STATUS:</span>
            <span className={`status-${status.tone}`}>{status.label}</span>
          </div>
          {project.tech.length > 0 && <div className="hud-dim">ASSETS: {project.tech.join(' / ')}</div>}
        </div>
      )}
      <div className="void-hint">Drag empty space to look around</div>
    </div>
  )
}
