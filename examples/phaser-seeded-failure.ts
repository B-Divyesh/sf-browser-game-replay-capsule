import Phaser from 'phaser'
import { createPlayer, createRecorder, importCapsule, type ReplayCapsule, type ReplayEvent, type ReplayRecorder } from '../src/index'
import { createSeededFailureModel } from './seeded-failure-model'

/**
 * A deliberately small Phaser 3 scene. It is a copyable integration fixture,
 * not part of the published runtime package. The seed and input adapter are
 * the same pieces a production scene would own.
 */
export class SeededFailureScene extends Phaser.Scene {
  private recorder: ReplayRecorder | undefined
  private seed = 'phaser-demo'
  private model = createSeededFailureModel(this.seed)
  private appliedEvents: ReplayEvent[] = []

  constructor() { super('SeededFailureScene') }

  create() {
    // This deliberately small display proves that the fixture is a running
    // Phaser scene, while the model keeps its failure rule auditable.
    this.add.rectangle(160, 90, 280, 120, 0x164c4a)
    this.add.circle(160, 90, 18, 0xa44721)
    window.dispatchEvent(new CustomEvent('replay-capsule-phaser-ready', { detail: this }))
  }

  armRecording(seed: string) {
    this.seed = seed
    this.recorder?.clear()
    this.recorder = createRecorder({ seed, target: this.game.canvas, maxBytes: 128_000 })
    this.recorder.start()
  }

  exportCapsule(): ReplayCapsule | undefined {
    if (this.recorder?.state === 'recording') this.recorder.stop()
    return this.recorder?.export()
  }

  async replayImportedCapsule(file: File): Promise<boolean> {
    const capsule = await importCapsule(file)
    this.seed = String(capsule.seed)
    this.model = createSeededFailureModel(this.seed)
    this.appliedEvents = []
    const player = createPlayer(capsule, { onEvent: (event) => {
      this.appliedEvents.push(event)
      this.model.apply(event)
    } })
    await player.play()
    return this.model.failed
  }

  get replayedEvents() { return [...this.appliedEvents] }
}
