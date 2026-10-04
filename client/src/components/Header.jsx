import { Link, NavLink } from 'react-router-dom'
import SoundToggle from './SoundToggle.jsx'

const LINKS = [
  { to: '/', label: 'Home', end: true },
  { to: '/projects', label: 'Projects' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
]

export default function Header() {
  return (
    <header className="site-header">
      <Link to="/" className="logo">JCDC0</Link>
      <div className="header-right">
        <nav aria-label="Main">
          {LINKS.map((link) => (
            <NavLink key={link.to} to={link.to} end={link.end}>
              {link.label}
            </NavLink>
          ))}
        </nav>
        <SoundToggle />
      </div>
    </header>
  )
}
