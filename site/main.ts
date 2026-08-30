import './style.css'
import {
  createPlayer,
  createRecorder,
  downloadCapsule,
  importCapsule,
  type ReplayCapsule,
  type ReplayEvent,
  type ReplayRecorder,
} from '../src/index'

// Keep the documented query entry point, but make its destination the compact
// demo application so a direct link never lands on an unseeded marketing view.
if (window.location.pathname === '/' && new URLSearchParams(window.location.search).get('demo') === '1') {
  window.location.replace('/demo')
}

const $ = <T extends Element>(selector: string) => {
  const element = document.querySelector<T>(selector)
  if (!element) throw new Error(`Missing element: ${selector}`)
  return element
}

const canvas = $('#game') as HTMLCanvasElement
const context = canvas.getContext('2d')!
const recordButton = $('#record') as HTMLButtonElement
const stopButton = $('#stop') as HTMLButtonElement
const resetButton = $('#reset') as HTMLButtonElement
const exportButton = $('#export') as HTMLButtonElement
const importInput = $('#import') as HTMLInputElement
const replayButton = $('#replay') as HTMLButtonElement
const replayFirstScreenButton = document.querySelector<HTMLButtonElement>('#replay-first-screen')
const stateText = $('#record-state')
const statePill = $('.record-state') as HTMLElement
const message = $('#demo-message') as HTMLElement
const overlay = $('#scope-overlay') as HTMLElement
const seedReadout = $('#seed-readout')
const eventReadout = $('#event-readout')
const timeReadout = $('#time-readout')
const sizeReadout = $('#size-readout')
const capFill = $('#cap-fill') as HTMLElement
const timelineFill = $('#timeline-fill') as HTMLElement
const timeline = $('.timeline') as HTMLElement
const capGauge = $('.cap-gauge') as HTMLElement
const offlineNote = $('#offline-note') as HTMLElement
const demoBanner = document.querySelector<HTMLElement>('#demo-banner')
const resetDemoButton = document.querySelector<HTMLButtonElement>('#reset-demo')

const isDemo = document.body.dataset.mode === 'demo' || new URLSearchParams(window.location.search).get('demo') === '1'
// Replay Capsule never writes browser storage. The explicit namespace still
// makes demo and real in-memory state impossible to confuse if persistence is
// ever added by a host application.
const stateNamespace = isDemo ? 'demo:replay-capsule:memory' : 'real:replay-capsule:memory'
document.body.dataset.stateNamespace = stateNamespace
if (isDemo && demoBanner) demoBanner.hidden = false

type Point = { x: number; y: number }
type Fault = Point & { width: number; height: number }
let player: Point = { x: .1, y: .5 }
let beacon: Point = { x: .88, y: .5 }
let faults: Fault[] = []
let activeSeed = ''
let recorder: ReplayRecorder | undefined
let capsule: ReplayCapsule | undefined
let runEnded = false
let replaying = false
let replayedEvents: ReplayEvent[] = []

const hashSeed = (value: string) => {
  let hash = 2166136261
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index)
    hash = Math.imul(hash, 16777619)
  }
  return hash >>> 0
}

const makeRandom = (seed: string) => {
  let value = hashSeed(seed)
  return () => {
    value += 0x6d2b79f5
    let next = value
    next = Math.imul(next ^ (next >>> 15), next | 1)
    next ^= next + Math.imul(next ^ (next >>> 7), next | 61)
    return ((next ^ (next >>> 14)) >>> 0) / 4294967296
  }
}

function resetGame(seed = activeSeed || 'RC-DEMO') {
  activeSeed = seed
  const random = makeRandom(seed)
  player = { x: .1, y: .5 }
  beacon = { x: .89, y: .18 + random() * .64 }
  faults = [.34, .53, .7].map((x) => ({ x, y: .12 + random() * .64, width: .09, height: .24 }))
  runEnded = false
  seedReadout.textContent = seed
  timelineFill.style.transform = 'scaleX(0)'
  timeline.setAttribute('aria-valuenow', '0')
  delete document.body.dataset.replayedEvents
  delete document.body.dataset.replayOutcome
  drawGame()
}

