import { Link } from 'react-router-dom'
import { RESUME_URL } from '../links.js'

export default function HomePanel() {
  return (
    <section className="panel">
      <p className="mono muted">HOME // BOOT COMPLETE</p>
      <h1>JCDC0</h1>
      <p className="lede">Computer science student building games, tools and web apps.</p>
      <div className="actions">
        <Link to="/projects" className="button">View projects</Link>
        <Link to="/about" className="button secondary">About</Link>
        <a href={RESUME_URL} className="button secondary" target="_blank" rel="noreferrer">Resume</a>
        <Link to="/contact" className="button secondary">Contact</Link>
      </div>
    </section>
  )
}
