import * as THREE from 'three'
import { CSS3DObject, CSS3DRenderer } from 'three/addons/renderers/CSS3DRenderer.js'
import { CARD_WIDTH, FOV, PANEL_WIDTH, START_POSITION, WORKSPACES } from './layout.js'
import { startTerminals } from './terminals.js'
import { buildScenery } from './scenery.js'
import { RED, WHITE, YELLOW, easeInOut, glowTexture, lineMaterial, seeded, textSprite } from './sprites.js'

const CORE_RADIUS = 420
const GAP = 36
const FOCUS_DEPTH = 110
const GUIDE_GAP = 90
const PLUG_MS = 380
const SCRAMBLE = 'ABCDEF0123456789#%&=$@*+?XZQ'
const CLUSTER_NAMES = [
  '/sys/core', '/var/log', '/usr/lib', '/tmp', '/home/jcdc0', '/etc/relay',
  '/opt/index', '/sys/keys', '/srv/records', '/var/cache', '/proc/ai', '/mnt/archive',
]

function easeOutBack(t) {
  const c = 1.4
  return 1 + (c + 1) * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2)
}

function buildCore(texture) {
  const next = seeded(2215)
  const points = []
  const surface = 520
  for (let i = 0; i < surface; i++) {
    const y = 1 - (i / (surface - 1)) * 2
    const r = Math.sqrt(1 - y * y)
    const theta = i * 2.399963
    points.push(new THREE.Vector3(Math.cos(theta) * r, y, Math.sin(theta) * r).multiplyScalar(CORE_RADIUS))
  }
  for (let i = 0; i < 380; i++) {
    const direction = new THREE.Vector3(next() * 2 - 1, next() * 2 - 1, next() * 2 - 1).normalize()
    points.push(direction.multiplyScalar(CORE_RADIUS * 0.92 * Math.cbrt(next())))
  }

  const segments = []
  const seen = new Set()
  points.forEach((point, i) => {
    points
      .map((other, j) => ({ j, d: point.distanceToSquared(other) }))
      .filter((entry) => entry.j !== i)
      .sort((a, b) => a.d - b.d)
      .slice(0, 2)
      .forEach(({ j }) => {
        const key = i < j ? `${i}-${j}` : `${j}-${i}`
        if (seen.has(key)) return
        seen.add(key)
        segments.push(point.x, point.y, point.z, points[j].x, points[j].y, points[j].z)
      })
  })

  const group = new THREE.Group()
  const linkGeometry = new THREE.BufferGeometry()
  linkGeometry.setAttribute('position', new THREE.Float32BufferAttribute(segments, 3))
  group.add(new THREE.LineSegments(linkGeometry, lineMaterial(WHITE, 0.2)))

  const dots = new THREE.Points(new THREE.BufferGeometry().setFromPoints(points), new THREE.PointsMaterial({
    color: WHITE,
    size: 9,
    map: texture,
    transparent: true,
    opacity: 0.7,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  }))
  group.add(dots)

  const glow = new THREE.Sprite(new THREE.SpriteMaterial({
    map: texture,
    color: 0xfff4d6,
    transparent: true,
    opacity: 0.35,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  }))
  glow.scale.set(1400, 1400, 1)
  group.add(glow)

  const rings = [560, 660, 760].map((radius, index) => {
    const curve = new THREE.EllipseCurve(0, 0, radius, radius)
    const ring = new THREE.LineLoop(
      new THREE.BufferGeometry().setFromPoints(curve.getPoints(128)),
      lineMaterial(index === 1 ? YELLOW : WHITE, index === 1 ? 0.18 : 0.12)
    )
    ring.rotation.set(Math.PI / 2 + index * 0.5, index * 0.7, 0)
    return ring
  })
  const ringGroup = new THREE.Group()
  rings.forEach((ring) => ringGroup.add(ring))

  return { group, ringGroup, glow, rings, dots, surface: points.slice(0, surface) }
}

function wireShape(kind) {
  const geometries = {
    monolith: () => new THREE.BoxGeometry(260, 900, 140),
    drum: () => new THREE.CylinderGeometry(320, 320, 760, 32, 4, true),
    icosahedron: () => new THREE.IcosahedronGeometry(380, 1),
    relay: () => new THREE.TorusGeometry(360, 46, 6, 36),
    broken: () => new THREE.TetrahedronGeometry(420, 0),
  }
  const geometry = geometries[kind]()
  const shape = new THREE.LineSegments(
    kind === 'drum' ? new THREE.WireframeGeometry(geometry) : new THREE.EdgesGeometry(geometry),
    lineMaterial(kind === 'broken' ? RED : WHITE, kind === 'drum' ? 0.09 : 0.16)
  )
  if (kind === 'relay') {
    shape.add(new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.IcosahedronGeometry(90, 0)), lineMaterial(YELLOW, 0.2)))
  }
  return shape
}