function drawGame() {
  const width = canvas.width
  const height = canvas.height
  context.fillStyle = '#092d2b'
  context.fillRect(0, 0, width, height)
  context.strokeStyle = '#315b57'
  context.lineWidth = 1
  for (let x = 40; x < width; x += 40) { context.beginPath(); context.moveTo(x, 0); context.lineTo(x, height); context.stroke() }
  for (let y = 40; y < height; y += 40) { context.beginPath(); context.moveTo(0, y); context.lineTo(width, y); context.stroke() }

  context.setLineDash([8, 6])
  context.strokeStyle = '#64817b'
  context.beginPath(); context.moveTo(width * .1, height * .5); context.lineTo(width * beacon.x, height * beacon.y); context.stroke()
  context.setLineDash([])

  for (const fault of faults) {
    const left = (fault.x - fault.width / 2) * width
    const top = (fault.y - fault.height / 2) * height
    context.fillStyle = '#7f302b'
    context.fillRect(left, top, fault.width * width, fault.height * height)
    context.strokeStyle = '#ec9b69'
    context.lineWidth = 5
    for (let offset = -height; offset < width; offset += 18) {
      context.beginPath(); context.moveTo(left + offset, top); context.lineTo(left + offset + fault.height * height, top + fault.height * height); context.stroke()
    }
    context.strokeStyle = '#f7f0da'
    context.lineWidth = 2
    context.strokeRect(left, top, fault.width * width, fault.height * height)
  }

  context.beginPath()
  context.arc(beacon.x * width, beacon.y * height, 18, 0, Math.PI * 2)
  context.fillStyle = '#e5b85f'; context.fill()
  context.strokeStyle = '#fff1ad'; context.lineWidth = 5; context.stroke()

  const px = player.x * width
  const py = player.y * height
  context.save(); context.translate(px, py); context.rotate(Math.PI / 4)
  context.fillStyle = runEnded ? '#c7602d' : '#d4e0c5'
  context.fillRect(-11, -11, 22, 22)
  context.strokeStyle = '#fff9e9'; context.lineWidth = 3; context.strokeRect(-11, -11, 22, 22)
  context.restore()
}

function setMessage(text: string, kind: 'normal' | 'error' | 'success' = 'normal') {
  message.textContent = text
  if (kind === 'normal') delete message.dataset.kind
  else message.dataset.kind = kind
}

function assessRun() {
  if (runEnded) return
  const hit = faults.some((fault) => Math.abs(player.x - fault.x) < fault.width / 2 + .017 && Math.abs(player.y - fault.y) < fault.height / 2 + .03)
  const won = Math.hypot(player.x - beacon.x, player.y - beacon.y) < .055
  if (hit || won) {
    runEnded = true
    recorder?.checkpoint(hit ? 'fault-contact' : 'beacon-reached', { x: Number(player.x.toFixed(4)), y: Number(player.y.toFixed(4)) })
    if (recorder?.state === 'recording') recorder.stop()
    if (!replaying) {
      capsule = recorder?.export()
      exportButton.disabled = !capsule
      replayButton.disabled = !capsule
      setMessage(hit ? 'Fault reproduced and checkpointed. Download this capsule or replay it here.' : 'Beacon reached. The successful path is ready to replay.', hit ? 'error' : 'success')
      syncStatus()
    }
  }
  drawGame()
}

function applyEvent(event: ReplayEvent) {
  if (event.type === 'key' && event.action === 'down') {
    const delta = .035
    if (event.code === 'ArrowLeft' || event.code === 'KeyA') player.x -= delta
    if (event.code === 'ArrowRight' || event.code === 'KeyD') player.x += delta
    if (event.code === 'ArrowUp' || event.code === 'KeyW') player.y -= delta
    if (event.code === 'ArrowDown' || event.code === 'KeyS') player.y += delta
  }
  if (event.type === 'pointer' && (event.action === 'down' || (event.action === 'move' && event.buttons > 0))) {
    player.x = event.x
    player.y = event.y
  }
  if (event.type === 'gamepad') {
    player.x += (event.axes[0] ?? 0) * .025
    player.y += (event.axes[1] ?? 0) * .025
  }
  player.x = Math.max(.03, Math.min(.97, player.x))
  player.y = Math.max(.05, Math.min(.95, player.y))
  assessRun()
}

function createRunRecorder(seed: string) {
  return createRecorder({
    seed,
    target: canvas,
    maxBytes: 128_000,
    onStatus: (status) => {
      eventReadout.textContent = String(status.eventCount)
      timeReadout.textContent = `${(recorder?.export().durationMs ?? 0) / 1000 >= 0 ? ((recorder?.export().durationMs ?? 0) / 1000).toFixed(2) : '0.00'} s`
      sizeReadout.textContent = `${(status.bytes / 1000).toFixed(1)} / 128 KB`
      capFill.style.transform = `scaleX(${Math.min(1, status.bytes / status.maxBytes)})`
      capGauge.setAttribute('aria-valuenow', String(Math.round(Math.min(1, status.bytes / status.maxBytes) * 100)))
      if (status.state === 'limit-reached') {
        setMessage('The 128 KB cap was reached. The last complete event is preserved; download or reset the capsule.', 'error')
        capsule = recorder?.export()
        exportButton.disabled = false
        replayButton.disabled = false
      }
    },
  })
}

