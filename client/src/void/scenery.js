import * as THREE from 'three'
import { BLUE, RED, WHITE, YELLOW, easeInOut, lineMaterial, seeded, textSprite } from './sprites.js'

const LATTICE_STEP = 2400
const LATTICE_CELLS = 6
const TRACE_TEXT = [
  ['PROBABILITY 0.42%', 'rgba(255,42,42,.9)', '#fff'],
  ['THREAT: NON-RELEVANT', 'rgba(229,255,0,.9)', '#000'],
  ['ASSET 12.6%', 'rgba(229,255,0,.9)', '#000'],
  ['RECLASSIFICATION', 'rgba(255,255,255,.85)', '#000'],
  ['ANOMALY 3.91%', 'rgba(255,42,42,.9)', '#fff'],
  ['RELAY 0.07%', 'rgba(61,123,255,.9)', '#fff'],
  ['INDEX MATCH 88%', 'rgba(255,255,255,.85)', '#000'],
  ['ADMIN 2.15%', 'rgba(229,255,0,.9)', '#000'],
  ['SIGNAL LOST', 'rgba(255,42,42,.9)', '#fff'],
  ['ROUTE 14.0%', 'rgba(61,123,255,.9)', '#fff'],
]
const TRACE_COLORS = [RED, RED, YELLOW, YELLOW, BLUE, WHITE]

function randomDirection(next, flatten = 1) {
  return new THREE.Vector3(next() * 2 - 1, (next() * 2 - 1) * flatten, next() * 2 - 1).normalize()
}

function thumbTexture(next) {
  const canvas = document.createElement('canvas')
  canvas.width = 64
  canvas.height = 44
  const context = canvas.getContext('2d')
  context.fillStyle = '#0d0d0d'
  context.fillRect(0, 0, 64, 44)
  for (let i = 0; i < 7; i++) {
    const shade = Math.floor(40 + next() * 140)
    context.fillStyle = `rgb(${shade},${shade},${shade})`
    context.fillRect(next() * 56, next() * 36, 6 + next() * 24, 4 + next() * 16)
  }
  context.strokeStyle = 'rgba(255,255,255,.75)'
  context.lineWidth = 2
  context.strokeRect(1, 1, 62, 42)
  return new THREE.CanvasTexture(canvas)
}

function folderTexture() {
  const canvas = document.createElement('canvas')
  canvas.width = 64
  canvas.height = 44
  const context = canvas.getContext('2d')
  context.fillStyle = '#0d0d0d'
  context.strokeStyle = 'rgba(255,255,255,.8)'
  context.lineWidth = 2
  context.beginPath()
  context.moveTo(2, 42)
  context.lineTo(2, 4)
  context.lineTo(24, 4)
  context.lineTo(30, 10)
  context.lineTo(62, 10)
  context.lineTo(62, 42)
  context.closePath()
  context.fill()
  context.stroke()
  context.fillStyle = 'rgba(255,255,255,.35)'
  context.fillRect(8, 18, 30, 3)
  context.fillRect(8, 26, 20, 3)
  return new THREE.CanvasTexture(canvas)
}

function ringTexture() {
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = 64
  const context = canvas.getContext('2d')
  context.strokeStyle = 'rgba(255,255,255,.9)'
  context.lineWidth = 2
  context.beginPath()
  context.arc(32, 32, 26, 0, Math.PI * 2)
  context.stroke()
  context.fillStyle = 'rgba(255,255,255,.9)'
  context.beginPath()
  context.arc(32, 32, 5, 0, Math.PI * 2)
  context.fill()
  return new THREE.CanvasTexture(canvas)
}

