import Phaser from 'phaser'
import { createPlayer, createRecorder, importCapsule, type ReplayCapsule, type ReplayRecorder } from '../src/index'
import { createSeededFailureModel } from './seeded-failure-model'

/**
 * A deliberately small Phaser 3 scene. It is a copyable integration fixture,
 * not part of the published runtime package. The seed and input adapter are
 * the same pieces a production scene would own.
 */
export class SeededFailureScene extends Phaser.Scene {
  private recorder: ReplayRecorder | undefined
  private seed = 'phaser-demo'

  constructor() { super('SeededFailureScene') }

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
    const model = createSeededFailureModel(String(capsule.seed))
    const player = createPlayer(capsule, { onEvent: (event) => model.apply(event) })
    await player.play()
    return model.failed
  }
}
