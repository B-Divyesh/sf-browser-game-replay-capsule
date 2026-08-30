import { describe, expect, it } from 'vitest'
import { createPlayer, importCapsule, type ReplayCapsule } from '../src/index'
import { createSeededFailureModel, seededFault } from '../examples/seeded-failure-model'

const capsuleForSeed = (seed: string): ReplayCapsule => {
  const fault = seededFault(seed)
  return {
    format: 'replay-capsule',
    version: 1,
    createdAt: '2026-08-28T00:00:00.000Z',
    durationMs: 0,
    seed,
    truncated: false,
    events: [{ type: 'pointer', action: 'down', x: fault.x, y: fault.y, button: 0, buttons: 1, pointerId: 1, pointerType: 'mouse', pressure: .5, t: 0 }],
    checkpoints: [{ label: 'seeded-fault', data: { x: fault.x, y: fault.y }, t: 0 }],
  }
}

describe('Phaser seeded-failure fixture', () => {
  it('@claim:seeded-failure-fixture reproduces at least 90% of 20 seeded failures from imported capsules', async () => {
    let reproduced = 0
    for (let index = 0; index < 20; index += 1) {
      const seed = `phaser-seeded-failure-${index}`
      const imported = await importCapsule(JSON.stringify(capsuleForSeed(seed)))
      const model = createSeededFailureModel(String(imported.seed))
      const player = createPlayer(imported, { onEvent: (event) => model.apply(event) })
      await player.play()
      if (model.failed) reproduced += 1
    }
    expect(reproduced).toBeGreaterThanOrEqual(18)
    expect(reproduced).toBe(20)
  })
})
