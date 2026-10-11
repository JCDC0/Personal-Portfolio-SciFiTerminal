import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Link, matchPath, useLocation, useNavigate } from 'react-router-dom'
import HomePanel from '../pages/HomePanel.jsx'
import AboutPanel from '../pages/AboutPanel.jsx'
import ContactPanel from '../pages/ContactPanel.jsx'
import NotFoundPanel from '../pages/NotFoundPanel.jsx'
import ProjectDetailPanel from '../pages/ProjectDetailPanel.jsx'
import DemoNotice from '../components/DemoNotice.jsx'
import { useMediaQuery } from '../hooks.js'
import { musicLevel, playGarble, playLock, playMove, playOpen } from '../sound.js'
import { useProjects } from '../useProjects.js'
import { createWorld } from './world.js'
import { WORKSPACES, workspaceFor } from './layout.js'
import { dbId } from './records.js'
import BootSequence from './BootSequence.jsx'
import ProjectStack from './ProjectStack.jsx'
import RecordCard from './RecordCard.jsx'
import VoidHud from './VoidHud.jsx'

const BOOT_KEY = 'portfolio:booted'
const SCAN_MS = 4000
const TYPE_MS = 28
const FRAME_CODES = {
  home: 'SEC-01 // HOME TERMINAL // 0x08A9',
  projects: 'SEC-02 // RECORDS // 0x2215',
  detail: 'SEC-02A // RECORD VIEWER // 0x2216',
  about: 'SEC-03 // PROFILE // 0x1F40',
  contact: 'SEC-04 // RELAY // 0x7C21',
  missing: 'SEC-404 // NULL SECTOR // 0x0000',
}

function bootedThisVisit() {
  try {
    return sessionStorage.getItem(BOOT_KEY) === '1'
  } catch {
    return false
  }
}

function Typed({ text, instant }) {
  const [count, setCount] = useState(instant ? text.length : 0)

  useEffect(() => {
    if (instant) {
      setCount(text.length)
      return
    }
    setCount(0)
    let typed = 0
    const timer = setInterval(() => {
      typed += 1
      setCount(typed)
      if (typed >= text.length) clearInterval(timer)
    }, TYPE_MS)
    return () => clearInterval(timer)
  }, [text, instant])

  return text.slice(0, count)
}

function Guide({ label, state, detail, instant, children }) {
  const text = state === 'online' ? `${label} // ${detail ?? 'ONLINE'}` : `Loading ${label}...`
  return (
    <div className={`ws-tag is-${state}`}>
      <div className="ws-tag-row" aria-hidden="true">
        <span className="ws-tag-dot" />
        <span className="ws-tag-prompt">&gt;</span>
        <span><Typed text={text} instant={instant} /><span className="ws-tag-caret" /></span>
      </div>
      {children}
    </div>
  )
}

