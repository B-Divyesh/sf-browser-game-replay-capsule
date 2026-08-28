import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  CAPSULE_FORMAT,
  CAPSULE_VERSION,
  CapsuleError,
  createPlayer,
  createRecorder,
  downloadCapsule,
  importCapsule,
  validateCapsule,
  type ReplayCapsule,
} from '../src/index'

class TestKeyboardEvent extends Event {
  readonly code: string
  readonly repeat: boolean
  constructor(type: string, init: { code: string; repeat?: boolean }) {
    super(type)
    this.code = init.code
    this.repeat = init.repeat ?? false
  }
}

afterEach(() => vi.unstubAllGlobals())

describe('createRecorder', () => {
  it('records the documented key and checkpoint flow only after start', () => {
    vi.stubGlobal('KeyboardEvent', TestKeyboardEvent)
    const target = new EventTarget()
    let clock = 100
    const recorder = createRecorder({ seed: 'level-7', target, keyTarget: target, captureGamepads: false, now: () => clock })

    target.dispatchEvent(new TestKeyboardEvent('keydown', { code: 'ArrowRight' }))
    expect(recorder.export().events).toHaveLength(0)

    recorder.start()
    clock = 125.25
    target.dispatchEvent(new TestKeyboardEvent('keydown', { code: 'ArrowRight' }))
    clock = 130
    expect(recorder.checkpoint('level-loaded', { level: 7 })).toBe(true)
    recorder.stop()

    expect(recorder.export()).toMatchObject({
      format: CAPSULE_FORMAT,
      version: CAPSULE_VERSION,
      seed: 'level-7',
      durationMs: 30,
      truncated: false,
      events: [{ type: 'key', action: 'down', code: 'ArrowRight', t: 25.25 }],
      checkpoints: [{ label: 'level-loaded', data: { level: 7 }, t: 30 }],
    })
  })

  it('stops before crossing the strict byte cap', () => {
    const target = new EventTarget()
    const recorder = createRecorder({ seed: 42, target, keyTarget: target, captureGamepads: false, maxBytes: 4_096, now: () => 10 })
    recorder.start()
    expect(recorder.checkpoint('oversized', 'x'.repeat(5_000))).toBe(false)
    expect(recorder.state).toBe('limit-reached')
    expect(new TextEncoder().encode(JSON.stringify(recorder.export())).byteLength).toBeLessThanOrEqual(4_096)
    expect(recorder.export().truncated).toBe(true)
  })

  for (const maxBytes of [4_096, 128_000, 1_000_000]) {
    it(`keeps an exactly ${maxBytes.toLocaleString()}-byte recording exportable after stop changes duration metadata`, async () => {
      let clock = 0
      const makeRecorder = () => createRecorder({
        seed: 'duration-boundary', target: new EventTarget(), keyTarget: new EventTarget(), captureGamepads: false, maxBytes, now: () => clock,
      })

      // JSON byte growth is linear for this ASCII checkpoint payload. Measure
      // the fixed checkpoint envelope, then create a fresh exact-cap run.
      const measured = makeRecorder()
      measured.start()
      const emptyBytes = measured.status.bytes
      expect(measured.checkpoint('boundary', '')).toBe(true)
      const envelopeBytes = measured.status.bytes - emptyBytes

      const recorder = makeRecorder()
      recorder.start()
      expect(recorder.checkpoint('boundary', 'x'.repeat(maxBytes - emptyBytes - envelopeBytes))).toBe(true)
      expect(recorder.status.bytes).toBe(maxBytes)

      clock = 100
      recorder.stop()
      const capsule = recorder.export()
      const serialized = JSON.stringify(capsule)

      expect(recorder.state).toBe('limit-reached')
      expect(capsule.truncated).toBe(true)
      expect(new TextEncoder().encode(serialized).byteLength).toBeLessThanOrEqual(maxBytes)
      await expect(importCapsule(serialized, maxBytes)).resolves.toEqual(capsule)
    })
  }

  it('finalizes a recording at the cap when export is the first duration-changing operation', async () => {
    let clock = 0
    const target = new EventTarget()
    const recorder = createRecorder({ seed: 'export-boundary', target, keyTarget: target, captureGamepads: false, maxBytes: 4_096, now: () => clock })
    recorder.start()
    const emptyBytes = recorder.status.bytes
    expect(recorder.checkpoint('boundary', '')).toBe(true)
    const envelopeBytes = recorder.status.bytes - emptyBytes

    recorder.clear()
    recorder.start()
    expect(recorder.checkpoint('boundary', 'x'.repeat(4_096 - emptyBytes - envelopeBytes))).toBe(true)
    clock = 100

    const capsule = recorder.export()
    expect(recorder.state).toBe('limit-reached')
    expect(new TextEncoder().encode(JSON.stringify(capsule)).byteLength).toBeLessThanOrEqual(4_096)
    await expect(importCapsule(JSON.stringify(capsule), 4_096)).resolves.toEqual(capsule)
  })

  it('keeps a near-cap recorder download within the same cap and importable', async () => {
    const target = new EventTarget()
    const recorder = createRecorder({ seed: 'near-cap', target, keyTarget: target, captureGamepads: false, maxBytes: 128_000, now: () => 10 })
    recorder.start()
    expect(recorder.checkpoint('near-cap-payload', 'x'.repeat(127_000))).toBe(true)
    recorder.stop()
    const capsule = recorder.export()
    const compact = JSON.stringify(capsule)
    expect(new TextEncoder().encode(compact).byteLength).toBeGreaterThan(126_000)
    expect(new TextEncoder().encode(compact).byteLength).toBeLessThanOrEqual(recorder.status.maxBytes)

    let downloaded: Blob | undefined
    const anchor = { href: '', download: '', click: vi.fn() }
    vi.stubGlobal('URL', {
      createObjectURL: vi.fn((blob: Blob) => { downloaded = blob; return 'blob:replay-capsule' }),
      revokeObjectURL: vi.fn(),
    })
    vi.stubGlobal('document', { createElement: vi.fn(() => anchor) })

    downloadCapsule(capsule, 'near-cap')
    expect(anchor.download).toBe('near-cap.json')
    expect(anchor.click).toHaveBeenCalledOnce()
    expect(downloaded).toBeDefined()
    expect(await downloaded!.text()).toBe(compact)
    await expect(importCapsule(downloaded!, recorder.status.maxBytes)).resolves.toEqual(capsule)
  })

  it('keeps a near-1 MB recorder download within the hard import limit', async () => {
    const target = new EventTarget()
    const recorder = createRecorder({ seed: 'hard-cap', target, keyTarget: target, captureGamepads: false, maxBytes: 1_000_000, now: () => 10 })
    recorder.start()
    expect(recorder.checkpoint('near-hard-cap', 'x'.repeat(999_000))).toBe(true)
    recorder.stop()
    const capsule = recorder.export()
    expect(new TextEncoder().encode(JSON.stringify(capsule)).byteLength).toBeGreaterThan(998_000)
    expect(recorder.status.bytes).toBeLessThanOrEqual(1_000_000)

    let downloaded: Blob | undefined
    vi.stubGlobal('URL', {
      createObjectURL: vi.fn((blob: Blob) => { downloaded = blob; return 'blob:hard-cap' }),
      revokeObjectURL: vi.fn(),
    })
    vi.stubGlobal('document', { createElement: vi.fn(() => ({ href: '', download: '', click: vi.fn() })) })
    downloadCapsule(capsule)
    await expect(importCapsule(downloaded!)).resolves.toEqual(capsule)
  })

  it('rejects non-JSON checkpoint values', () => {
    const target = new EventTarget()
    const recorder = createRecorder({ seed: null, target, keyTarget: target, captureGamepads: false })
    recorder.start()
    expect(() => recorder.checkpoint('bad', { value: undefined } as never)).toThrow(CapsuleError)
  })

  it('rejects an initial seed that already exceeds the configured cap', () => {
    const target = new EventTarget()
    expect(() => createRecorder({ seed: 'x'.repeat(5_000), target, keyTarget: target, captureGamepads: false, maxBytes: 4_096 })).toThrowError(expect.objectContaining({ code: 'too-large' }))
  })
})