function buildMiddleman(next) {
  const base = new THREE.EdgesGeometry(new THREE.DodecahedronGeometry(80, 0))
  const original = base.attributes.position.array.slice()
  const mesh = new THREE.LineSegments(base, lineMaterial(WHITE, 0.22))
  const tail = Array.from({ length: 14 }, () => SCRAMBLE[Math.floor(next() * 16)]).join('')
  return { mesh, original, text: `J832=${tail}` }
}

function polyline(points, material) {
  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(points * 3), 3))
  const line = new THREE.Line(geometry, material)
  line.frustumCulled = false
  return line
}

function setLine(line, points) {
  const array = line.geometry.attributes.position.array
  points.forEach((point, index) => {
    array[index * 3] = point.x
    array[index * 3 + 1] = point.y
    array[index * 3 + 2] = point.z
  })
  line.geometry.attributes.position.needsUpdate = true
}

export function createWorld({ gl, css, reducedMotion, built = true, onActivity = () => {}, level = () => 0 }) {
  const texture = glowTexture()
  const scene = new THREE.Scene()
  scene.background = new THREE.Color(0x000000)
  scene.fog = new THREE.FogExp2(0x000000, 0.000095)
  const cssScene = new THREE.Scene()

  const camera = new THREE.PerspectiveCamera(FOV, window.innerWidth / window.innerHeight, 1, 40000)
  camera.position.set(...START_POSITION)
  const renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
  renderer.setSize(window.innerWidth, window.innerHeight)
  gl.appendChild(renderer.domElement)
  const cssRenderer = new CSS3DRenderer()
  cssRenderer.setSize(window.innerWidth, window.innerHeight)
  css.appendChild(cssRenderer.domElement)

  const next = seeded(9001)
  const core = buildCore(texture)
  scene.add(core.group, core.ringGroup)

  const dust = new THREE.Points(
    new THREE.BufferGeometry().setFromPoints(Array.from({ length: 2600 }, () => {
      const direction = new THREE.Vector3(next() * 2 - 1, next() * 2 - 1, next() * 2 - 1).normalize()
      return direction.multiplyScalar(4500 + next() * 11000)
    })),
    new THREE.PointsMaterial({ color: WHITE, size: 10, map: texture, transparent: true, opacity: 0.5, depthWrite: false })
  )
  scene.add(dust)

  const sizes = new WeakMap()
  const resizeObserver = new ResizeObserver((entries) => {
    entries.forEach(({ target }) => sizes.set(target, { w: target.offsetWidth, h: target.offsetHeight }))
  })

  function size(element, w, h) {
    const known = sizes.get(element)
    return known && known.h ? known : { w, h }
  }

  function makeAnchor(className, width) {
    const element = document.createElement('div')
    element.className = className
    if (width) element.style.width = `${width}px`
    resizeObserver.observe(element)
    return element
  }

  function frame(position, yaw) {
    const normal = new THREE.Vector3(Math.sin(yaw), 0, Math.cos(yaw))
    const right = new THREE.Vector3(Math.cos(yaw), 0, -Math.sin(yaw))
    return { position, yaw, normal, right, up: new THREE.Vector3(0, 1, 0) }
  }

  function yawFacing(position) {
    const base = Math.atan2(position.x, position.z)
    const toCore = position.clone().negate()
    for (const delta of [0.7, -0.7]) {
      const yaw = base + delta
      if (toCore.dot(new THREE.Vector3(Math.cos(yaw), 0, -Math.sin(yaw))) < 0) return yaw
    }
    return base
  }

  function local(ws, y, depth = 0, x = 0) {
    return ws.position.clone()
      .add(ws.right.clone().multiplyScalar(x))
      .add(ws.up.clone().multiplyScalar(y))
      .add(ws.normal.clone().multiplyScalar(depth))
  }

  const workspaces = {}
  const anchors = {}
  const strands = []

  Object.entries(WORKSPACES).forEach(([name, spec]) => {
    let info
    if (name === 'detail') {
      const stack = workspaces.projects
      const position = stack.position.clone()
        .add(stack.right.clone().multiplyScalar(CARD_WIDTH / 2 + PANEL_WIDTH / 2 + 620))
        .add(stack.normal.clone().multiplyScalar(-120))
      info = frame(position, stack.yaw)
    } else {
      const position = new THREE.Vector3(...spec.position)
      info = frame(position, yawFacing(position))
    }

    const width = name === 'projects' ? CARD_WIDTH : PANEL_WIDTH
    const anchor = makeAnchor('ws-anchor', width)
    const object = new CSS3DObject(anchor)
    object.position.copy(info.position)
    object.rotation.y = info.yaw
    cssScene.add(object)
    anchors[name] = anchor

    if (spec.shape) {
      const shape = wireShape(spec.shape)
      shape.position.copy(info.position)
        .add(info.right.clone().multiplyScalar(width / 2 + 260))
        .add(info.normal.clone().multiplyScalar(-1100))
        .add(new THREE.Vector3(0, -120, 0))
      scene.add(shape)
      info.shape = shape
    }

    strands.push(info.position.clone().normalize().multiplyScalar(CORE_RADIUS), info.position)
    workspaces[name] = { ...info, width, anchor, object }
  })

  scene.add(new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(strands), lineMaterial(WHITE, 0.06)))

  const cards = []
  const controls = { element: makeAnchor('ws-anchor vm-controls-anchor'), placed: false }
  controls.object = new CSS3DObject(controls.element)
  controls.object.rotation.y = workspaces.projects.yaw
  controls.object.visible = false
  cssScene.add(controls.object)

  const stack = { focus: null, header: 0, controls: 0, controlsHeight: 56, height: 0, placed: false }

  function layoutStack() {
    const ws = workspaces.projects
    const headerHeight = size(ws.anchor, CARD_WIDTH, 220).h
    const controlsHeight = size(controls.element, 600, 56).h
    const heights = cards.map((card) => size(card.element, CARD_WIDTH, 200).h)
    const base = headerHeight + heights.reduce((sum, h) => sum + h + GAP, 0)
    let y = base / 2
    stack.header = y - headerHeight / 2
    stack.headerHeight = headerHeight
    y -= headerHeight + GAP
    cards.forEach((card, index) => {
      card.h = heights[index]
      card.y = y - card.h / 2
      card.depth = index === stack.focus ? FOCUS_DEPTH : 0
      y -= card.h + GAP
      if (index === stack.focus) {
        stack.controls = y - controlsHeight / 2
        y -= controlsHeight + GAP
      }
    })
    stack.controlsHeight = controlsHeight
    stack.height = base + (stack.focus != null ? controlsHeight + GAP : 0)
    stack.controlsWidth = size(controls.element, 600, 56).w
  }

  function setCards(count) {
    while (cards.length > count) {
      const card = cards.pop()
      resizeObserver.unobserve(card.element)
      cssScene.remove(card.object)
    }
    while (cards.length < count) {
      const element = makeAnchor('ws-anchor ws-card-anchor', CARD_WIDTH)
      const object = new CSS3DObject(element)
      object.rotation.y = workspaces.projects.yaw
      cssScene.add(object)
      cards.push({ element, object, y: 0, h: 0, depth: 0, placed: false })
    }
    if (stack.focus != null && stack.focus >= count) stack.focus = null
    return cards.map((card) => card.element)
  }

  function placeStack(rate) {
    layoutStack()
    const ws = workspaces.projects
    const move = (object, target, placed) => {
      if (placed && rate < 1) object.position.lerp(target, rate)
      else object.position.copy(target)
    }
    move(ws.object, local(ws, stack.header), stack.placed)
    stack.placed = true
    cards.forEach((card) => {
      move(card.object, local(ws, card.y, card.depth), card.placed)
      card.placed = true
    })
    controls.object.visible = stack.focus != null && cards.length > 0
    if (controls.object.visible) {
      const x = -CARD_WIDTH / 2 + stack.controlsWidth / 2
      move(controls.object, local(ws, stack.controls, FOCUS_DEPTH, x), controls.placed)
      controls.placed = true
    } else {
      controls.placed = false
    }
  }

  const clusters = []
  const fileGeometry = new THREE.PlaneGeometry(36, 24)
  const fileEdges = new THREE.EdgesGeometry(fileGeometry)
  CLUSTER_NAMES.forEach((name, index) => {
    let position
    do {
      const direction = new THREE.Vector3(next() * 2 - 1, (next() * 2 - 1) * 0.6, next() * 2 - 1).normalize()
      position = direction.multiplyScalar(1300 + next() * 1400)
    } while (Object.values(workspaces).some((ws) => ws.position.distanceTo(position) < 1300))
    const group = new THREE.Group()
    group.position.copy(position)
    group.lookAt(0, 0, 0)
    const rows = 3 + (index % 3)
    const cols = 4 + (index % 4)
    const outline = lineMaterial(WHITE, 0.16)
    const fill = new THREE.MeshBasicMaterial({ color: 0x151515, transparent: true, opacity: 0.9, side: THREE.DoubleSide })
    const files = new THREE.InstancedMesh(fileGeometry, fill, rows * cols)
    const matrix = new THREE.Matrix4()
    const slots = []
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x = (c - (cols - 1) / 2) * 46
        const y = (r - (rows - 1) / 2) * 34
        matrix.makeTranslation(x, y, 0)
        files.setMatrixAt(r * cols + c, matrix)
        const edge = new THREE.LineSegments(fileEdges, outline)
        edge.position.set(x, y, 0.5)
        group.add(edge)
        slots.push(new THREE.Vector3(x, y, 0))
      }
    }
    group.add(files)
    const label = textSprite(name)
    label.position.set(0, (rows / 2) * 34 + 40, 0)
    group.add(label)
    scene.add(group)
    clusters.push({ group, outline, slots, flash: 0 })
  })

  const scenery = buildScenery({
    scene,
    texture,
    coreRadius: CORE_RADIUS,
    avoid: Object.values(workspaces).map((ws) => ws.position),
    fileClusters: clusters.map((cluster) => cluster.group.position),
    reducedMotion,
  })

  const pulses = Array.from({ length: 110 }, () => {
    const sprite = new THREE.Sprite(new THREE.SpriteMaterial({
      map: texture,
      color: YELLOW,
      transparent: true,
      opacity: 0,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    }))
    sprite.scale.set(80, 80, 1)
    scene.add(sprite)
    return { sprite, active: false }
  })

  function firePath(points, color, duration, onArrive) {
    const pulse = pulses.find((item) => !item.active)
    if (!pulse) return
    const lengths = [0]
    for (let i = 1; i < points.length; i++) lengths.push(lengths[i - 1] + points[i].distanceTo(points[i - 1]))
    Object.assign(pulse, { active: true, points, lengths, start: performance.now(), duration, onArrive })
    pulse.sprite.material.color.setHex(color)
  }

  function firePulse(from, to, color = YELLOW, duration = 1100, onArrive) {
    firePath([from.clone(), to.clone()], color, duration, onArrive)
  }

  function webWalk() {
    const { nodes, links } = scenery.web
    const hops = 4 + Math.floor(Math.random() * 7)
    const path = []
    const seen = new Set([0])
    let current = 0
    for (let i = 0; i < hops; i++) {
      const options = links[current].filter((j) => !seen.has(j))
      if (!options.length) break
      const here = nodes[current].length()
      const outward = options.filter((j) => nodes[j].length() > here)
      const pool = outward.length && Math.random() < 0.85 ? outward : options
      current = pool[Math.floor(Math.random() * pool.length)]
      seen.add(current)
      path.push(current)
    }
    if (!path.length) return
    const start = nodes[path[0]].clone().normalize().multiplyScalar(CORE_RADIUS)
    const points = [start, ...path.map((index) => nodes[index])]
    const total = points.reduce((sum, point, index) => sum + (index ? point.distanceTo(points[index - 1]) : 0), 0)
    const speed = 2600 + Math.random() * 2400
    const last = path[path.length - 1]
    firePath(points, Math.random() < 0.3 ? YELLOW : WHITE, (total / speed) * 1000, () => {
      if (last >= 1 && last <= clusters.length) clusters[last - 1].flash = 1
    })
  }

  const movers = []
  function moveFile() {
    const from = clusters[Math.floor(Math.random() * clusters.length)]
    const to = clusters[Math.floor(Math.random() * clusters.length)]
    if (from === to) return
    const mesh = new THREE.Mesh(fileGeometry, new THREE.MeshBasicMaterial({ color: YELLOW, transparent: true, opacity: 0.85, side: THREE.DoubleSide }))
    mesh.add(new THREE.LineSegments(fileEdges, lineMaterial(YELLOW, 0.9)))
    const start = from.group.localToWorld(from.slots[Math.floor(Math.random() * from.slots.length)].clone())
    const end = to.group.localToWorld(to.slots[Math.floor(Math.random() * to.slots.length)].clone())
    const control = start.clone().add(end).multiplyScalar(0.5)
    control.add(control.clone().normalize().multiplyScalar(900))
    mesh.position.copy(start)
    scene.add(mesh)
    movers.push({ mesh, start, end, control, born: performance.now(), duration: 2600, to })
    firePulse(new THREE.Vector3(), start, WHITE, 700)
    onActivity('file')
  }

  const guide = makeAnchor('vm-guide')
  const guideObject = new CSS3DObject(guide)
  guideObject.visible = false
  cssScene.add(guideObject)

  const middleman = buildMiddleman(next)
  middleman.mesh.visible = false
  scene.add(middleman.mesh)
  const owner = makeAnchor('vm-owner')
  const ownerObject = new CSS3DObject(owner)
  ownerObject.visible = false
  cssScene.add(ownerObject)

  const chain = polyline(3, lineMaterial(WHITE, 0.4))
  const plug = polyline(2, lineMaterial(YELLOW, 0.95))
  const tether = polyline(2, lineMaterial(YELLOW, 0.6))
  const wire = polyline(3, lineMaterial(YELLOW, 0.75))
  chain.visible = plug.visible = tether.visible = wire.visible = false
  scene.add(chain, plug, tether, wire)

  const ripples = Array.from({ length: 4 }, () => {
    const ring = new THREE.LineLoop(
      new THREE.BufferGeometry().setFromPoints(new THREE.EllipseCurve(0, 0, CORE_RADIUS, CORE_RADIUS).getPoints(96)),
      lineMaterial(WHITE, 0)
    )
    ring.visible = false
    scene.add(ring)
    return { ring, start: 0 }
  })
  const beat = { level: 0, average: 0, last: 0, cycle: 0 }

  function ripple(now, strength) {
    const free = ripples.find((item) => !item.ring.visible) ?? ripples[0]
    free.start = now
    free.strength = strength
    free.ring.visible = true
  }

  const terminals = reducedMotion ? null : startTerminals({ scene: cssScene, onActivity, radius: CORE_RADIUS })

  let width = window.innerWidth
  let height = window.innerHeight
  let target = null
  let flight = null
  let docked = false
  let plugStart = 0
  let detach = null
  const travel = { direction: new THREE.Vector3(), t: 1 }
  let guideShown = false
  let buildStart = built ? -Infinity : null
  const pointer = { x: 0, y: 0, sx: 0, sy: 0 }
  const look = { yaw: 0, pitch: 0, dragging: false, lastX: 0, lastY: 0 }
  const current = { pos: camera.position.clone(), look: new THREE.Vector3() }

  function baseDistance() {
    return (height / 2) / Math.tan(THREE.MathUtils.degToRad(FOV / 2))
  }

  function poseFor(view) {
    const ws = workspaces[view.name]
    const shift = ws.right.clone().multiplyScalar(-Math.min(width * 0.14, 260))
    let distance = baseDistance() * 1.12
    let focus = ws.position.clone()
    if (view.name === 'projects') {
      layoutStack()
      const card = view.row != null ? cards[view.row] : null
      if (card) {
        const top = card.y + card.h / 2
        const bottom = view.row === stack.focus ? stack.controls - stack.controlsHeight / 2 : card.y - card.h / 2
        focus = local(ws, (top + bottom) / 2, FOCUS_DEPTH)
      } else {
        distance = Math.max(distance, (stack.height / 2 + 140) / Math.tan(THREE.MathUtils.degToRad(FOV / 2)))
      }
    }
    return {
      pos: focus.clone().add(ws.normal.clone().multiplyScalar(distance)).add(shift),
      look: focus.add(shift),
    }
  }

  function dockFor(view) {
    const ws = workspaces[view.name]
    const g = size(guide, 320, 40)
    let centreY = 0
    let panelHeight = size(ws.anchor, ws.width, 500).h
    let depth = 0
    if (view.name === 'projects') {
      const card = stack.focus != null ? cards[stack.focus] : null
      if (card) {
        centreY = card.y
        panelHeight = card.h
        depth = FOCUS_DEPTH
      } else {
        centreY = stack.header
        panelHeight = stack.headerHeight
      }
    }
    const top = centreY + panelHeight / 2 - (panelHeight > 520 ? 120 : 0)
    const row = top - 20
    return {
      position: local(ws, top - g.h / 2, depth, -(ws.width / 2 + GUIDE_GAP + g.w / 2)),
      quaternion: new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), ws.yaw),
      plugFrom: local(ws, row, depth, -(ws.width / 2 + GUIDE_GAP)),
      plugTo: local(ws, row, depth, -ws.width / 2),
    }
  }

  function flyTo(view, { duration } = {}) {
    const changing = !target || target.name !== view.name
    target = view
    if (view.name === 'projects') stack.focus = view.row ?? null
    if (changing) {
      docked = false
      plugStart = 0
      if (guideShown) detach = { position: guideObject.position.clone(), quaternion: guideObject.quaternion.clone(), start: performance.now() }
      guide.style.setProperty('--tow', reducedMotion ? '1' : '0')
    }
    const pose = poseFor(view)
    look.yaw = 0
    look.pitch = 0
    if (changing && guideShown) firePulse(new THREE.Vector3(), middleman.mesh.position, YELLOW, 900)
    if (reducedMotion) {
      current.pos.copy(pose.pos)
      current.look.copy(pose.look)
      flight = null
      docked = true
      plugStart = performance.now() - PLUG_MS
      return Promise.resolve()
    }
    const distance = current.pos.distanceTo(pose.pos)
    const length = duration ?? THREE.MathUtils.clamp(distance / 3.2, 700, 2600)
    const middle = current.pos.clone().add(pose.pos).multiplyScalar(0.5)
    const push = middle.length() < 1 ? new THREE.Vector3(0, 1, 0) : middle.clone().normalize()
    const control = middle.add(push.multiplyScalar(distance * 0.22)).add(new THREE.Vector3(0, distance * 0.08, 0))
    if (flight) flight.resolve()
    return new Promise((resolve) => {
      flight = {
        from: current.pos.clone(),
        to: pose.pos,
        control,
        lookFrom: current.look.clone(),
        lookTo: pose.look,
        start: performance.now(),
        duration: length,
        resolve,
      }
    })
  }

  function onPointerMove(event) {
    pointer.x = (event.clientX / width) * 2 - 1
    pointer.y = (event.clientY / height) * 2 - 1
    if (!look.dragging) return
    look.yaw = THREE.MathUtils.clamp(look.yaw - (event.clientX - look.lastX) * 0.0025, -0.6, 0.6)
    look.pitch = THREE.MathUtils.clamp(look.pitch - (event.clientY - look.lastY) * 0.0025, -0.4, 0.4)
    look.lastX = event.clientX
    look.lastY = event.clientY
  }

  function onPointerDown(event) {
    if (event.target.closest('.ws-anchor, .vm-guide, .vm-term, a, button, input, textarea')) return
    look.dragging = true
    look.lastX = event.clientX
    look.lastY = event.clientY
    cssRenderer.domElement.classList.add('is-dragging')
  }

  function onPointerUp() {
    look.dragging = false
    cssRenderer.domElement.classList.remove('is-dragging')
  }

  function onResize() {
    width = window.innerWidth
    height = window.innerHeight
    camera.aspect = width / height
    camera.updateProjectionMatrix()
    renderer.setSize(width, height)
    cssRenderer.setSize(width, height)
    if (target && !flight) {
      const pose = poseFor(target)
      current.pos.copy(pose.pos)
      current.look.copy(pose.look)
    }
  }

  window.addEventListener('resize', onResize)
  window.addEventListener('pointermove', onPointerMove)
  window.addEventListener('pointerup', onPointerUp)
  cssRenderer.domElement.addEventListener('pointerdown', onPointerDown)

  let nextPulse = 0
  let nextMove = performance.now() + 4000
  let lastScramble = 0
  let frameId = 0
  let last = performance.now()
  const right = new THREE.Vector3()
  const up = new THREE.Vector3()
  const forward = new THREE.Vector3()
  const guideRight = new THREE.Vector3()
  const guideUp = new THREE.Vector3()

  function updateGuide(now, rate) {
    if (!guideShown || !target) return
    const g = size(guide, 320, 40)
    const depth = baseDistance() * 0.95
    const halfH = Math.tan(THREE.MathUtils.degToRad(FOV / 2)) * depth
    const halfW = halfH * camera.aspect
    let goal
    let quaternion
    let dock = null
    if (docked) {
      dock = dockFor(target)
      goal = dock.position
      quaternion = dock.quaternion
    } else {
      goal = camera.position.clone()
        .add(forward.clone().multiplyScalar(depth))
        .add(right.clone().multiplyScalar(-halfW * 0.3))
        .add(up.clone().multiplyScalar(halfH * 0.25))
      quaternion = camera.quaternion
    }
    if (reducedMotion) {
      guideObject.position.copy(goal)
      guideObject.quaternion.copy(quaternion)
    } else if (!docked) {
      const time = now / 1000
      const lead = Math.sin(Math.PI * travel.t) * depth * 0.22
      goal.add(travel.direction.clone().multiplyScalar(lead))
        .add(right.clone().multiplyScalar(Math.sin(time * 1.3) * 26))
        .add(up.clone().multiplyScalar(Math.cos(time * 1.1) * 18))
      const blend = detach ? easeInOut(Math.min((now - detach.start) / 450, 1)) : 1
      guideObject.position.copy(detach ? detach.position.clone().lerp(goal, blend) : goal)
      guideObject.quaternion.copy(detach ? detach.quaternion.clone().slerp(quaternion, blend) : quaternion)
    } else {
      guideObject.position.lerp(goal, rate)
      guideObject.quaternion.slerp(quaternion, rate)
    }

    guideRight.set(1, 0, 0).applyQuaternion(guideObject.quaternion)
    guideUp.set(0, 1, 0).applyQuaternion(guideObject.quaternion)
    const rowY = g.h / 2 - 20
    const left = guideObject.position.clone()
      .add(guideRight.clone().multiplyScalar(-g.w / 2))
      .add(guideUp.clone().multiplyScalar(rowY))
    const bottom = guideObject.position.clone().add(guideUp.clone().multiplyScalar(-g.h / 2))
    const start = left.clone().normalize().multiplyScalar(CORE_RADIUS)
    const middle = start.clone().lerp(left, 0.72)
    middleman.mesh.position.copy(middle)
    ownerObject.position.copy(middle).add(new THREE.Vector3(0, 150, 0))
    ownerObject.quaternion.copy(camera.quaternion)
    setLine(chain, [start, middle, left])

    const reach = 260
    const you = camera.position.clone()
      .add(forward.clone().multiplyScalar(reach))
      .add(up.clone().multiplyScalar(-Math.tan(THREE.MathUtils.degToRad(FOV / 2)) * reach * 1.08))
      .add(right.clone().multiplyScalar(-Math.tan(THREE.MathUtils.degToRad(FOV / 2)) * reach * camera.aspect * 0.35))
    setLine(tether, [you, bottom])

    plug.visible = docked && plugStart > 0
    if (plug.visible && dock) {
      const t = THREE.MathUtils.clamp((now - plugStart) / PLUG_MS, 0, 1)
      const from = guideObject.position.clone()
        .add(guideRight.clone().multiplyScalar(g.w / 2))
        .add(guideUp.clone().multiplyScalar(rowY))
      setLine(plug, [from, from.clone().lerp(dock.plugTo, easeInOut(t))])
    }

    wire.visible = plug.visible && target.name === 'projects' && controls.object.visible
    if (wire.visible) {
      const t = THREE.MathUtils.clamp((now - plugStart - PLUG_MS) / PLUG_MS, 0, 1)
      const ws = workspaces.projects
      const from = guideObject.position.clone()
        .add(guideRight.clone().multiplyScalar(-g.w / 4))
        .add(guideUp.clone().multiplyScalar(-g.h / 2))
      const end = controls.object.position.clone().add(ws.right.clone().multiplyScalar(-stack.controlsWidth / 2))
      const elbow = new THREE.Vector3(from.x, end.y, from.z)
      const legs = from.distanceTo(elbow) + elbow.distanceTo(end) || 1
      const reach = easeInOut(t) * legs
      const first = Math.min(reach, from.distanceTo(elbow))
      const corner = from.clone().lerp(elbow, first / (from.distanceTo(elbow) || 1))
      const tip = reach > first ? elbow.clone().lerp(end, (reach - first) / (elbow.distanceTo(end) || 1)) : corner
      setLine(wire, [from, corner, tip])
    }
  }

  function animate(now) {
    frameId = requestAnimationFrame(animate)
    const delta = Math.min((now - last) / 1000, 0.1)
    last = now
    const time = now / 1000
    const rate = 1 - Math.exp(-delta * 7)

    let grow = 1
    if (buildStart === null) grow = 0.001
    else if (buildStart !== -Infinity) grow = Math.max(0.001, easeOutBack(Math.min((now - buildStart) / 2400, 1)))
    const music = reducedMotion ? 0 : level()
    beat.level += (music - beat.level) * Math.min(1, delta * 14)
    beat.average += (beat.level - beat.average) * Math.min(1, delta * 1.5)
    const heart = reducedMotion ? 0 : Math.pow(Math.max(0, Math.sin(time * 2.4)), 8)
    core.group.scale.setScalar(grow * (1 + heart * 0.035 + beat.level * 0.2))
    core.ringGroup.scale.setScalar(Math.min(1, grow * 1.1) * (1 + beat.level * 0.08))
    core.dots.material.opacity = Math.min(1, 0.6 + heart * 0.2 + beat.level * 0.5)

    if (!reducedMotion && grow >= 1) {
      const cycle = Math.floor((time * 2.4 + Math.PI / 2) / (Math.PI * 2))
      if (music > 0.02) {
        if (beat.level > 0.18 && beat.level > beat.average * 1.25 && now - beat.last > 380) {
          beat.last = now
          ripple(now, Math.min(1, beat.level * 2))
        }
      } else if (cycle !== beat.cycle) {
        ripple(now, 0.5)
      }
      beat.cycle = cycle
    }
    ripples.forEach((item) => {
      if (!item.ring.visible) return
      const t = (now - item.start) / 1500
      if (t >= 1) {
        item.ring.visible = false
        return
      }
      item.ring.position.copy(core.group.position)
      item.ring.quaternion.copy(camera.quaternion)
      item.ring.scale.setScalar(1 + easeInOut(t) * 1.4)
      item.ring.material.opacity = (1 - t) * 0.45 * item.strength
    })

    if (!reducedMotion) {
      core.group.rotation.y += delta * 0.06
      core.group.rotation.x = Math.sin(time * 0.2) * 0.12
      core.ringGroup.rotation.y -= delta * 0.08
      core.rings.forEach((ring, index) => { ring.rotation.z += delta * (0.05 + index * 0.03) })
      core.glow.material.opacity = 0.24 + heart * 0.14 + beat.level * 0.5
      dust.rotation.y += delta * 0.004
      Object.values(workspaces).forEach((ws) => {
        if (ws.shape) ws.shape.rotation.y += delta * 0.12
      })
      if (middleman.mesh.visible) {
        const { mesh, original } = middleman
        const positions = mesh.geometry.attributes.position.array
        for (let i = 0; i < positions.length; i += 3) {
          const wobble = Math.sin(time * 3 + original[i + 1] * 0.08) * 6
          const glitch = Math.random() < 0.004 ? (Math.random() - 0.5) * 30 : 0
          positions[i] = original[i] + wobble + glitch
          positions[i + 1] = original[i + 1] + Math.cos(time * 2.3 + original[i] * 0.07) * 6
          positions[i + 2] = original[i + 2] + wobble * 0.6
        }
        mesh.geometry.attributes.position.needsUpdate = true
        mesh.rotation.x += delta * 0.7
        mesh.rotation.y += delta * 0.45
      }

      if (grow >= 1 && now > nextPulse) {
        nextPulse = now + 60 + Math.random() * 140
        webWalk()
        if (Math.random() < 0.04) onActivity('pulse')
      }
      if (grow >= 1 && now > nextMove) {
        nextMove = now + 4500 + Math.random() * 4000
        moveFile()
      }
    }

    scenery.update(now)

    pulses.forEach((pulse) => {
      if (!pulse.active) return
      const t = Math.min((now - pulse.start) / pulse.duration, 1)
      const travelled = t * pulse.lengths[pulse.lengths.length - 1]
      let segment = 1
      while (segment < pulse.lengths.length - 1 && pulse.lengths[segment] < travelled) segment++
      const span = pulse.lengths[segment] - pulse.lengths[segment - 1] || 1
      const along = (travelled - pulse.lengths[segment - 1]) / span
      pulse.sprite.position.lerpVectors(pulse.points[segment - 1], pulse.points[segment], along)
      const size = 80 + pulse.sprite.position.length() * 0.02
      pulse.sprite.scale.set(size, size, 1)
      pulse.sprite.material.opacity = t < 0.05 ? t * 20 : t > 0.9 ? (1 - t) / 0.1 : 1
      if (t >= 1) {
        pulse.active = false
        pulse.sprite.material.opacity = 0
        if (pulse.onArrive) pulse.onArrive()
      }
    })

    clusters.forEach((cluster) => {
      cluster.flash = Math.max(0, cluster.flash - delta * 1.5)
      cluster.outline.opacity = 0.16 + cluster.flash * 0.45
      cluster.outline.color.setHex(cluster.flash > 0.05 ? YELLOW : WHITE)
    })

    for (let i = movers.length - 1; i >= 0; i--) {
      const mover = movers[i]
      const t = Math.min((now - mover.born) / mover.duration, 1)
      const e = easeInOut(t)
      const a = mover.start.clone().lerp(mover.control, e)
      const b = mover.control.clone().lerp(mover.end, e)
      mover.mesh.position.copy(a.lerp(b, e))
      mover.mesh.lookAt(0, 0, 0)
      if (t >= 1) {
        mover.to.flash = 1
        scene.remove(mover.mesh)
        mover.mesh.material.dispose()
        movers.splice(i, 1)
      }
    }

    if (now - lastScramble > 70) {
      lastScramble = now
      const chars = middleman.text.split('').map((char, index) =>
        index > 4 && Math.random() < 0.35 ? SCRAMBLE[Math.floor(Math.random() * SCRAMBLE.length)] : char
      )
      owner.textContent = `Owner ${chars.join('')}`
    }

    if (flight) {
      const t = Math.min((now - flight.start) / flight.duration, 1)
      const e = easeInOut(t)
      const a = flight.from.clone().lerp(flight.control, e)
      const b = flight.control.clone().lerp(flight.to, e)
      const ahead = Math.min(e + 0.02, 1)
      const aheadA = flight.from.clone().lerp(flight.control, ahead)
      const aheadB = flight.control.clone().lerp(flight.to, ahead)
      const was = current.pos.clone()
      current.pos.copy(a.lerp(b, e))
      const step = aheadA.lerp(aheadB, ahead).sub(current.pos)
      if (step.lengthSq() > 1) travel.direction.copy(step.normalize())
      else if (current.pos.distanceToSquared(was) > 1) travel.direction.copy(current.pos.clone().sub(was).normalize())
      travel.t = t
      guide.style.setProperty('--tow', t.toFixed(3))
      current.look.lerpVectors(flight.lookFrom, flight.lookTo, e)
      if (t >= 1) {
        const done = flight.resolve
        flight = null
        travel.t = 1
        if (!docked) {
          docked = true
          plugStart = now + 250
        }
        done()
      }
    }

    placeStack(reducedMotion ? 1 : rate)
    if (terminals) terminals.update(now, camera)

    pointer.sx += (pointer.x - pointer.sx) * Math.min(1, delta * 3)
    pointer.sy += (pointer.y - pointer.sy) * Math.min(1, delta * 3)
    if (!look.dragging) {
      look.yaw *= 1 - Math.min(1, delta * 0.8)
      look.pitch *= 1 - Math.min(1, delta * 0.8)
    }

    forward.copy(current.look).sub(current.pos).normalize()
    right.crossVectors(forward, camera.up).normalize()
    up.crossVectors(right, forward).normalize()
    const parallax = reducedMotion ? 0 : 1
    const offset = right.clone().multiplyScalar(pointer.sx * 50 * parallax)
      .add(up.clone().multiplyScalar(-pointer.sy * 30 * parallax))
    camera.position.copy(current.pos).add(offset)
    const lookAt = current.look.clone().add(offset)
    const direction = lookAt.clone().sub(camera.position)
    direction.applyAxisAngle(up, look.yaw)
    direction.applyAxisAngle(right, look.pitch)
    camera.lookAt(camera.position.clone().add(direction))
    camera.updateMatrixWorld()

    updateGuide(now, reducedMotion ? 1 : 1 - Math.exp(-delta * 6))

    renderer.render(scene, camera)
    cssRenderer.render(cssScene, camera)
  }

  current.look.set(0, 0, 0)
  camera.lookAt(0, 0, 0)
  frameId = requestAnimationFrame(animate)

  function showGuide() {
    if (guideShown) return
    guideShown = true
    guideObject.visible = ownerObject.visible = middleman.mesh.visible = true
    chain.visible = tether.visible = true
    guideObject.position.copy(camera.position).add(forward.clone().multiplyScalar(baseDistance()))
    guideObject.quaternion.copy(camera.quaternion)
  }

  return {
    anchors,
    guide,
    controls: controls.element,
    setCards,
    flyTo,
    build() {
      if (buildStart === null) buildStart = performance.now()
      showGuide()
    },
    dispose() {
      cancelAnimationFrame(frameId)
      window.removeEventListener('resize', onResize)
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerup', onPointerUp)
      resizeObserver.disconnect()
      if (terminals) terminals.dispose()
      renderer.dispose()
      gl.removeChild(renderer.domElement)
      css.removeChild(cssRenderer.domElement)
    },
  }
}
