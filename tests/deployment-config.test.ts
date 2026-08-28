import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

type StaticWebAppConfig = {
  globalHeaders?: Record<string, string>
  routes?: Array<{ route?: string; headers?: Record<string, string> }>
}

describe('static deployment response policy', () => {
  it('ships immutable hashed assets and the required browser isolation headers', () => {
    const config = JSON.parse(readFileSync('site/public/staticwebapp.config.json', 'utf8')) as StaticWebAppConfig
    const headers = config.globalHeaders ?? {}
    const assetRoute = config.routes?.find((route) => route.route === '/assets/*')

    expect(assetRoute?.headers?.['Cache-Control']).toBe('public, max-age=31536000, immutable')
    expect(headers['X-Frame-Options']).toBe('DENY')
    expect(headers['Permissions-Policy']).toBe('camera=(), microphone=(), geolocation=()')
    expect(headers['Content-Security-Policy']).toContain("default-src 'self'")
    expect(headers['Content-Security-Policy']).toContain("frame-ancestors 'none'")
  })
})