function growFilament(next, start, direction, length, depth, out) {
  const points = [start.clone()]
  const heading = direction.clone()
  let point = start.clone()
  let travelled = 0
  while (travelled < length) {
    heading.add(randomDirection(next, 0.5).multiplyScalar(0.55)).normalize()
    const step = 500 + next() * 700
    point = point.clone().add(heading.clone().multiplyScalar(step))
    travelled += step
    points.push(point)
    if (depth < 2 && next() < 0.3) {
      const branch = heading.clone().add(randomDirection(next).multiplyScalar(1.1)).normalize()
      growFilament(next, point, branch, length * (0.3 + next() * 0.3), depth + 1, out)
    }
  }
  out.push({ points, depth })
}

function buildFilaments(next, texture, coreRadius) {
  const strands = []
  for (let i = 0; i < 8; i++) {
    const direction = randomDirection(next, 0.5)
    growFilament(next, direction.clone().multiplyScalar(coreRadius * 0.9), direction, 4500 + next() * 3500, 0, strands)
  }
  for (let i = 0; i < 5; i++) {
    const start = randomDirection(next, 0.4).multiplyScalar(7000 + next() * 4000)
    growFilament(next, start, randomDirection(next, 0.5), 3000 + next() * 3000, 1, strands)
  }

  const spine = []
  const dust = []
  const shades = []
  const anchors = []
  const vertices = []
  strands.forEach(({ points, depth }) => {
    const spread = 26 / (depth + 1)
    points.forEach((point, index) => {
      vertices.push(point.x, point.y, point.z)
      if (index === 0) return
      const from = points[index - 1]
      spine.push(from.x, from.y, from.z, point.x, point.y, point.z)
      const count = Math.floor(from.distanceTo(point) / 18)
      for (let k = 0; k < count; k++) {
        const along = from.clone().lerp(point, next())
        const offset = randomDirection(next).multiplyScalar(spread * next())
        dust.push(along.x + offset.x, along.y + offset.y, along.z + offset.z)
        const shade = 0.3 + next() * 0.5
        shades.push(shade, shade, shade)
      }
      anchors.push(point)
    })
  })

  const group = new THREE.Group()
  const spineGeometry = new THREE.BufferGeometry()
  spineGeometry.setAttribute('position', new THREE.Float32BufferAttribute(spine, 3))
  group.add(new THREE.LineSegments(spineGeometry, lineMaterial(WHITE, 0.1)))
  const dustGeometry = new THREE.BufferGeometry()
  dustGeometry.setAttribute('position', new THREE.Float32BufferAttribute(dust, 3))
  dustGeometry.setAttribute('color', new THREE.Float32BufferAttribute(shades, 3))
  group.add(new THREE.Points(dustGeometry, new THREE.PointsMaterial({
    size: 6,
    map: texture,
    vertexColors: true,
    transparent: true,
    opacity: 0.45,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  })))
  const vertexGeometry = new THREE.BufferGeometry()
  vertexGeometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3))
  group.add(new THREE.Points(vertexGeometry, new THREE.PointsMaterial({
    color: WHITE,
    size: 22,
    map: texture,
    transparent: true,
    opacity: 0.55,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  })))
  return { group, anchors }
}

