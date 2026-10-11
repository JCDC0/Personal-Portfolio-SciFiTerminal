import * as THREE from 'three'
import { CSS3DObject } from 'three/addons/renderers/CSS3DRenderer.js'

const LINE_HEIGHT = 18
const TYPE_SPEED = 45

const SCRIPTS = [
  () => ({
    title: 'todo.list --owner=ai',
    lines: ['[ ] verify session token', '[ ] index /srv/records', '[ ] compress /mnt/archive', '[ ] answer relay ping', '[ ] audit /sys/keys'],
    after: 'sort',
  }),
  () => ({
    title: 'sort records --by=weight',
    bars: Array.from({ length: 9 }, () => 12 + Math.floor(Math.random() * 60)),
  }),
  () => ({
    title: 'nano /etc/relay/route.py',
    lines: ['def route(packet):', '    node = core.nearest(packet)', '    return node.dispatch(packet)', '', 'saved route.py  [4 lines]'],
  }),
  () => ({
    title: 'mv --batch /tmp/*.log',
    lines: ['/tmp/session_04.log -> /var/log  OK', '/tmp/session_05.log -> /var/log  OK', '/tmp/relay.dump -> /mnt/archive  OK', '3 files moved'],
  }),
  () => ({
    title: 'scan /srv/records',
    lines: ['record 001 ... relevant', 'record 002 ... relevant', 'record 003 ... relevant', 'threat level: 0', 'scan complete'],
  }),
]

function spawn(scene, radius, script) {
  const element = document.createElement('div')
  element.className = 'vm-term'
  const title = document.createElement('div')
  title.className = 'vm-term-title'
  title.textContent = `> ${script.title}`
  const body = document.createElement('div')
  body.className = 'vm-term-body'
  element.append(title, body)

  const lines = (script.lines ?? []).map((text, index) => {
    const line = document.createElement('div')
    line.className = 'vm-term-line'
    line.style.top = `${index * LINE_HEIGHT}px`
    body.append(line)
    return { element: line, text, order: index }
  })

  const bars = (script.bars ?? []).map((value, index) => {
    const bar = document.createElement('div')
    bar.className = 'vm-term-bar'
    bar.style.height = `${value}px`
    bar.style.left = `${index * 22}px`
    body.append(bar)
    return { element: bar, value }
  })

  body.style.height = `${bars.length ? 80 : Math.max(1, lines.length) * LINE_HEIGHT}px`

  const direction = new THREE.Vector3(Math.random() * 2 - 1, (Math.random() * 2 - 1) * 0.7, Math.random() * 2 - 1).normalize()
  const object = new CSS3DObject(element)
  object.position.copy(direction.multiplyScalar(radius * (1.55 + Math.random() * 0.6)))
  scene.add(object)

  return {
    object,
    element,
    lines,
    bars,
    after: script.after,
    born: performance.now(),
    phase: 'type',
    phaseStart: performance.now(),
    sortPass: 0,
    sortIndex: 0,
    swaps: 0,
    checked: 0,
  }
}

export function startTerminals({ scene, onActivity, radius }) {
  const live = []
  let nextSpawn = performance.now() + 1500
  let order = Math.floor(Math.random() * SCRIPTS.length)

  function close(term) {
    term.element.classList.add('is-closing')
    term.phase = 'closing'
    term.phaseStart = performance.now()
  }

  function update(now, camera) {
    if (now > nextSpawn && live.length < 3) {
      nextSpawn = now + 2500 + Math.random() * 3000
      order = (order + 1) % SCRIPTS.length
      live.push(spawn(scene, radius, SCRIPTS[order]()))
      onActivity('terminal')
    }

    for (let i = live.length - 1; i >= 0; i--) {
      const term = live[i]
      term.object.quaternion.copy(camera.quaternion)
      const elapsed = now - term.phaseStart

      if (term.phase === 'type') {
        if (term.bars.length) {
          term.phase = 'bars'
          term.phaseStart = now
          continue
        }
        let budget = Math.floor((elapsed / 1000) * TYPE_SPEED)
        let done = true
        term.lines.forEach((line) => {
          const shown = Math.min(line.text.length, Math.max(0, budget))
          budget -= line.text.length
          line.element.textContent = line.text.slice(0, shown)
          if (shown < line.text.length) done = false
        })
        if (done) {
          term.phase = term.after === 'sort' ? 'sort' : 'hold'
          term.phaseStart = now
        }
      } else if (term.phase === 'sort' && elapsed > 600) {
        const sorted = [...term.lines].sort((a, b) => a.text.slice(4).localeCompare(b.text.slice(4)))
        sorted.forEach((line, index) => { line.element.style.top = `${index * LINE_HEIGHT}px` })
        term.lines = sorted
        term.phase = 'check'
        term.phaseStart = now
        onActivity('sort')
      } else if (term.phase === 'check' && elapsed > 700 + term.checked * 320) {
        const line = term.lines[term.checked]
        if (line) {
          line.text = line.text.replace('[ ]', '[x]')
          line.element.textContent = line.text
          line.element.classList.add('is-done')
          term.checked += 1
        } else {
          term.phase = 'hold'
          term.phaseStart = now
        }
      } else if (term.phase === 'bars' && elapsed > 160) {
        term.phaseStart = now
        const limit = term.bars.length - 1 - term.sortPass
        if (limit <= 0) {
          term.bars.forEach((bar) => bar.element.classList.add('is-done'))
          term.phase = 'hold'
          onActivity('sort')
          continue
        }
        const a = term.bars[term.sortIndex]
        const b = term.bars[term.sortIndex + 1]
        a.element.classList.add('is-active')
        b.element.classList.add('is-active')
        setTimeout(() => {
          a.element.classList.remove('is-active')
          b.element.classList.remove('is-active')
        }, 150)
        if (a.value > b.value) {
          term.bars[term.sortIndex] = b
          term.bars[term.sortIndex + 1] = a
          term.bars.forEach((bar, index) => { bar.element.style.left = `${index * 22}px` })
        }
        term.sortIndex += 1
        if (term.sortIndex >= limit) {
          term.sortIndex = 0
          term.sortPass += 1
        }
      } else if (term.phase === 'hold' && elapsed > 1800) {
        close(term)
      } else if (term.phase === 'closing' && elapsed > 400) {
        scene.remove(term.object)
        term.element.remove()
        live.splice(i, 1)
      }
    }
  }

  function dispose() {
    live.forEach((term) => {
      scene.remove(term.object)
      term.element.remove()
    })
    live.length = 0
  }

  return { update, dispose }
}
