import { Link } from 'react-router-dom'

export default function HomePanel() {
  return (
    <section className="panel">
      <p className="mono muted">HOME // BOOT COMPLETE</p>
      <h1>JCDC0</h1>
      <p className="lede">Computer science student building games, tools and web apps.</p>
      <div className="actions">
        <Link to="/projects" className="button">View projects</Link>
        <Link to="/contact" className="button secondary">Contact</Link>
      </div>
    </section>
  )
}
