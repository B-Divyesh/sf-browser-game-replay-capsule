import type { ReplayEvent } from '../src/index'

export type FailurePosition = { x: number; y: number }

const hashSeed = (seed: string) => {
  let hash = 2166136261
  for (let index = 0; index < seed.length; index += 1) {
    hash ^= seed.charCodeAt(index)
    hash = Math.imul(hash, 16777619)
  }
  return hash >>> 0
}

/** The deterministic game state shared by the Phaser fixture and its trial. */
export function seededFault(seed: string): FailurePosition {
  const hash = hashSeed(seed)
  return {
    x: .25 + (hash % 50) / 100,
    y: .2 + (Math.floor(hash / 64) % 60) / 100,
  }
}

export function createSeededFailureModel(seed: string) {
  const fault = seededFault(seed)
  let player: FailurePosition = { x: .1, y: .5 }
  let failed = false

  const assess = () => {
    if (Math.abs(player.x - fault.x) < .035 && Math.abs(player.y - fault.y) < .035) failed = true
  }

  return {
    get failed() { return failed },
    get player() { return { ...player } },
    fault,
    apply(event: ReplayEvent) {
      if (event.type === 'pointer' && event.action === 'down') player = { x: event.x, y: event.y }
      if (event.type === 'key' && event.action === 'down') {
        if (event.code === 'ArrowRight') player.x += .035
        if (event.code === 'ArrowLeft') player.x -= .035
        if (event.code === 'ArrowDown') player.y += .035
        if (event.code === 'ArrowUp') player.y -= .035
      }
      assess()
    },
  }
}
