import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="site-footer">
      <span className="mono">STATUS: ONLINE</span>
      <nav aria-label="Footer">
        <a href="https://github.com/JCDC0" target="_blank" rel="noreferrer">GitHub</a>
        <Link to="/contact">Contact</Link>
      </nav>
    </footer>
  )
}
