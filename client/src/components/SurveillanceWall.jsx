import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { imageUrl } from '../imageUrl.js'
import { useClock, useElementSize, useMediaQuery } from '../hooks.js'

const PLANE_W = 2400
const PLANE_H = 1400
const FEED_W = 360
const FEED_H = 230
const PERSPECTIVE = 1000
const SCAN_MS = 4000
const TRAVEL_MS = 600
const BOOT_MS = 350

const SLOTS = [
  { x: 560, y: 430 },
  { x: 1230, y: 330 },
  { x: 1880, y: 560 },
  { x: 860, y: 1010 },
  { x: 1600, y: 1060 },
  { x: 380, y: 1100 },
  { x: 2050, y: 1120 },
  { x: 1230, y: 720 },
]

let lastFeed = 0

function slotFor(index) {
  return SLOTS[index] ?? { x: 300 + (index % 5) * 450, y: 200 + Math.floor(index / 5) * 330 }
}

function camId(project) {
  return `CAM-${String(project.id).padStart(3, '0')}`
}

function feedStatus(project) {
  if (project.live_url) return { label: 'ONLINE', tone: 'live' }
  if (project.repo_url) return { label: 'SOURCE AVAILABLE', tone: 'open' }
  return { label: 'CLASSIFIED', tone: 'closed' }
}

function seededRandom(seed) {
  let state = seed
  return () => {
    state = (state * 1664525 + 1013904223) % 4294967296
    return state / 4294967296
  }
}

function buildNoise(slots) {
  const next = seededRandom(2215)
  const tiles = []
  const margin = 20
  for (let y = 20; y < PLANE_H - 60; y += 80) {
    for (let x = 20; x < PLANE_W - 110; x += 110) {
      if (next() < 0.35) continue
      const width = Math.round(24 + next() * 70)
      const height = Math.round(width * (0.55 + next() * 0.2))
      const left = Math.round(x + next() * (110 - width))
      const top = Math.round(y + next() * (80 - height))
      const clear = slots.every((slot) =>
        left + width < slot.x - FEED_W / 2 - margin ||
        left > slot.x + FEED_W / 2 + margin ||
        top + height < slot.y - FEED_H / 2 - margin ||
        top > slot.y + FEED_H / 2 + margin
      )
      if (!clear) continue
      const hue = [210, 30, 0][Math.floor(next() * 3)]
      tiles.push({
        key: `${x}-${y}`,
        left,
        top,
        width,
        height,
        depth: -Math.round(next() * 260),
        color: `hsl(${hue} ${Math.round(8 + next() * 17)}% ${Math.round(9 + next() * 22)}%)`,
        flicker: next() < 0.15,
        delay: `${(next() * 2).toFixed(2)}s`,
        label: width > 60 && next() < 0.3 ? `CAM ${1000 + Math.floor(next() * 9000)}` : null,
      })
    }
  }
  return tiles
}

function cameraFor(slot, size, mode) {
  if (!size.width || !size.height) return null
  if (!slot) {
    const scale = Math.min(size.width / PLANE_W, size.height / PLANE_H) * 1.1
    return { x: PLANE_W / 2, y: PLANE_H / 2, scale, tiltX: 4, tiltY: 0 }
  }
  const scale = mode === 'opening'
    ? Math.max(size.width / FEED_W, size.height / FEED_H) * 1.15
    : Math.min((size.width * 0.44) / FEED_W, (size.height * 0.5) / FEED_H)
  return {
    x: slot.x,
    y: slot.y,
    scale,
    tiltX: (slot.y / PLANE_H - 0.5) * -10,
    tiltY: (slot.x / PLANE_W - 0.5) * 16,
  }
}

function cameraTransform(camera) {
  const depth = PERSPECTIVE * (1 - 1 / camera.scale)
  return `translateZ(${depth}px) rotateX(${camera.tiltX}deg) rotateY(${camera.tiltY}deg) translate(${-camera.x}px, ${-camera.y}px)`
}

function pad(value) {
  return String(value).padStart(2, '0')
}

function formatStamp(date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`
}

function Hud({ project, index, total, lockSize, opening }) {
  const now = useClock()
  const status = project && feedStatus(project)

  return (
    <div className="hud" aria-hidden="true">
      <div className="hud-frame" />
      <div className="hud-tl">
        <div>{project ? camId(project) : 'CAM-000'}</div>
        <div className="hud-dim">
          {project ? `PROJECTS WALL // FEED ${index + 1} OF ${total}` : 'ACQUIRING FEEDS...'}
        </div>
      </div>
      <div className="hud-tr">
        <div className="rec">REC</div>
        <div className="hud-dim">{formatStamp(now)}</div>
      </div>
      {project && !opening && (
        <div
          key={index}
          className="hud-lock"
          style={{ width: lockSize.width, height: lockSize.height }}
        />
      )}
      {project && (
        <div key={`subject-${index}`} className="hud-subject">
          <div className="hud-subject-title">SUBJECT: {project.title}</div>
          <div className="hud-subject-row">
            <span className="hud-chip">STATUS:</span>
            <span className={`status-${status.tone}`}>{status.label}</span>
          </div>
          {project.tech.length > 0 && (
            <div className="hud-dim">ASSETS: {project.tech.join(' / ')}</div>
          )}
        </div>
      )}
    </div>
  )
}

