import Phaser from 'phaser'
import { SeededFailureScene } from '../examples/phaser-seeded-failure'
import type { ReplayCapsule } from '../src/index'

type FixtureWindow = Window & {
  runPhaserReplay?: (capsule: unknown) => Promise<{ failed: boolean; events: unknown[] }>
  armPhaserRecording?: (seed: string) => void
  exportPhaserRecording?: () => ReplayCapsule | undefined
}

const fixtureWindow = window as FixtureWindow
const status = document.querySelector<HTMLParagraphElement>('#status')!

window.addEventListener('replay-capsule-phaser-ready', ((event: CustomEvent<SeededFailureScene>) => {
  const scene = event.detail
  fixtureWindow.armPhaserRecording = (seed) => scene.armRecording(seed)
  fixtureWindow.exportPhaserRecording = () => scene.exportCapsule()
  fixtureWindow.runPhaserReplay = async (capsule) => {
    const file = new File([JSON.stringify(capsule)], 'seeded-failure.json', { type: 'application/json' })
    const failed = await scene.replayImportedCapsule(file)
    return { failed, events: scene.replayedEvents }
  }
  status.textContent = 'Phaser scene ready.'
}) as EventListener)

new Phaser.Game({
  type: Phaser.CANVAS,
  width: 320,
  height: 180,
  parent: document.body,
  scene: [SeededFailureScene],
  banner: false,
  audio: { noAudio: true },
})
