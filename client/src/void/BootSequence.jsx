import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { playGarble } from '../sound.js'

const LINES = [
  'VM-2215 BIOS 6.0 // POWER ON SELF TEST ... OK',
  'MOUNT /sys ... OK',
  'MOUNT /srv/records ... OK',
  'LOAD neural_core.bin [1,024 NODES] ... OK',
  'LINK relay -> owner node ... OBFUSCATED',
  'INDEX projects ... OK',
  'SPAWN workspace home ... OK',
  'SPAWN workspace profile ... OK',
  'SPAWN workspace contact ... OK',
  'AUTH session ... VERIFIED',
  'START core.observe() ...',
]

const CONNECT_MS = 1100
const LINE_MS = 170
const FADE_MS = 700

export default function BootSequence({ onLeave, onDone }) {
  const [shown, setShown] = useState(0)
  const [leaving, setLeaving] = useState(false)

  useEffect(() => {
    const timers = LINES.map((_, index) =>
      setTimeout(() => {
        setShown(index + 1)
        if (index % 3 === 0) playGarble('boot')
      }, CONNECT_MS + index * LINE_MS)
    )
    const end = CONNECT_MS + LINES.length * LINE_MS + 500
    timers.push(setTimeout(() => {
      setLeaving(true)
      onLeave()
    }, end))
    timers.push(setTimeout(onDone, end + FADE_MS))
    return () => timers.forEach(clearTimeout)
  }, [onLeave, onDone])

  return createPortal(
    <div className={`boot${leaving ? ' is-leaving' : ''}`} role="status" aria-label="Connecting to the portfolio">
      <div className="boot-box mono">{shown === LINES.length ? '[ CONNECTED ]' : '[ CONNECTING... ]'}</div>
      <ol className="boot-lines mono" aria-hidden="true">
        {LINES.slice(0, shown).map((line) => <li key={line}>{line}</li>)}
      </ol>
      <button type="button" className="secondary boot-skip" onClick={() => { onLeave(); onDone() }}>Skip</button>
    </div>,
    document.body
  )
}