function buildLattice() {
  const group = new THREE.Group()
  const extent = LATTICE_STEP * LATTICE_CELLS
  const segments = []
  for (let a = -LATTICE_CELLS; a <= LATTICE_CELLS; a++) {
    for (let b = -LATTICE_CELLS; b <= LATTICE_CELLS; b++) {
      const u = a * LATTICE_STEP
      const v = b * LATTICE_STEP
      segments.push(-extent, u, v, extent, u, v)
      segments.push(u, -extent, v, u, extent, v)
      segments.push(u, v, -extent, u, v, extent)
    }
  }
  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(segments, 3))
  const material = new THREE.LineBasicMaterial({ color: WHITE, transparent: true, opacity: 0.035, depthWrite: false })
  group.add(new THREE.LineSegments(geometry, material))

  const ticks = []
  const tickSize = 60
  for (let x = -LATTICE_CELLS; x <= LATTICE_CELLS; x++) {
    for (let y = -LATTICE_CELLS; y <= LATTICE_CELLS; y++) {
      for (let z = -LATTICE_CELLS; z <= LATTICE_CELLS; z++) {
        const p = new THREE.Vector3(x, y, z).multiplyScalar(LATTICE_STEP)
        ticks.push(p.x - tickSize, p.y, p.z, p.x + tickSize, p.y, p.z, p.x, p.y - tickSize, p.z, p.x, p.y + tickSize, p.z)
        const far = Math.max(Math.abs(x), Math.abs(y), Math.abs(z))
        if (far >= 3 && (x + y * 3 + z * 5) % 4 === 0 && Math.abs(y) <= 3) {
          const label = textSprite(`${p.x},${p.y},${p.z}`, { color: 'rgba(255,255,255,.4)', scale: 4 })
          label.position.copy(p).add(new THREE.Vector3(0, 110, 0))
          group.add(label)
        }
      }
    }
  }
  const tickGeometry = new THREE.BufferGeometry()
  tickGeometry.setAttribute('position', new THREE.Float32BufferAttribute(ticks, 3))
  group.add(new THREE.LineSegments(tickGeometry, new THREE.LineBasicMaterial({ color: WHITE, transparent: true, opacity: 0.14, depthWrite: false })))
  return group
}

function buildSquares(next, centres, field) {
  const variants = [thumbTexture(next), thumbTexture(next), thumbTexture(next), folderTexture()]
  const geometry = new THREE.PlaneGeometry(1, 1)
  const buckets = variants.map(() => [])
  const dummy = new THREE.Object3D()
  centres.forEach((centre) => {
    dummy.position.copy(centre)
    dummy.lookAt(0, 0, 0)
    const base = dummy.quaternion.clone()
    const count = 3 + Math.floor(next() * 7)
    for (let i = 0; i < count; i++) {
      const size = 40
      const local = new THREE.Vector3(Math.round((next() - 0.5) * 5) * 58, Math.round((next() - 0.5) * 4) * 42, 0).applyQuaternion(base)
      const matrix = new THREE.Matrix4().compose(
        centre.clone().add(local),
        base,
        new THREE.Vector3(size, size * 0.68, 1)
      )
      buckets[Math.floor(next() * 3)].push({ matrix, base: 0.12 + next() * 0.3 })
    }
  })
  field.forEach(({ position, size, folder }) => {
    dummy.position.copy(position)
    dummy.lookAt(0, 0, 0)
    const matrix = new THREE.Matrix4().compose(position, dummy.quaternion.clone(), new THREE.Vector3(size, size * 0.68, 1))
    buckets[folder ? 3 : Math.floor(next() * 3)].push({ matrix, base: 0.08 + next() * 0.2 })
  })

  const meshes = buckets.map((items, index) => {
    const mesh = new THREE.InstancedMesh(geometry, new THREE.MeshBasicMaterial({
      map: variants[index],
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide,
    }), items.length)
    const color = new THREE.Color()
    items.forEach((item, i) => {
      mesh.setMatrixAt(i, item.matrix)
      mesh.setColorAt(i, color.setScalar(item.base))
    })
    mesh.instanceColor.needsUpdate = true
    return { mesh, items, until: new Float32Array(items.length) }
  })
  return meshes
}

function buildWeb(next, nodes) {
  const links = nodes.map(() => new Set())
  nodes.forEach((node, i) => {
    const wanted = i === 0 ? 9 : 2 + Math.floor(next() * 2)
    nodes
      .map((other, j) => ({ j, d: node.distanceToSquared(other) }))
      .filter((entry) => entry.j !== i)
      .sort((a, b) => a.d - b.d)
      .slice(0, wanted)
      .forEach(({ j }) => {
        links[i].add(j)
        links[j].add(i)
      })
  })
  const segments = []
  links.forEach((set, i) => set.forEach((j) => {
    if (j > i) segments.push(nodes[i].x, nodes[i].y, nodes[i].z, nodes[j].x, nodes[j].y, nodes[j].z)
  }))
  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(segments, 3))
  const lines = new THREE.LineSegments(geometry, lineMaterial(WHITE, 0.07))
  return { lines, links: links.map((set) => [...set]) }
}

