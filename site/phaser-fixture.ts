import Phaser from 'phaser'
import { SeededFailureScene } from '../examples/phaser-seeded-failure'

type FixtureWindow = Window & {
  runPhaserReplay?: (capsule: unknown) => Promise<{ failed: boolean; events: unknown[] }>
}

const fixtureWindow = window as FixtureWindow
const status = document.querySelector<HTMLParagraphElement>('#status')!

window.addEventListener('replay-capsule-phaser-ready', ((event: CustomEvent<SeededFailureScene>) => {
  const scene = event.detail
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
