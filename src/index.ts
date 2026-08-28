export const CAPSULE_FORMAT = 'replay-capsule' as const
export const CAPSULE_VERSION = 1 as const
export const DEFAULT_MAX_BYTES = 128_000
export const HARD_MAX_BYTES = 1_000_000

export type JsonValue = null | boolean | number | string | JsonValue[] | { [key: string]: JsonValue }

export type ReplayEvent =
  | { type: 'key'; action: 'down' | 'up'; code: string; repeat: boolean; t: number }
  | {
      type: 'pointer'
      action: 'down' | 'move' | 'up' | 'cancel'
      x: number
      y: number
      button: number
      buttons: number
      pointerId: number
      pointerType: string
      pressure: number
      t: number
    }
  | {
      type: 'gamepad'
      index: number
      connected: boolean
      axes: number[]
      buttons: number[]
      browserTimestamp?: number
      t: number
    }

export interface ReplayCheckpoint {
  label: string
  data: JsonValue
  t: number
}

export interface ReplayCapsule {
  format: typeof CAPSULE_FORMAT
  version: typeof CAPSULE_VERSION
  createdAt: string
  durationMs: number
  seed: JsonValue
  events: ReplayEvent[]
  checkpoints: ReplayCheckpoint[]
  truncated: boolean
}

export type RecorderState = 'idle' | 'recording' | 'stopped' | 'limit-reached'

export interface RecorderStatus {
  state: RecorderState
  bytes: number
  maxBytes: number
  eventCount: number
  checkpointCount: number
}

export interface RecorderOptions {
  seed: JsonValue
  /** Pointer events are captured here. Keyboard events use `keyTarget` or window. */
  target?: EventTarget
  keyTarget?: EventTarget
  maxBytes?: number
  captureGamepads?: boolean
  pointerMoveIntervalMs?: number
  now?: () => number
  onStatus?: (status: RecorderStatus) => void
}

export interface ReplayRecorder {
  readonly state: RecorderState
  readonly status: RecorderStatus
  start(): void
  stop(): void
  clear(): void
  checkpoint(label: string, data?: JsonValue): boolean
  export(): ReplayCapsule
}

export class CapsuleError extends Error {
  constructor(message: string, public readonly code: 'invalid' | 'unsupported' | 'too-large') {
    super(message)
    this.name = 'CapsuleError'
  }
}

const encoder = new TextEncoder()
const byteLength = (value: unknown) => encoder.encode(JSON.stringify(value)).byteLength
const round = (value: number, places = 4) => Number(value.toFixed(places))

function assertJson(value: unknown, path = 'value'): asserts value is JsonValue {
  if (value === null || typeof value === 'string' || typeof value === 'boolean') return
  if (typeof value === 'number' && Number.isFinite(value)) return
  if (Array.isArray(value)) {
    value.forEach((entry, index) => assertJson(entry, `${path}[${index}]`))
    return
  }
  if (typeof value === 'object' && Object.getPrototypeOf(value) === Object.prototype) {
    for (const [key, entry] of Object.entries(value)) assertJson(entry, `${path}.${key}`)
    return
  }
  throw new CapsuleError(`${path} must contain JSON-safe values only.`, 'invalid')
}

function isTextEntry(target: EventTarget | null): boolean {
  if (typeof Element === 'undefined' || !(target instanceof Element)) return false
  return target.matches('input, textarea, select, [contenteditable]:not([contenteditable="false"])') ||
    Boolean(target.closest('[contenteditable]:not([contenteditable="false"])'))
}

function validateMaxBytes(value: number): number {
  if (!Number.isInteger(value) || value < 4_096 || value > HARD_MAX_BYTES) {
    throw new RangeError(`maxBytes must be an integer from 4096 to ${HARD_MAX_BYTES}.`)
  }
  return value
}

