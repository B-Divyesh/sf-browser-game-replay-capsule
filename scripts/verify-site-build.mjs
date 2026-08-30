import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const configPath = resolve('dist/site/staticwebapp.config.json')
const config = JSON.parse(readFileSync(configPath, 'utf8'))
const assetRoute = config.routes?.find((route) => route.route === '/assets/*')
const demoRoute = config.routes?.find((route) => route.route === '/demo')
const demoTrailingSlashRoute = config.routes?.find((route) => route.route === '/demo/')

if (assetRoute?.headers?.['Cache-Control'] !== 'public, max-age=31536000, immutable') {
  throw new Error('The production site must ship immutable caching for hashed /assets/* files.')
}
if (config.globalHeaders?.['X-Frame-Options'] !== 'DENY' || !config.globalHeaders?.['Content-Security-Policy']) {
  throw new Error('The production site must ship its frame-protection and CSP response policy.')
}
if (demoRoute?.rewrite !== '/demo/index.html' || demoTrailingSlashRoute?.redirect !== '/demo') {
  throw new Error('The production site must expose one canonical /demo URL and redirect /demo/.')
}
