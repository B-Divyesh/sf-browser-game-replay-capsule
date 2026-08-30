import { execFileSync } from 'node:child_process'
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

describe('release package consumer', () => {
  it('@claim:installable-release installs the shipped tarball in a clean npm project for ESM and CommonJS consumers', () => {
    const { version } = JSON.parse(readFileSync('package.json', 'utf8')) as { version: string }
    const tarball = resolve(`site/public/releases/sociobot-replay-capsule-${version}.tgz`)
    const consumer = mkdtempSync(join(tmpdir(), 'replay-capsule-consumer-'))

    try {
      writeFileSync(join(consumer, 'package.json'), '{"name":"replay-capsule-consumer","private":true}')
      execFileSync('npm', ['install', '--ignore-scripts', '--omit=dev', '--no-audit', '--no-fund', tarball], { cwd: consumer, stdio: 'pipe' })

      const commonJs = execFileSync(process.execPath, ['-e', [
        "const replay = require('@sociobot/replay-capsule')",
        "const capsule = {format:'replay-capsule',version:1,createdAt:'2026-08-30T00:00:00.000Z',durationMs:0,seed:1,events:[],checkpoints:[],truncated:false}",
        "process.stdout.write(replay.validateCapsule(capsule).format)",
      ].join(';')], { cwd: consumer, encoding: 'utf8' })

      const esm = execFileSync(process.execPath, ['--input-type=module', '-e', [
        "import { validateCapsule } from '@sociobot/replay-capsule'",
        "const capsule = {format:'replay-capsule',version:1,createdAt:'2026-08-30T00:00:00.000Z',durationMs:0,seed:1,events:[],checkpoints:[],truncated:false}",
        "process.stdout.write(String(validateCapsule(capsule).version))",
      ].join(';')], { cwd: consumer, encoding: 'utf8' })

      expect(commonJs).toBe('replay-capsule')
      expect(esm).toBe('1')
    } finally {
      rmSync(consumer, { recursive: true, force: true })
    }
  }, 30_000)
})