export default function VoidSpace() {
  const glRef = useRef(null)
  const cssRef = useRef(null)
  const pointerDown = useRef(false)
  const previousFocus = useRef(null)
  const lastFocus = useRef(0)
  const scanDirection = useRef(1)
  const location = useLocation()
  const navigate = useNavigate()
  const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')
  const [world, setWorld] = useState(null)
  const [booting, setBooting] = useState(() => !reducedMotion && !bootedThisVisit())
  const [arrived, setArrived] = useState(null)
  const [focus, setFocus] = useState(null)
  const [scanning, setScanning] = useState(!reducedMotion)
  const [cards, setCards] = useState([])
  const { status, projects, error, slow, load } = useProjects()

  const name = workspaceFor(location.pathname)
  const detailMatch = matchPath('/projects/:id', location.pathname)
  const routeId = detailMatch?.params.id ?? null
  const [detailId, setDetailId] = useState(routeId)
  const count = status === 'ready' ? projects.length : 0

  useEffect(() => {
    if (routeId) setDetailId(routeId)
  }, [routeId])

  useEffect(() => {
    const instance = createWorld({
      gl: glRef.current,
      css: cssRef.current,
      reducedMotion,
      built: !booting,
      onActivity: (kind) => playGarble(kind),
      level: musicLevel,
    })
    setWorld(instance)
    document.body.classList.add('immersive')
    return () => {
      instance.dispose()
      document.body.classList.remove('immersive')
      setWorld(null)
    }
  }, [])

  useEffect(() => {
    if (world) setCards(world.setCards(count))
  }, [world, count])

  const startCore = useCallback(() => {
    if (world) world.build()
  }, [world])

  const finishBoot = useCallback(() => {
    try {
      sessionStorage.setItem(BOOT_KEY, '1')
    } catch {}
    setBooting(false)
  }, [])

  useEffect(() => {
    if (!world || booting) return
    world.build()
    setArrived(null)
    let live = true
    playMove()
    world.flyTo({ name }).then(() => {
      if (!live) return
      setArrived(name)
      playLock()
    })
    return () => {
      live = false
    }
  }, [world, booting, name])

  useEffect(() => {
    if (name === 'projects') return
    setFocus(null)
    previousFocus.current = null
  }, [name])

  useEffect(() => {
    if (arrived !== 'projects' || status !== 'ready' || projects.length === 0) return
    const timer = setTimeout(
      () => setFocus((value) => value ?? Math.min(lastFocus.current, projects.length - 1)),
      reducedMotion ? 0 : 600
    )
    return () => clearTimeout(timer)
  }, [arrived, status, projects.length, reducedMotion])

  useEffect(() => {
    if (!world || focus === null || name !== 'projects') return
    lastFocus.current = focus
    const from = previousFocus.current
    previousFocus.current = focus
    playMove()
    let live = true
    world.flyTo({ name: 'projects', row: focus }, { duration: from === null ? 900 : 650 }).then(() => {
      if (live) playLock()
    })
    return () => {
      live = false
    }
  }, [world, focus])

  useEffect(() => {
    if (!scanning || reducedMotion || focus === null || name !== 'projects') return
    const timer = setTimeout(() => {
      let next = focus + scanDirection.current
      if (next < 0 || next >= projects.length) {
        scanDirection.current = -scanDirection.current
        next = focus + scanDirection.current
      }
      setFocus(Math.min(projects.length - 1, Math.max(0, next)))
    }, SCAN_MS)
    return () => clearTimeout(timer)
  }, [scanning, reducedMotion, focus, name, projects.length])

  const step = useCallback((direction) => {
    if (!projects.length) return
    setScanning(false)
    setFocus((value) => ((value ?? 0) + direction + projects.length) % projects.length)
  }, [projects.length])

  const open = useCallback((index) => {
    playOpen()
    navigate(`/projects/${projects[index].id}`)
  }, [navigate, projects])

  useEffect(() => {
    if (name !== 'projects') return
    function onKey(event) {
      if (event.target.closest('input, textarea')) return
      if (event.key === 'ArrowDown' || event.key === 'ArrowRight') { event.preventDefault(); step(1) }
      if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') { event.preventDefault(); step(-1) }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [name, step])

  function handleCardClick(event, index) {
    event.preventDefault()
    pointerDown.current = false
    setScanning(false)
    if (index === focus) open(index)
    else setFocus(index)
  }

  function handleCardFocus(index) {
    if (pointerDown.current) return
    setScanning(false)
    setFocus(index)
  }

  function panel(key, content, anchor = world?.anchors[key], portalKey = key, framed = true) {
    if (!world || !anchor) return null
    const active = key === name
    return createPortal(
      <div
        className={`ws-panel${framed ? ' is-framed' : ''}${active ? ' is-active' : ''}`}
        data-code={framed ? FRAME_CODES[key] : undefined}
        aria-hidden={!active}
        inert={active ? undefined : ''}
      >
        {framed && (
          <div className="panel-tech" aria-hidden="true">
            <span>NODE {key.toUpperCase()} // SYNC OK</span>
            <span className="panel-meter" />
          </div>
        )}
        {content}
      </div>,
      anchor,
      portalKey
    )
  }

  const focused = name === 'projects' && focus !== null ? projects[focus] : null
  const online = arrived === name
  let guideDetail = null
  if (name === 'projects' && focused) guideDetail = `${dbId(focused)} LOCKED`
  if (name === 'detail' && detailId) guideDetail = `DB-${String(detailId).padStart(3, '0')}`

  return (
    <main className="void">
      <div ref={glRef} className="void-gl" aria-hidden="true" />
      <div ref={cssRef} className="void-css" />

      {panel('home', <HomePanel />)}
      {panel('about', <AboutPanel />)}
      {panel('contact', <ContactPanel />)}
      {panel('missing', <NotFoundPanel />)}
      {panel('detail', detailId
        ? <ProjectDetailPanel key={detailId} id={detailId} embedded />
        : <section className="panel"><p className="mono muted">RECORD VIEWER // IDLE</p><h1>No record open</h1></section>)}
      {panel('projects', <ProjectStack status={status} count={count} error={error} slow={slow} load={load} />)}
      {count > 0 && cards.slice(0, count).map((anchor, index) => panel('projects', (
        <RecordCard
          project={projects[index]}
          index={index}
          total={count}
          active={index === focus}
          onClick={(event) => handleCardClick(event, index)}
          onFocus={() => handleCardFocus(index)}
          onPointer={() => { pointerDown.current = true }}
        />
      ), anchor, `card-${projects[index].id}`, false))}

      {world && name === 'projects' && count > 0 && createPortal(
        <div className="vm-controls">
          <button type="button" className="secondary" onClick={() => step(-1)}>&lsaquo; Prev record</button>
          <button type="button" className="secondary" onClick={() => step(1)}>Next record &rsaquo;</button>
          <button type="button" className="secondary" aria-pressed={scanning} onClick={() => setScanning(!scanning)}>
            Auto-scan: {scanning ? 'on' : 'off'}
          </button>
          <button type="button" disabled={focus === null} onClick={() => open(focus)}>Open record</button>
        </div>,
        world.controls
      )}

      {world && !booting && createPortal(
        <Guide label={WORKSPACES[name].label} state={online ? 'online' : 'loading'} detail={guideDetail} instant={reducedMotion}>
          {online && name === 'detail' && (
            <Link to="/projects" className="button secondary ws-tag-action" onClick={() => playMove()}>
              &lsaquo; Back to projects
            </Link>
          )}
          {online && name === 'missing' && (
            <Link to="/" className="button secondary ws-tag-action">Return home</Link>
          )}
        </Guide>,
        world.guide
      )}

      {!booting && <VoidHud name={name} project={focused} index={focus} total={projects.length} />}

      <div className="void-notice"><DemoNotice /></div>

      {booting && <BootSequence onLeave={startCore} onDone={finishBoot} />}
    </main>
  )
}