export function createRecorder(options: RecorderOptions): ReplayRecorder {
  assertJson(options.seed, 'seed')
  const maxBytes = validateMaxBytes(options.maxBytes ?? DEFAULT_MAX_BYTES)
  const browserWindow = typeof window === 'undefined' ? undefined : window
  const pointerTarget = options.target ?? browserWindow
  const keyTarget = options.keyTarget ?? browserWindow
  if (!pointerTarget || !keyTarget) throw new Error('createRecorder() requires a browser or explicit EventTarget options.')
  const now = options.now ?? (() => performance.now())
  const interval = Math.max(0, options.pointerMoveIntervalMs ?? 24)
  const captureGamepads = options.captureGamepads ?? true
  const createdAt = new Date().toISOString()
  let state: RecorderState = 'idle'
  let startedAt = 0
  let stoppedAt = 0
  let lastMoveAt = -Infinity
  let animationFrame: number | undefined
  let events: ReplayEvent[] = []
  let checkpoints: ReplayCheckpoint[] = []
  const gamepadSnapshots = new Map<number, string>()

  const timestamp = () => Math.max(0, round((state === 'recording' ? now() : stoppedAt) - startedAt, 2))
  const makeCapsule = (): ReplayCapsule => ({
    format: CAPSULE_FORMAT,
    version: CAPSULE_VERSION,
    createdAt,
    durationMs: state === 'idle' ? 0 : timestamp(),
    seed: options.seed,
    events: [...events],
    checkpoints: [...checkpoints],
    truncated: state === 'limit-reached',
  })

  const getStatus = (): RecorderStatus => ({
    state,
    bytes: byteLength(makeCapsule()),
    maxBytes,
    eventCount: events.length,
    checkpointCount: checkpoints.length,
  })
  const notify = () => options.onStatus?.(getStatus())

  const removeListeners = () => {
    keyTarget.removeEventListener('keydown', onKey)
    keyTarget.removeEventListener('keyup', onKey)
    pointerTarget.removeEventListener('pointerdown', onPointer)
    pointerTarget.removeEventListener('pointermove', onPointer)
    pointerTarget.removeEventListener('pointerup', onPointer)
    pointerTarget.removeEventListener('pointercancel', onPointer)
    if (animationFrame !== undefined && typeof cancelAnimationFrame === 'function') cancelAnimationFrame(animationFrame)
    animationFrame = undefined
  }

  const reachLimit = () => {
    stoppedAt = now()
    state = 'limit-reached'
    removeListeners()
    notify()
  }

  const append = (entry: ReplayEvent | ReplayCheckpoint, kind: 'event' | 'checkpoint') => {
    const list = kind === 'event' ? events : checkpoints
    list.push(entry as never)
    if (byteLength(makeCapsule()) > maxBytes) {
      list.pop()
      reachLimit()
      return false
    }
    notify()
    return true
  }

  function onKey(raw: Event) {
    if (state !== 'recording' || !(raw instanceof KeyboardEvent) || isTextEntry(raw.target)) return
    append({ type: 'key', action: raw.type === 'keydown' ? 'down' : 'up', code: raw.code, repeat: raw.repeat, t: timestamp() }, 'event')
  }

  function onPointer(raw: Event) {
    if (state !== 'recording' || !(raw instanceof PointerEvent) || isTextEntry(raw.target)) return
    const action = raw.type.slice(7) as 'down' | 'move' | 'up' | 'cancel'
    const currentTime = now()
    if (action === 'move' && currentTime - lastMoveAt < interval) return
    if (action === 'move') lastMoveAt = currentTime
    let x = raw.clientX
    let y = raw.clientY
    if (typeof Element !== 'undefined' && pointerTarget instanceof Element) {
      const box = pointerTarget.getBoundingClientRect()
      x = box.width ? Math.max(0, Math.min(1, (raw.clientX - box.left) / box.width)) : 0
      y = box.height ? Math.max(0, Math.min(1, (raw.clientY - box.top) / box.height)) : 0
    }
    append({
      type: 'pointer', action, x: round(x), y: round(y), button: raw.button, buttons: raw.buttons,
      pointerId: raw.pointerId, pointerType: raw.pointerType || 'unknown', pressure: round(raw.pressure), t: timestamp(),
    }, 'event')
  }

  const sampleGamepads = () => {
    if (state !== 'recording' || typeof navigator === 'undefined' || !navigator.getGamepads) return
    for (const pad of navigator.getGamepads()) {
      if (!pad) continue
      const axes = Array.from(pad.axes, (value) => round(value, 3))
      const buttons = Array.from(pad.buttons, (button) => round(button.value, 3))
      const signature = JSON.stringify([axes, buttons, pad.connected])
      if (gamepadSnapshots.get(pad.index) === signature) continue
      gamepadSnapshots.set(pad.index, signature)
      const event: ReplayEvent = { type: 'gamepad', index: pad.index, connected: pad.connected, axes, buttons, t: timestamp() }
      if (Number.isFinite(pad.timestamp) && pad.timestamp > 0) event.browserTimestamp = round(pad.timestamp, 2)
      if (!append(event, 'event')) return
    }
    if (typeof requestAnimationFrame === 'function') animationFrame = requestAnimationFrame(sampleGamepads)
  }

  return {
    get state() { return state },
    get status() { return getStatus() },
    start() {
      if (state === 'recording') return
      if (state !== 'idle') throw new Error('Call clear() before starting a new recording.')
      startedAt = now()
      stoppedAt = startedAt
      state = 'recording'
      keyTarget.addEventListener('keydown', onKey)
      keyTarget.addEventListener('keyup', onKey)
      pointerTarget.addEventListener('pointerdown', onPointer)
      pointerTarget.addEventListener('pointermove', onPointer)
      pointerTarget.addEventListener('pointerup', onPointer)
      pointerTarget.addEventListener('pointercancel', onPointer)
      if (captureGamepads && typeof requestAnimationFrame === 'function') animationFrame = requestAnimationFrame(sampleGamepads)
      notify()
    },
    stop() {
      if (state !== 'recording') return
      stoppedAt = now()
      state = 'stopped'
      removeListeners()
      notify()
    },
    clear() {
      removeListeners()
      events = []
      checkpoints = []
      gamepadSnapshots.clear()
      startedAt = 0
      stoppedAt = 0
      state = 'idle'
      notify()
    },
    checkpoint(label, data = null) {
      if (state !== 'recording') return false
      if (!label.trim() || label.length > 120) throw new RangeError('Checkpoint labels must be 1–120 characters.')
      assertJson(data, 'checkpoint data')
      return append({ label, data, t: timestamp() }, 'checkpoint')
    },
    export() {
      const capsule = makeCapsule()
      if (byteLength(capsule) > maxBytes) throw new CapsuleError('Capsule exceeds its configured size limit.', 'too-large')
      return capsule
    },
  }
}

