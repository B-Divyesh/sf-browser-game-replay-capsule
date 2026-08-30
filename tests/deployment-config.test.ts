import { execFile } from 'node:child_process'
import { createServer } from 'node:http'
import { existsSync, readFileSync } from 'node:fs'
import { mkdtemp, readFile, rm, stat, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { promisify } from 'node:util'
import { chromium, type Browser, type BrowserContext } from '@playwright/test'
import { describe, expect, it } from 'vitest'

const execFileAsync = promisify(execFile)
const root = resolve('.')
const releaseTimeout = 30_000

async function runReleaseProcess(command: string, args: string[], cwd: string, timeout = releaseTimeout): Promise<string> {
  const { stdout } = await execFileAsync(command, args, {
    cwd,
    encoding: 'utf8',
    timeout,
    maxBuffer: 1_000_000,
  })
  return stdout
}

async function waitForReleaseOutputs(paths: string[], timeout = 10_000): Promise<void> {
  const deadline = Date.now() + timeout
  while (Date.now() < deadline) {
    const ready = await Promise.all(paths.map(async (path) => {
      try {
        return (await stat(path)).size > 0
      } catch {
        return false
      }
    }))
    if (ready.every(Boolean)) return
    await new Promise((resolve) => setTimeout(resolve, 50))
  }
  throw new Error(`Timed out waiting for release outputs: ${paths.join(', ')}`)
}

async function startReleaseModuleServer(modulePath: string): Promise<{ origin: string; close: () => Promise<void> }> {
  const server = createServer((request, response) => {
    if (request.url === '/') {
      response.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' })
      response.end(`<!doctype html><title>Release format consumer</title><body><script type="module">
        try {
          const replay = await import('/package/dist/index.js')
          const capsule = { format: 'replay-capsule', version: 1, createdAt: '2026-08-30T00:00:00.000Z', durationMs: 0, seed: 'release-fixture', events: [], checkpoints: [], truncated: false }
          const validated = replay.validateCapsule(capsule)
          if (validated.version !== 1 || typeof replay.createRecorder !== 'function' || typeof replay.createPlayer !== 'function') throw new Error('Published ESM surface is incomplete.')
          document.body.dataset.formatStatus = 'ready'
        } catch (error) {
          document.body.dataset.formatStatus = 'failed'
          document.body.dataset.formatError = String(error)
        }
      </script></body>`)
      return
    }
    if (request.url === '/package/dist/index.js') {
      void readFile(modulePath).then((source) => {
        response.writeHead(200, { 'Content-Type': 'text/javascript; charset=utf-8', 'Cache-Control': 'no-store' })
        response.end(source)
      }).catch(() => {
        response.writeHead(500)
        response.end('Could not read the packaged ESM entry point.')
      })
      return
    }
    response.writeHead(404)
    response.end()
  })

  await new Promise<void>((resolve, reject) => {
    server.once('error', reject)
    server.listen(0, '127.0.0.1', () => {
      server.off('error', reject)
      resolve()
    })
  })
  const address = server.address()
  if (!address || typeof address === 'string') throw new Error('Release module server did not bind to a TCP address.')

  return {
    origin: `http://127.0.0.1:${address.port}`,
    close: () => new Promise<void>((resolve, reject) => server.close((error) => error ? reject(error) : resolve())),
  }
}

type StaticWebAppConfig = {
  globalHeaders?: Record<string, string>
  routes?: Array<{ route?: string; rewrite?: string; headers?: Record<string, string> }>
  responseOverrides?: Record<string, { rewrite?: string; statusCode?: number }>
}

type PackageManifest = {
  name?: string
  publishConfig?: { access?: string }
}

type Claim = { id: string; test: string }

describe('static deployment response policy', () => {
  it('ships immutable assets, a real 404 response, and the required browser isolation headers', () => {
    const config = JSON.parse(readFileSync('site/public/staticwebapp.config.json', 'utf8')) as StaticWebAppConfig
    const headers = config.globalHeaders ?? {}
    const assetRoute = config.routes?.find((route) => route.route === '/assets/*')
    const releaseRoute = config.routes?.find((route) => route.route === '/releases/*')

    expect(assetRoute?.headers?.['Cache-Control']).toBe('public, max-age=31536000, immutable')
    expect(releaseRoute?.headers?.['Cache-Control']).toBe('public, max-age=31536000, immutable')
    expect(headers['X-Frame-Options']).toBe('DENY')
    expect(headers['Permissions-Policy']).toBe('camera=(), microphone=(), geolocation=()')
    expect(headers['Content-Security-Policy']).toContain("default-src 'self'")
    expect(headers['Content-Security-Policy']).toContain("frame-ancestors 'none'")
    expect(config.responseOverrides?.['404']).toEqual({ rewrite: '/404.html' })
    expect(config.routes?.find((route) => route.route === '/demo')?.rewrite).toBe('/demo/index.html')
  })

  it('marks the scoped package for public factory publication', () => {
    const manifest = JSON.parse(readFileSync('package.json', 'utf8')) as PackageManifest
    expect(manifest.name).toBe('@sociobot/replay-capsule')
    expect(manifest.publishConfig?.access).toBe('public')
  })

  it('@claim:zero-runtime-dependencies publishes a dependency-free package manifest', () => {
    const manifest = JSON.parse(readFileSync('package.json', 'utf8')) as PackageManifest & { dependencies?: Record<string, string> }
    expect(manifest.dependencies ?? {}).toEqual({})
  })

  it('@claim:package-formats exports working ESM, CommonJS, and TypeScript declarations from the published release artifact', async () => {
    const manifest = JSON.parse(readFileSync('package.json', 'utf8')) as {
      version: string
      exports?: { '.'?: { import?: string; require?: string; types?: string } }
    }
    const rootExport = manifest.exports?.['.']
    expect(rootExport).toEqual({ types: './dist/index.d.ts', import: './dist/index.js', require: './dist/index.cjs' })

    // Build in its own process and wait for every output instead of racing Vitest's
    // default five-second test window or reading a partially-written release.
    await runReleaseProcess('npm', ['run', 'build:lib'], root)
    const builtFiles = ['index.js', 'index.cjs', 'index.d.ts'].map((file) => resolve('dist', file))
    await waitForReleaseOutputs(builtFiles)

    const tarball = resolve(`site/public/releases/sociobot-replay-capsule-${manifest.version}.tgz`)
    expect(existsSync(tarball)).toBe(true)
    const consumer = await mkdtemp(join(tmpdir(), 'replay-capsule-formats-'))
    let server: Awaited<ReturnType<typeof startReleaseModuleServer>> | undefined
    let browser: Browser | undefined
    let context: BrowserContext | undefined

    try {
      await writeFile(join(consumer, 'package.json'), '{"name":"replay-capsule-format-consumer","private":true,"type":"module"}')
      await runReleaseProcess('npm', ['install', '--ignore-scripts', '--omit=dev', '--no-audit', '--no-fund', '--offline', tarball], consumer)

      const installed = join(consumer, 'node_modules', '@sociobot', 'replay-capsule')
      const publishedManifest = JSON.parse(await readFile(join(installed, 'package.json'), 'utf8')) as {
        exports?: { '.'?: { import?: string; require?: string; types?: string } }
      }
      expect(publishedManifest.exports?.['.']).toEqual(rootExport)

      for (const file of ['index.js', 'index.cjs', 'index.d.ts']) {
        expect(await readFile(join(installed, 'dist', file), 'utf8')).toBe(await readFile(resolve('dist', file), 'utf8'))
      }

      const commonJs = await runReleaseProcess(process.execPath, ['-e', [
        "const replay = require('@sociobot/replay-capsule')",
        "const capsule = {format:'replay-capsule',version:1,createdAt:'2026-08-30T00:00:00.000Z',durationMs:0,seed:'release-fixture',events:[],checkpoints:[],truncated:false}",
        "process.stdout.write(typeof replay.createPlayer + ':' + replay.validateCapsule(capsule).format)",
      ].join(';')], consumer)
      expect(commonJs).toBe('function:replay-capsule')

      const esm = await runReleaseProcess(process.execPath, ['--input-type=module', '-e', [
        "import * as replay from '@sociobot/replay-capsule'",
        "const capsule = {format:'replay-capsule',version:1,createdAt:'2026-08-30T00:00:00.000Z',durationMs:0,seed:'release-fixture',events:[],checkpoints:[],truncated:false}",
        "process.stdout.write(typeof replay.createRecorder + ':' + replay.validateCapsule(capsule).version)",
      ].join(';')], consumer)
      expect(esm).toBe('function:1')

      await writeFile(join(consumer, 'consumer.ts'), [
        "import { createPlayer, createRecorder, downloadCapsule, importCapsule, validateCapsule, type ReplayCapsule } from '@sociobot/replay-capsule'",
        "const capsule: ReplayCapsule = { format: 'replay-capsule', version: 1, createdAt: '2026-08-30T00:00:00.000Z', durationMs: 0, seed: 'release-fixture', events: [], checkpoints: [], truncated: false }",
        'validateCapsule(capsule)',
        'createRecorder({ seed: capsule.seed, target: new EventTarget(), keyTarget: new EventTarget(), captureGamepads: false })',
        'createPlayer(capsule, { onEvent: () => {} })',
        'void downloadCapsule',
        'void importCapsule',
      ].join('\n'))
      await runReleaseProcess(resolve('node_modules/.bin/tsc'), ['--noEmit', '--strict', '--target', 'ES2022', '--module', 'NodeNext', '--moduleResolution', 'NodeNext', 'consumer.ts'], consumer)

      // The packaged ESM file also runs in an explicitly-created browser/context.
      // Each resource is closed here so this claim cannot leak a context or process
      // into another test run.
      server = await startReleaseModuleServer(join(installed, 'dist', 'index.js'))
      browser = await chromium.launch({ headless: true })
      context = await browser.newContext()
      const page = await context.newPage()
      const pageErrors: string[] = []
      page.on('pageerror', (error) => pageErrors.push(error.message))
      await page.goto(server.origin, { waitUntil: 'domcontentloaded' })
      await page.waitForFunction(() => document.body.dataset.formatStatus !== undefined, undefined, { timeout: 10_000 })
      expect(await page.locator('body').getAttribute('data-format-status')).toBe('ready')
      expect(await page.locator('body').getAttribute('data-format-error')).toBeNull()
      expect(pageErrors).toEqual([])
    } finally {
      await context?.close()
      await browser?.close()
      await server?.close()
      await rm(consumer, { recursive: true, force: true })
    }
  }, 45_000)

  it('@claim:mit-license ships the package under MIT terms', () => {
    const manifest = JSON.parse(readFileSync('package.json', 'utf8')) as PackageManifest & { license?: string }
    expect(manifest.license).toBe('MIT')
    expect(readFileSync('LICENSE', 'utf8')).toContain('Permission is hereby granted, free of charge')
  })

  it('ships the documented metadata, demo route, and a designed 404 document', () => {
    const landing = readFileSync('site/index.html', 'utf8')
    const demo = readFileSync('site/demo/index.html', 'utf8')
    const privacy = readFileSync('site/privacy/index.html', 'utf8')
    const terms = readFileSync('site/terms/index.html', 'utf8')
    const notFound = readFileSync('site/404.html', 'utf8')

    for (const page of [landing, demo, privacy, terms]) {
      expect(page).toContain('rel="canonical"')
      expect(page).toContain('rel="apple-touch-icon"')
      expect(page).toContain('name="twitter:card"')
    }
    expect(landing).toContain('property="og:image"')
    expect(demo).toContain('<title>Demo — Replay Capsule</title>')
    expect(notFound).toContain('<h1>That page was not found.</h1>')
    expect(existsSync('site/public/assets/replay-capsule-social.png')).toBe(true)
    expect(existsSync('site/public/apple-touch-icon.png')).toBe(true)
  })

  it('keeps every listed claim mapped to exactly one tagged regression', () => {
    const claims = JSON.parse(readFileSync('.factory/claims.json', 'utf8')) as Claim[]
    const testSources = [
      readFileSync('tests/replay-capsule.test.ts', 'utf8'),
      readFileSync('tests/phaser-fixture.test.ts', 'utf8'),
      readFileSync('tests/deployment-config.test.ts', 'utf8'),
      readFileSync('tests/release-package.test.ts', 'utf8'),
      readFileSync('tests/e2e/site.spec.ts', 'utf8'),
    ].join('\n')
    expect(claims.length).toBeGreaterThan(0)
    for (const claim of claims) {
      const tag = `@claim:${claim.id}`
      expect(testSources.split(tag)).toHaveLength(2)
      expect(claim.test).toContain(tag)
    }
  })
})