function syncStatus() {
  const state = replaying ? 'replaying' : recorder?.state ?? 'idle'
  statePill.dataset.state = state
  stateText.textContent = state === 'recording' ? 'Recording' : state === 'replaying' ? 'Replaying' : state === 'limit-reached' ? 'Cap reached' : state === 'stopped' ? 'Stopped' : 'Ready'
  recordButton.disabled = state === 'recording' || state === 'replaying'
  stopButton.disabled = state !== 'recording'
  resetButton.disabled = state === 'replaying'
  if (replayFirstScreenButton) replayFirstScreenButton.disabled = replayButton.disabled || state === 'replaying'
}

function loadCapsule(next: ReplayCapsule, notice: string) {
  capsule = next
  recorder?.clear()
  recorder = undefined
  resetGame(String(capsule.seed))
  eventReadout.textContent = String(capsule.events.length)
  timeReadout.textContent = `${(capsule.durationMs / 1000).toFixed(2)} s`
  const bytes = new TextEncoder().encode(JSON.stringify(capsule)).byteLength
  const cap = isDemo ? 128_000 : 1_000_000
  sizeReadout.textContent = `${(bytes / 1000).toFixed(1)} / ${cap / 1000} KB`
  capFill.style.transform = `scaleX(${Math.min(1, bytes / cap)})`
  capGauge.setAttribute('aria-valuenow', String(Math.round(Math.min(1, bytes / cap) * 100)))
  replayButton.disabled = capsule.events.length === 0
  exportButton.disabled = false
  overlay.hidden = false
  overlay.innerHTML = capsule.events.length ? '<strong>Capsule loaded</strong><span>Press “Replay capsule” to reproduce the run.</span>' : '<strong>Empty capsule</strong><span>This valid file has no input events to replay.</span>'
  setMessage(notice)
  syncStatus()
}

function loadDemoSample() {
  const seed = 'RC-SAMPLE-FAULT-17'
  resetGame(seed)
  const fault = faults[0]!
  loadCapsule({
    format: 'replay-capsule',
    version: 1,
    createdAt: '2026-08-30T00:00:00.000Z',
    durationMs: 640,
    seed,
    truncated: false,
    events: [{ type: 'pointer', action: 'down', x: fault.x, y: fault.y, button: 0, buttons: 1, pointerId: 1, pointerType: 'mouse', pressure: .5, t: 320 }],
    checkpoints: [{ label: 'fault-contact', data: { x: fault.x, y: fault.y }, t: 320 }],
  }, 'Sample capsule loaded. Replay it or record a new run.')
  overlay.innerHTML = '<strong>Sample capsule loaded</strong><span>Replay it or start a new recording.</span>'
}

recordButton.addEventListener('click', () => {
  const seed = `RC-${Date.now().toString(36).toUpperCase()}`
  capsule = undefined
  replayButton.disabled = true
  exportButton.disabled = true
  eventReadout.textContent = '0'
  timeReadout.textContent = '0.00 s'
  sizeReadout.textContent = '0 / 128 KB'
  capFill.style.transform = 'scaleX(0)'
  capGauge.setAttribute('aria-valuenow', '0')
  resetGame(seed)
  recorder = createRunRecorder(seed)
  recorder.start()
  overlay.hidden = true
  canvas.focus()
  setMessage('Recording this game surface now. Text fields remain excluded.')
  syncStatus()
})

stopButton.addEventListener('click', () => {
  recorder?.stop()
  capsule = recorder?.export()
  exportButton.disabled = !capsule
  replayButton.disabled = !capsule || capsule.events.length === 0
  setMessage(capsule?.events.length ? 'Recording stopped. Download or replay the capsule.' : 'Stopped with no inputs. Move the probe after starting to create a useful capsule.')
  syncStatus()
})

resetButton.addEventListener('click', () => {
  recorder?.clear()
  recorder = undefined
  capsule = undefined
  resetGame('RC-DEMO')
  overlay.hidden = false
  overlay.innerHTML = '<strong>Ready to record</strong><span>Start recording to begin a seeded run.</span>'
  exportButton.disabled = true
  replayButton.disabled = true
  eventReadout.textContent = '0'
  timeReadout.textContent = '0.00 s'
  sizeReadout.textContent = '0 / 128 KB'
  capFill.style.transform = 'scaleX(0)'
  setMessage('No input has been captured yet. This tab does not save your run.')
  syncStatus()
})

