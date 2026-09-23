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

export default function App() {
  return (
    <div className="page">
      <Header />
      <DemoNotice />
      <main>
        <Routes>
          <Route path="/" element={<HomePanel />} />
          <Route path="/projects" element={<ProjectsPanel />} />
          <Route path="/projects/:id" element={<ProjectDetailPanel />} />
          <Route path="/about" element={<AboutPanel />} />
          <Route path="/contact" element={<ContactPanel />} />
          <Route path="*" element={<NotFoundPanel />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}
