import { useSyncExternalStore } from 'react'

const KEY = 'portfolio:sound'
const listeners = new Set()

let context = null
let master = null
let noiseBuffer = null
let enabled = readStored()
let music = null
let fade = 0

function readStored() {
  try {
    return localStorage.getItem(KEY) === 'on'
  } catch {
    return false
  }
}

function audio() {
  if (!context) {
    const Context = window.AudioContext || window.webkitAudioContext
    if (!Context) return null
    context = new Context()
    master = context.createGain()
    master.gain.value = 0.5
    master.connect(context.destination)
  }
  if (context.state === 'suspended') context.resume().catch(() => {})
  return context
}

function noise() {
  if (!noiseBuffer) {
    noiseBuffer = context.createBuffer(1, context.sampleRate, context.sampleRate)
    const data = noiseBuffer.getChannelData(0)
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1
  }
  return noiseBuffer
}

function tone(type, from, to, start, length, volume) {
  const oscillator = context.createOscillator()
  const gain = context.createGain()
  const t = context.currentTime + start
  oscillator.type = type
  oscillator.frequency.setValueAtTime(from, t)
  oscillator.frequency.exponentialRampToValueAtTime(to, t + length)
  gain.gain.setValueAtTime(0.0001, t)
  gain.gain.exponentialRampToValueAtTime(volume, t + 0.01)
  gain.gain.exponentialRampToValueAtTime(0.0001, t + length)
  oscillator.connect(gain).connect(master)
  oscillator.start(t)
  oscillator.stop(t + length + 0.02)
}

function sweep(from, to, length, volume) {
  const source = context.createBufferSource()
  const filter = context.createBiquadFilter()
  const gain = context.createGain()
  const t = context.currentTime
  source.buffer = noise()
  filter.type = 'bandpass'
  filter.Q.value = 4
  filter.frequency.setValueAtTime(from, t)
  filter.frequency.exponentialRampToValueAtTime(to, t + length)
  gain.gain.setValueAtTime(0.0001, t)
  gain.gain.exponentialRampToValueAtTime(volume, t + length * 0.4)
  gain.gain.exponentialRampToValueAtTime(0.0001, t + length)
  source.connect(filter).connect(gain).connect(master)
  source.start(t)
  source.stop(t + length + 0.02)
}

export function playMove() {
  if (!enabled || !audio()) return
  sweep(300, 2400, 0.55, 0.35)
  tone('square', 1000, 700, 0, 0.05, 0.05)
}

export function playLock() {
  if (!enabled || !audio()) return
  tone('sine', 1500, 1500, 0, 0.07, 0.12)
  tone('sine', 1500, 1500, 0.11, 0.07, 0.12)
}

export function playOpen() {
  if (!enabled || !audio()) return
  sweep(2400, 200, 0.55, 0.4)
  tone('sawtooth', 500, 90, 0, 0.5, 0.06)
}

const GARBLE = { pulse: 4, file: 10, terminal: 6, sort: 8, boot: 5 }
let lastGarble = 0

export function playGarble(kind = 'pulse') {
  if (!enabled || !audio()) return
  const now = context.currentTime
  if (now - lastGarble < 0.25) return
  lastGarble = now
  let start = 0
  for (let i = 0; i < (GARBLE[kind] ?? 4); i++) {
    const length = 0.015 + Math.random() * 0.035
    if (Math.random() < 0.5) {
      const pitch = 300 + Math.random() * 2700
      tone('square', pitch, pitch * (0.6 + Math.random() * 0.8), start, length, 0.025)
    } else {
      const band = 800 + Math.random() * 4000
      const source = context.createBufferSource()
      const filter = context.createBiquadFilter()
      const gain = context.createGain()
      const t = context.currentTime + start
      source.buffer = noise()
      source.playbackRate.value = 0.3 + Math.random() * 1.5
      filter.type = 'bandpass'
      filter.Q.value = 8
      filter.frequency.value = band
      gain.gain.setValueAtTime(0.0001, t)
      gain.gain.exponentialRampToValueAtTime(0.08, t + 0.005)
      gain.gain.exponentialRampToValueAtTime(0.0001, t + length)
      source.connect(filter).connect(gain).connect(master)
      source.start(t, Math.random() * 0.5)
      source.stop(t + length + 0.02)
    }
    start += length + Math.random() * 0.02
  }
}

const MUSIC_VOLUME = 0.35

function ambient(on) {
  if (music === false) return
  if (!music) {
    if (!on) return
    music = new Audio(import.meta.env.BASE_URL + 'audio/ambient.mp3')
    music.loop = true
    music.volume = 0
    music.addEventListener('error', () => { music = false })
  }
  clearInterval(fade)
  if (on) music.play().catch(() => {})
  const goal = on ? MUSIC_VOLUME : 0
  fade = setInterval(() => {
    if (!music) return clearInterval(fade)
    const step = Math.sign(goal - music.volume) * 0.02
    music.volume = Math.min(1, Math.max(0, Math.abs(goal - music.volume) <= 0.02 ? goal : music.volume + step))
    if (music.volume === goal) {
      clearInterval(fade)
      if (!on) music.pause()
    }
  }, 60)
}

export function setSound(on) {
  enabled = on
  try {
    localStorage.setItem(KEY, on ? 'on' : 'off')
  } catch {}
  if (on && audio()) tone('sine', 880, 1320, 0, 0.12, 0.1)
  ambient(on)
  listeners.forEach((listener) => listener())
}

function subscribe(listener) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function useSound() {
  return useSyncExternalStore(subscribe, () => enabled)
}

function wake() {
  if (!enabled) return
  audio()
  if (!music || music.paused) ambient(true)
}

window.addEventListener('pointerdown', wake)
window.addEventListener('keydown', wake)
