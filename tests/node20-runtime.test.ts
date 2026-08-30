import { execFileSync } from 'node:child_process'
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

describe('Node 20 package consumer', () => {
  it('@claim:node-20-runtime runs both ESM and CommonJS from a clean packed consumer', () => {
    const consumer = mkdtempSync(join(tmpdir(), 'replay-capsule-node20-'))
    const packed = mkdtempSync(join(tmpdir(), 'replay-capsule-pack-'))
    const capsule = "{format:'replay-capsule',version:1,createdAt:'2026-08-30T00:00:00.000Z',durationMs:0,seed:1,events:[],checkpoints:[],truncated:false}"
    const node20 = (code: string, esm = false) => execFileSync('npx', ['--yes', '--package=node@20', 'node', ...(esm ? ['--input-type=module'] : []), '-e', code], { cwd: consumer, encoding: 'utf8', timeout: 60_000 })

    try {
      execFileSync('npm', ['run', 'build:lib'], { stdio: 'pipe' })
      const tarball = execFileSync('npm', ['pack', '--pack-destination', packed, '--silent'], { encoding: 'utf8' }).trim()
      writeFileSync(join(consumer, 'package.json'), '{"name":"node20-consumer","private":true}')
      execFileSync('npm', ['install', '--ignore-scripts', '--omit=dev', '--no-audit', '--no-fund', resolve(packed, tarball)], { cwd: consumer, stdio: 'pipe' })
      expect(node20(`const replay=require('@sociobot/replay-capsule');process.stdout.write(replay.validateCapsule(${capsule}).format)`)).toBe('replay-capsule')
      expect(node20(`import {validateCapsule} from '@sociobot/replay-capsule';process.stdout.write(String(validateCapsule(${capsule}).version))`, true)).toBe('1')
    } finally {
      rmSync(consumer, { recursive: true, force: true })
      rmSync(packed, { recursive: true, force: true })
    }
  }, 90_000)
})
