import * as THREE from 'three'

export const WHITE = 0xffffff
export const YELLOW = 0xe5ff00
export const RED = 0xff2a2a
export const BLUE = 0x3d7bff

export function seeded(seed) {
  let state = seed
  return () => {
    state = (state * 1664525 + 1013904223) % 4294967296
    return state / 4294967296
  }
}

export function easeInOut(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
}

export function glowTexture() {
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = 128
  const context = canvas.getContext('2d')
  const gradient = context.createRadialGradient(64, 64, 0, 64, 64, 64)
  gradient.addColorStop(0, 'rgba(255,255,255,1)')
  gradient.addColorStop(0.25, 'rgba(255,255,255,.45)')
  gradient.addColorStop(1, 'rgba(255,255,255,0)')
  context.fillStyle = gradient
  context.fillRect(0, 0, 128, 128)
  return new THREE.CanvasTexture(canvas)
}

export function textSprite(text, { color = 'rgba(255,255,255,.55)', background = null, scale = 1.6 } = {}) {
  const canvas = document.createElement('canvas')
  const context = canvas.getContext('2d')
  const font = '28px "Space Mono", monospace'
  context.font = font
  canvas.width = Math.ceil(context.measureText(text).width) + 16
  canvas.height = 40
  if (background) {
    context.fillStyle = background
    context.fillRect(0, 0, canvas.width, canvas.height)
  }
  context.font = font
  context.fillStyle = color
  context.fillText(text, 8, 30)
  const material = new THREE.SpriteMaterial({ map: new THREE.CanvasTexture(canvas), transparent: true, depthWrite: false })
  const sprite = new THREE.Sprite(material)
  sprite.scale.set(canvas.width * scale, canvas.height * scale, 1)
  return sprite
}

export function lineMaterial(color, opacity) {
  return new THREE.LineBasicMaterial({
    color,
    transparent: true,
    opacity,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  })
}