const isFiniteNumber = (value: unknown): value is number => typeof value === 'number' && Number.isFinite(value)
const isTimestamp = (value: unknown): value is number => isFiniteNumber(value) && value >= 0

export function validateCapsule(value: unknown): ReplayCapsule {
  if (!value || typeof value !== 'object') throw new CapsuleError('Capsule must be a JSON object.', 'invalid')
  const capsule = value as Record<string, unknown>
  if (capsule.format !== CAPSULE_FORMAT) throw new CapsuleError('This file is not a Replay Capsule.', 'invalid')
  if (capsule.version !== CAPSULE_VERSION) throw new CapsuleError(`Capsule version ${String(capsule.version)} is not supported.`, 'unsupported')
  if (typeof capsule.createdAt !== 'string' || !isTimestamp(capsule.durationMs) || typeof capsule.truncated !== 'boolean') {
    throw new CapsuleError('Capsule metadata is incomplete.', 'invalid')
  }
  assertJson(capsule.seed, 'seed')
  if (!Array.isArray(capsule.events) || !Array.isArray(capsule.checkpoints)) throw new CapsuleError('Capsule events and checkpoints must be arrays.', 'invalid')
  if (capsule.events.length > 100_000 || capsule.checkpoints.length > 10_000) throw new CapsuleError('Capsule contains too many entries.', 'invalid')

  for (const [index, raw] of capsule.events.entries()) {
    if (!raw || typeof raw !== 'object') throw new CapsuleError(`Event ${index} is invalid.`, 'invalid')
    const event = raw as Record<string, unknown>
    if (!isTimestamp(event.t)) throw new CapsuleError(`Event ${index} has an invalid timestamp.`, 'invalid')
    if (event.type === 'key') {
      if (!['down', 'up'].includes(String(event.action)) || typeof event.code !== 'string' || typeof event.repeat !== 'boolean') throw new CapsuleError(`Key event ${index} is invalid.`, 'invalid')
    } else if (event.type === 'pointer') {
      if (!['down', 'move', 'up', 'cancel'].includes(String(event.action)) || !isFiniteNumber(event.x) || !isFiniteNumber(event.y) || typeof event.pointerType !== 'string') throw new CapsuleError(`Pointer event ${index} is invalid.`, 'invalid')
      for (const key of ['button', 'buttons', 'pointerId', 'pressure']) if (typeof event[key] !== 'number' || !Number.isFinite(event[key])) throw new CapsuleError(`Pointer event ${index} is invalid.`, 'invalid')
    } else if (event.type === 'gamepad') {
      if (typeof event.index !== 'number' || typeof event.connected !== 'boolean' || !Array.isArray(event.axes) || !Array.isArray(event.buttons) || !event.axes.every(isFiniteNumber) || !event.buttons.every((button) => isFiniteNumber(button) && button >= 0)) throw new CapsuleError(`Gamepad event ${index} is invalid.`, 'invalid')
    } else throw new CapsuleError(`Event ${index} has an unknown type.`, 'invalid')
  }
  for (const [index, raw] of capsule.checkpoints.entries()) {
    if (!raw || typeof raw !== 'object') throw new CapsuleError(`Checkpoint ${index} is invalid.`, 'invalid')
    const checkpoint = raw as Record<string, unknown>
    if (typeof checkpoint.label !== 'string' || !checkpoint.label || !isTimestamp(checkpoint.t)) throw new CapsuleError(`Checkpoint ${index} is invalid.`, 'invalid')
    assertJson(checkpoint.data, `checkpoint ${index} data`)
  }
  return value as ReplayCapsule
}