const validCapsule = (): ReplayCapsule => ({
  format: CAPSULE_FORMAT,
  version: CAPSULE_VERSION,
  createdAt: '2026-08-28T00:00:00.000Z',
  durationMs: 2,
  seed: { level: 7 },
  truncated: false,
  events: [
    { type: 'gamepad', index: 0, connected: true, axes: [-0.5, 0.25], buttons: [0, 1], t: 0 },
    { type: 'key', action: 'down', code: 'ArrowRight', repeat: false, t: 1 },
  ],
  checkpoints: [{ label: 'done', data: { x: 2 }, t: 2 }],
})

describe('capsule import and validation', () => {
  it('round-trips a valid capsule and accepts signed gamepad axes', async () => {
    const parsed = await importCapsule(JSON.stringify(validCapsule()))
    expect(parsed).toEqual(validCapsule())
  })

  it('rejects malformed, unsupported, and oversized inputs with useful codes', async () => {
    await expect(importCapsule('{nope')).rejects.toMatchObject({ code: 'invalid' })
    expect(() => validateCapsule({ ...validCapsule(), version: 2 })).toThrowError(expect.objectContaining({ code: 'unsupported' }))
    await expect(importCapsule(' '.repeat(4_097), 4_096)).rejects.toMatchObject({ code: 'too-large' })
  })

  it('rejects malformed gamepad diagnostic metadata and indexes', async () => {
    const malformedTimestamp = validCapsule()
    malformedTimestamp.events[0] = {
      type: 'gamepad', index: 0, connected: true, axes: [], buttons: [], browserTimestamp: 'not-a-number' as never, t: 0,
    }
    expect(() => validateCapsule(malformedTimestamp)).toThrowError(expect.objectContaining({ code: 'invalid' }))
    await expect(importCapsule(JSON.stringify(malformedTimestamp))).rejects.toMatchObject({ code: 'invalid' })

    for (const index of [-1, 0.5, Infinity]) {
      const malformedIndex = validCapsule()
      malformedIndex.events[0] = { type: 'gamepad', index, connected: true, axes: [], buttons: [], t: 0 }
      expect(() => validateCapsule(malformedIndex)).toThrowError(expect.objectContaining({ code: 'invalid' }))
    }

    const validTimestamp = validCapsule()
    validTimestamp.events[0] = { type: 'gamepad', index: 0, connected: true, axes: [], buttons: [], browserTimestamp: 14.25, t: 0 }
    expect(validateCapsule(validTimestamp)).toEqual(validTimestamp)
  })
})

describe('createPlayer', () => {
  it('emits events and checkpoints in timestamp order', async () => {
    const received: string[] = []
    const player = createPlayer(validCapsule(), {
      speed: 100,
      onEvent: (event) => received.push(event.type),
      onCheckpoint: (checkpoint) => received.push(checkpoint.label),
    })
    await player.play()
    expect(received).toEqual(['gamepad', 'key', 'done'])
    expect(player.state).toBe('finished')
  })

  it('can stop an active replay and resolves its play promise', async () => {
    const capsule = validCapsule()
    capsule.events = [{ type: 'key', action: 'down', code: 'Space', repeat: false, t: 10_000 }]
    capsule.durationMs = 10_000
    const player = createPlayer(capsule, { onEvent: () => undefined })
    const finished = player.play()
    player.stop()
    await finished
    expect(player.state).toBe('stopped')
  })
})
