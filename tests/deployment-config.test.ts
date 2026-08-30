import { execFileSync } from 'node:child_process'
import { createRequire } from 'node:module'
import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import { describe, expect, it } from 'vitest'

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

  it('@claim:package-formats exports working ESM, CommonJS, and TypeScript declarations', async () => {
    execFileSync('npm', ['run', 'build:lib'], { stdio: 'pipe' })
    const manifest = JSON.parse(readFileSync('package.json', 'utf8')) as {
      exports?: { '.'?: { import?: string; require?: string; types?: string } }
    }
    const rootExport = manifest.exports?.['.']
    expect(rootExport).toEqual({ types: './dist/index.d.ts', import: './dist/index.js', require: './dist/index.cjs' })

    const esm = await import(`${pathToFileURL(resolve(rootExport!.import!)).href}?claim=package-formats`)
    const cjs = createRequire(import.meta.url)(resolve(rootExport!.require!)) as typeof esm
    expect(typeof esm.createRecorder).toBe('function')
    expect(typeof cjs.createPlayer).toBe('function')
    const declarations = readFileSync(resolve(rootExport!.types!), 'utf8')
    expect(declarations).toContain('declare function createRecorder')
    expect(declarations).toContain('createPlayer, createRecorder, downloadCapsule, importCapsule, validateCapsule')
  })

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
