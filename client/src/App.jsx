import { lazy, Suspense, useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'
import DemoNotice from './components/DemoNotice.jsx'
import HomePanel from './pages/HomePanel.jsx'
import ProjectsPanel from './pages/ProjectsPanel.jsx'
import ProjectDetailPanel from './pages/ProjectDetailPanel.jsx'
import AboutPanel from './pages/AboutPanel.jsx'
import ContactPanel from './pages/ContactPanel.jsx'
import NotFoundPanel from './pages/NotFoundPanel.jsx'
import { useMediaQuery } from './hooks.js'

const VoidSpace = lazy(() => import('./void/VoidSpace.jsx'))

function supportsWebGL() {
  try {
    const canvas = document.createElement('canvas')
    return Boolean(canvas.getContext('webgl2') || canvas.getContext('webgl'))
  } catch {
    return false
  }
}

function PlainSite() {
  return (
    <main>
      <DemoNotice />
      <Routes>
        <Route path="/" element={<HomePanel />} />
        <Route path="/projects" element={<ProjectsPanel />} />
        <Route path="/projects/:id" element={<ProjectDetailPanel />} />
        <Route path="/about" element={<AboutPanel />} />
        <Route path="/contact" element={<ContactPanel />} />
        <Route path="*" element={<NotFoundPanel />} />
      </Routes>
    </main>
  )
}

export default function App() {
  const wide = useMediaQuery('(min-width: 769px)')
  const [webgl] = useState(supportsWebGL)

  return (
    <div className="page">
      <Header />
      {wide && webgl
        ? (
          <Suspense fallback={<div className="void-loading mono">[ CONNECTING... ]</div>}>
            <VoidSpace />
          </Suspense>
        )
        : <PlainSite />}
      <Footer />
    </div>
  )
}