function makeTrace(next, scene) {
  const color = TRACE_COLORS[Math.floor(next() * TRACE_COLORS.length)]
  const positions = new Float32Array(16 * 3)
  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  const line = new THREE.Line(geometry, new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0, depthWrite: false }))
  line.frustumCulled = false
  const labels = Array.from({ length: 2 }, () => {
    const [text, background, ink] = TRACE_TEXT[Math.floor(next() * TRACE_TEXT.length)]
    const sprite = textSprite(text, { color: ink, background, scale: 1.3 })
    sprite.material.opacity = 0
    scene.add(sprite)
    return sprite
  })
  scene.add(line)
  return { line, labels, positions, count: 0, start: 0, phase: 'idle', wait: next() * 4000 }
}

function placeTrace(trace, anchor, next) {
  const facing = anchor.clone().normalize().negate()
  const u = new THREE.Vector3().crossVectors(facing, new THREE.Vector3(0, 1, 0)).normalize()
  const v = new THREE.Vector3().crossVectors(u, facing).normalize()
  const count = 8 + Math.floor(next() * 8)
  let point = anchor.clone()
  for (let i = 0; i < count; i++) {
    trace.positions[i * 3] = point.x
    trace.positions[i * 3 + 1] = point.y
    trace.positions[i * 3 + 2] = point.z
    const angle = Math.floor(next() * 8) * (Math.PI / 4)
    const step = 90 + Math.floor(next() * 3) * 70
    point = point.clone()
      .add(u.clone().multiplyScalar(Math.cos(angle) * step))
      .add(v.clone().multiplyScalar(Math.sin(angle) * step * 0.7))
  }
  trace.count = count
  trace.line.geometry.setDrawRange(0, count)
  trace.line.geometry.attributes.position.needsUpdate = true
  trace.line.geometry.computeBoundingSphere()
  trace.labels.forEach((label, index) => {
    const at = Math.min(count - 1, 2 + index * 4)
    label.position.set(trace.positions[at * 3], trace.positions[at * 3 + 1] + 40, trace.positions[at * 3 + 2])
  })
}