export async function importCapsule(source: string | Blob | unknown, maxBytes = HARD_MAX_BYTES): Promise<ReplayCapsule> {
  validateMaxBytes(maxBytes)
  let value: unknown = source
  if (typeof source === 'string') {
    if (encoder.encode(source).byteLength > maxBytes) throw new CapsuleError(`Capsule exceeds the ${maxBytes}-byte import limit.`, 'too-large')
    try { value = JSON.parse(source) } catch { throw new CapsuleError('Capsule is not valid JSON.', 'invalid') }
  } else if (typeof Blob !== 'undefined' && source instanceof Blob) {
    if (source.size > maxBytes) throw new CapsuleError(`Capsule exceeds the ${maxBytes}-byte import limit.`, 'too-large')
    try { value = JSON.parse(await source.text()) } catch { throw new CapsuleError('Capsule is not valid JSON.', 'invalid') }
  }
  if (byteLength(value) > maxBytes) throw new CapsuleError(`Capsule exceeds the ${maxBytes}-byte import limit.`, 'too-large')
  return validateCapsule(value)
}

export function downloadCapsule(capsule: ReplayCapsule, filename = 'bug.replay.json'): void {
  validateCapsule(capsule)
  const blob = new Blob([JSON.stringify(capsule, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename.endsWith('.json') ? filename : `${filename}.json`
  anchor.click()
  setTimeout(() => URL.revokeObjectURL(url), 0)
}

export type PlayerState = 'idle' | 'playing' | 'paused' | 'finished' | 'stopped'

export interface PlayerOptions {
  speed?: number
  onEvent: (event: ReplayEvent) => void
  onCheckpoint?: (checkpoint: ReplayCheckpoint) => void
  onState?: (state: PlayerState) => void
  onProgress?: (elapsedMs: number, durationMs: number) => void
}

export interface ReplayPlayer {
  readonly state: PlayerState
  play(): Promise<void>
  pause(): void
  resume(): void
  stop(): void
}

export function createPlayer(capsuleInput: ReplayCapsule, options: PlayerOptions): ReplayPlayer {
  const capsule = validateCapsule(capsuleInput)
  const speed = options.speed ?? 1
  if (!Number.isFinite(speed) || speed <= 0) throw new RangeError('Playback speed must be greater than zero.')
  const queue = [
    ...capsule.events.map((value) => ({ kind: 'event' as const, value })),
    ...capsule.checkpoints.map((value) => ({ kind: 'checkpoint' as const, value })),
  ].sort((a, b) => a.value.t - b.value.t)
  let state: PlayerState = 'idle'
  let index = 0
  let timer: ReturnType<typeof setTimeout> | undefined
  let anchorTime = 0
  let elapsed = 0
  let resolvePlay: (() => void) | undefined

  const setState = (next: PlayerState) => { state = next; options.onState?.(next) }
  const clearTimer = () => { if (timer !== undefined) clearTimeout(timer); timer = undefined }
  const finish = (next: 'finished' | 'stopped') => {
    clearTimer()
    setState(next)
    options.onProgress?.(next === 'finished' ? capsule.durationMs : elapsed, capsule.durationMs)
    resolvePlay?.()
    resolvePlay = undefined
  }
  const schedule = () => {
    if (state !== 'playing') return
    if (index >= queue.length) { finish('finished'); return }
    const item = queue[index]!
    const currentElapsed = elapsed + (performance.now() - anchorTime) * speed
    const delay = Math.max(0, (item.value.t - currentElapsed) / speed)
    timer = setTimeout(() => {
      if (state !== 'playing') return
      if (item.kind === 'event') options.onEvent(item.value)
      else options.onCheckpoint?.(item.value)
      index += 1
      options.onProgress?.(item.value.t, capsule.durationMs)
      schedule()
    }, delay)
  }

  return {
    get state() { return state },
    play() {
      if (state === 'playing' || state === 'paused') throw new Error('Playback is already active.')
      clearTimer()
      index = 0
      elapsed = 0
      anchorTime = performance.now()
      setState('playing')
      const promise = new Promise<void>((resolve) => { resolvePlay = resolve })
      schedule()
      return promise
    },
    pause() {
      if (state !== 'playing') return
      elapsed += (performance.now() - anchorTime) * speed
      clearTimer()
      setState('paused')
    },
    resume() {
      if (state !== 'paused') return
      anchorTime = performance.now()
      setState('playing')
      schedule()
    },
    stop() {
      if (state !== 'playing' && state !== 'paused') return
      if (state === 'playing') elapsed += (performance.now() - anchorTime) * speed
      finish('stopped')
    },
  }
}
