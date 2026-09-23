import { Link } from 'react-router-dom'

export default function NotFoundPanel() {
  return (
    <section className="panel">
      <p className="mono muted">ERROR // 404</p>
      <h1>Nothing here</h1>
      <p><Link to="/">Back home</Link></p>
    </section>
  )
}