export default function SurveillanceWall({ projects }) {
  const navigate = useNavigate()
  const viewportRef = useRef(null)
  const feedRefs = useRef([])
  const openTimer = useRef(null)
  const pointerDown = useRef(false)
  const size = useElementSize(viewportRef)
  const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')

  const [focus, setFocus] = useState(null)
  const [opening, setOpening] = useState(false)
  const [scanning, setScanning] = useState(!reducedMotion)
  const [hovered, setHovered] = useState(false)
  const [keyboardInside, setKeyboardInside] = useState(false)

  const slots = useMemo(() => projects.map((_, index) => slotFor(index)), [projects])
  const noise = useMemo(() => buildNoise(slots), [slots])

  useEffect(() => {
    const start = Math.min(lastFeed, projects.length - 1)
    if (reducedMotion) {
      setFocus(start)
      return
    }
    const timer = setTimeout(() => setFocus(start), BOOT_MS)
    return () => clearTimeout(timer)
  }, [projects.length, reducedMotion])

  useEffect(() => {
    if (focus !== null) lastFeed = focus
  }, [focus])

  useEffect(() => {
    if (!scanning || hovered || keyboardInside || opening || focus === null) return
    const timer = setTimeout(() => setFocus((focus + 1) % projects.length), SCAN_MS)
    return () => clearTimeout(timer)
  }, [scanning, hovered, keyboardInside, opening, focus, projects.length])

  useEffect(() => () => clearTimeout(openTimer.current), [])

  const camera = cameraFor(focus === null ? null : slots[focus], size, opening ? 'opening' : 'focus')
  const focusCamera = focus === null ? null : cameraFor(slots[focus], size, 'focus')
  const lockSize = focusCamera
    ? { width: FEED_W * focusCamera.scale + 24, height: FEED_H * focusCamera.scale + 24 }
    : { width: 0, height: 0 }

  function step(direction) {
    const current = focus ?? 0
    const target = (current + direction + projects.length) % projects.length
    setFocus(target)
    return target
  }

  function open(index) {
    const to = `/projects/${projects[index].id}`
    if (reducedMotion) {
      navigate(to)
      return
    }
    setFocus(index)
    setOpening(true)
    openTimer.current = setTimeout(() => navigate(to), TRAVEL_MS)
  }

  function handleFeedClick(event, index) {
    event.preventDefault()
    pointerDown.current = false
    if (opening) return
    setScanning(false)
    if (index === focus) open(index)
    else setFocus(index)
  }

  function handleFeedFocus(index) {
    if (!pointerDown.current) setFocus(index)
  }

  function handleKeyDown(event) {
    if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return
    event.preventDefault()
    setScanning(false)
    const target = step(event.key === 'ArrowRight' ? 1 : -1)
    feedRefs.current[target]?.focus()
  }

  function handleFocus() {
    if (!pointerDown.current) setKeyboardInside(true)
  }

  function handleBlur(event) {
    if (!event.currentTarget.contains(event.relatedTarget)) setKeyboardInside(false)
  }

  const project = focus === null ? null : projects[focus]

  return (
    <div className="wall">
      <div
        ref={viewportRef}
        className={`wall-viewport${opening ? ' is-opening' : ''}`}
        style={{ perspective: `${PERSPECTIVE}px` }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onKeyDown={handleKeyDown}
        onFocus={handleFocus}
        onBlur={handleBlur}
      >
        <ul
          className="wall-plane list"
          style={{
            width: PLANE_W,
            height: PLANE_H,
            transform: camera ? cameraTransform(camera) : undefined,
            visibility: camera ? 'visible' : 'hidden',
          }}
        >
          <li className="wall-far" aria-hidden="true" />

          {noise.map((tile) => (
            <li
              key={tile.key}
              className={`noise-tile${tile.flicker ? ' flicker' : ''}`}
              aria-hidden="true"
              style={{
                left: tile.left,
                top: tile.top,
                width: tile.width,
                height: tile.height,
                backgroundColor: tile.color,
                transform: `translateZ(${tile.depth}px)`,
                animationDelay: tile.delay,
              }}
            >
              {tile.label && <span>{tile.label}</span>}
            </li>
          ))}

          {projects.map((item, index) => (
            <li
              key={item.id}
              className={`feed${index === focus ? ' is-active' : ''}`}
              style={{
                left: slots[index].x - FEED_W / 2,
                top: slots[index].y - FEED_H / 2,
                width: FEED_W,
                height: FEED_H,
              }}
            >
              <Link
                ref={(element) => { feedRefs.current[index] = element }}
                to={`/projects/${item.id}`}
                onPointerDown={() => { pointerDown.current = true }}
                onClick={(event) => handleFeedClick(event, index)}
                onFocus={() => handleFeedFocus(index)}
              >
                <span className="feed-bar">
                  <span>{camId(item)}</span>
                  <span>{feedStatus(item).label}</span>
                </span>
                <span className="feed-screen">
                  {item.image_url
                    ? <img src={imageUrl(item.image_url)} alt="" loading="lazy" />
                    : <span className="feed-static" />}
                  <span className="feed-caption">
                    <strong>{item.title}</strong>
                    {item.summary && <span>{item.summary}</span>}
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>

        <Hud
          project={project}
          index={focus}
          total={projects.length}
          lockSize={lockSize}
          opening={opening}
        />
      </div>

      <div className="wall-controls">
        <button type="button" className="secondary" onClick={() => { setScanning(false); step(-1) }}>
          &larr; Prev feed
        </button>
        <button type="button" className="secondary" onClick={() => { setScanning(false); step(1) }}>
          Next feed &rarr;
        </button>
        <button
          type="button"
          className="secondary"
          aria-pressed={scanning}
          onClick={() => setScanning(!scanning)}
        >
          Auto-scan: {scanning ? 'on' : 'off'}
        </button>
        <button type="button" disabled={focus === null || opening} onClick={() => open(focus)}>
          Open feed
        </button>
        <span className="hint mono">Click a feed to lock on, click again to open. Arrow keys move the camera.</span>
      </div>
    </div>
  )
}