export function buildScenery({ scene, texture, coreRadius, avoid, fileClusters, reducedMotion }) {
  const next = seeded(4127)
  const clear = (point, distance) => point.length() > coreRadius * 2.4 && avoid.every((p) => p.distanceTo(point) > distance)

  const lattice = buildLattice()
  scene.add(lattice)

  const filaments = buildFilaments(next, texture, coreRadius)
  scene.add(filaments.group)

  const centres = []
  while (centres.length < 46) {
    const point = randomDirection(next, 0.55).multiplyScalar(1800 + next() * 9500)
    if (clear(point, 1200)) centres.push(point)
  }
  filaments.anchors.forEach((point) => {
    if (centres.length < 80 && clear(point, 1200)) centres.push(point.clone().add(randomDirection(next).multiplyScalar(140)))
  })
  const field = []
  const sizes = [22, 32, 46]
  while (field.length < 1500) {
    const point = randomDirection(next, 0.6).multiplyScalar(2400 + next() * 11000)
    if (clear(point, 950)) field.push({ position: point, size: sizes[Math.floor(next() * sizes.length)], folder: next() < 0.18 })
  }
  const fieldLinks = []
  field.forEach((item, i) => {
    if (next() > 0.35) return
    let best = null
    let bestDistance = 1400 * 1400
    field.forEach((other, j) => {
      const distance = j === i ? Infinity : item.position.distanceToSquared(other.position)
      if (distance < bestDistance) {
        bestDistance = distance
        best = other.position
      }
    })
    if (best) fieldLinks.push(item.position.x, item.position.y, item.position.z, best.x, best.y, best.z)
  })
  const fieldGeometry = new THREE.BufferGeometry()
  fieldGeometry.setAttribute('position', new THREE.Float32BufferAttribute(fieldLinks, 3))
  scene.add(new THREE.LineSegments(fieldGeometry, lineMaterial(WHITE, 0.05)))

  const squares = buildSquares(next, centres, field)
  squares.forEach(({ mesh }) => scene.add(mesh))

  const markers = []
  const ring = ringTexture()
  while (markers.length < 26) {
    const point = randomDirection(next, 0.5).multiplyScalar(1600 + next() * 9000)
    if (!clear(point, 1100)) continue
    const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: ring, transparent: true, opacity: 0.3, depthWrite: false }))
    const size = 60 + next() * 70
    sprite.scale.set(size, size, 1)
    sprite.position.copy(point)
    scene.add(sprite)
    markers.push({ sprite, size, seed: next() * 10 })
  }

  const nodes = [new THREE.Vector3(), ...fileClusters, ...centres, ...markers.map((marker) => marker.sprite.position)]
  const web = buildWeb(next, nodes)
  scene.add(web.lines)

  const traces = Array.from({ length: 9 }, () => makeTrace(next, scene))
  const traceAnchors = centres.filter((point) => point.length() < 8000)

  let lastFlicker = 0
  const color = new THREE.Color()

  function update(now) {
    if (reducedMotion) return
    if (now - lastFlicker > 90) {
      lastFlicker = now
      squares.forEach(({ mesh, items, until }) => {
        let changed = false
        for (let n = 0; n < 2; n++) {
          const i = Math.floor(Math.random() * items.length)
          const reveal = Math.random() < 0.35
          mesh.setColorAt(i, reveal ? color.setRGB(1, 1, 0.75) : color.setScalar(0.02))
          until[i] = now + (reveal ? 350 : 1200 + Math.random() * 2400)
          changed = true
        }
        for (let i = 0; i < items.length; i++) {
          if (until[i] && now > until[i]) {
            until[i] = 0
            mesh.setColorAt(i, color.setScalar(items[i].base))
            changed = true
          }
        }
        if (changed) mesh.instanceColor.needsUpdate = true
      })
    }

    markers.forEach((marker) => {
      const pulse = 1 + Math.sin(now / 700 + marker.seed) * 0.12
      marker.sprite.scale.set(marker.size * pulse, marker.size * pulse, 1)
    })

    traces.forEach((trace) => {
      const age = now - trace.start
      if (trace.phase === 'idle' && age > trace.wait) {
        placeTrace(trace, traceAnchors[Math.floor(Math.random() * traceAnchors.length)], Math.random)
        trace.phase = 'draw'
        trace.start = now
        trace.line.material.opacity = 0.85
      } else if (trace.phase === 'draw') {
        const t = Math.min(age / 1400, 1)
        trace.line.geometry.setDrawRange(0, Math.max(2, Math.ceil(easeInOut(t) * trace.count)))
        trace.labels.forEach((label, index) => { label.material.opacity = t > 0.4 + index * 0.25 ? 0.9 : 0 })
        if (t >= 1) {
          trace.phase = 'hold'
          trace.start = now
          trace.wait = 3500 + Math.random() * 5000
        }
      } else if (trace.phase === 'hold' && age > trace.wait) {
        trace.phase = 'fade'
        trace.start = now
      } else if (trace.phase === 'fade') {
        const t = Math.min(age / 700, 1)
        trace.line.material.opacity = 0.85 * (1 - t)
        trace.labels.forEach((label) => { label.material.opacity = 0.9 * (1 - t) })
        if (t >= 1) {
          trace.phase = 'idle'
          trace.start = now
          trace.wait = 800 + Math.random() * 3000
        }
      }
    })
  }

  if (reducedMotion) {
    traces.slice(0, 5).forEach((trace, index) => {
      placeTrace(trace, traceAnchors[index % traceAnchors.length], next)
      trace.line.material.opacity = 0.85
      trace.labels.forEach((label) => { label.material.opacity = 0.9 })
    })
  }

  return { web: { nodes, links: web.links }, update }
}