exportButton.addEventListener('click', () => {
  if (!capsule) return
  downloadCapsule(capsule, `replay-${String(capsule.seed).toLowerCase()}.json`)
  setMessage('Capsule downloaded. It contains no video or typed text.', 'success')
})

importInput.addEventListener('change', async () => {
  const file = importInput.files?.[0]
  if (!file) return
  try {
    const imported = await importCapsule(file)
    loadCapsule(imported, imported.events.length ? `Imported ${imported.events.length} events. Seed and checkpoints validated locally.` : 'The imported capsule is valid but contains no input events.')
  } catch (error) {
    capsule = undefined
    replayButton.disabled = true
    exportButton.disabled = true
    setMessage(error instanceof Error ? `${error.message} Choose a Replay Capsule JSON file under 1 MB.` : 'Import failed. Choose a Replay Capsule JSON file under 1 MB.', 'error')
  } finally {
    importInput.value = ''
    syncStatus()
  }
})

async function replayCapsule() {
  if (!capsule || capsule.events.length === 0) return
  replaying = true
  replayedEvents = []
  runEnded = false
  resetGame(String(capsule.seed))
  overlay.hidden = true
  setMessage('Replaying recorded timing at 2× speed…')
  syncStatus()
  const replay = createPlayer(capsule, {
    speed: 2,
    onEvent: (event) => {
      replayedEvents.push(event)
      applyEvent(event)
    },
    onProgress: (elapsed, duration) => {
      const progress = duration ? Math.min(1, elapsed / duration) : 1
      timelineFill.style.transform = `scaleX(${progress})`
      timeline.setAttribute('aria-valuenow', String(Math.round(progress * 100)))
    },
  })
  await replay.play()
  replaying = false
  timelineFill.style.transform = 'scaleX(1)'
  timeline.setAttribute('aria-valuenow', '100')
  document.body.dataset.replayedEvents = JSON.stringify(replayedEvents)
  document.body.dataset.replayOutcome = runEnded ? 'recorded-outcome-reproduced' : 'recorded-sequence-applied'
  setMessage(runEnded ? 'Replay complete: the recorded outcome was reproduced.' : `Replay complete: the same ${replayedEvents.length} recorded events were applied.`, 'success')
  syncStatus()
}

replayButton.addEventListener('click', () => { void replayCapsule() })
replayFirstScreenButton?.addEventListener('click', () => { void replayCapsule() })

window.addEventListener('keydown', (event) => {
  if (recorder?.state !== 'recording' || !['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'KeyW', 'KeyA', 'KeyS', 'KeyD'].includes(event.code)) return
  event.preventDefault()
  applyEvent({ type: 'key', action: 'down', code: event.code, repeat: event.repeat, t: 0 })
})

canvas.addEventListener('pointerdown', (event) => {
  if (recorder?.state !== 'recording') return
  const box = canvas.getBoundingClientRect()
  applyEvent({ type: 'pointer', action: 'down', x: (event.clientX - box.left) / box.width, y: (event.clientY - box.top) / box.height, button: event.button, buttons: event.buttons, pointerId: event.pointerId, pointerType: event.pointerType, pressure: event.pressure, t: 0 })
})

for (const button of document.querySelectorAll<HTMLElement>('[data-copy]')) {
  button.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(button.dataset.copy ?? '')
      $('.copy-result').textContent = 'Install command copied.'
    } catch { $('.copy-result').textContent = 'Copy unavailable. Select the install command in the package section.' }
  })
}

for (const button of document.querySelectorAll<HTMLElement>('[data-copy-target]')) {
  button.addEventListener('click', async () => {
    const source = document.getElementById(button.dataset.copyTarget ?? '')
    if (!source) return
    try { await navigator.clipboard.writeText(source.textContent ?? ''); button.textContent = 'Copied' }
    catch { button.textContent = 'Select code to copy' }
  })
}

const syncOffline = () => { offlineNote.hidden = navigator.onLine }
window.addEventListener('online', syncOffline)
window.addEventListener('offline', syncOffline)
resetDemoButton?.addEventListener('click', loadDemoSample)
syncOffline()
if (isDemo) loadDemoSample()
else {
  resetGame('RC-DEMO')
  syncStatus()
}
