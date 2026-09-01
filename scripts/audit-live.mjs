import AxeBuilder from '@axe-core/playwright'
import { chromium } from '@playwright/test'
import { mkdir, writeFile } from 'node:fs/promises'

const [base = 'https://browser-game-replay-capsule.sociobot.in', output = '.factory/verification-artifacts/live-audit'] = process.argv.slice(2)
await mkdir(output, { recursive: true })

const browser = await chromium.launch({ headless: true })
const report = {
  base,
  checkedAt: new Date().toISOString(),
  axe: {},
  demo: {},
  landing: {},
  network: [],
  phaser: {},
  routes: {},
}

function assert(condition, message) {
  if (!condition) throw new Error(message)
}

function staticDemoRequest(request, origin) {
  const url = new URL(request.url)
  const staticPath = url.pathname === '/demo'
    || url.pathname === '/favicon.svg'
    || url.pathname === '/apple-touch-icon.png'
    || /^\/assets\/[a-zA-Z0-9_-]+\.(?:css|js|woff2|png|svg|webp)$/.test(url.pathname)
  assert(url.origin === origin, `Unexpected request origin: ${request.url}`)
  assert(request.method === 'GET', `Unexpected non-GET request: ${request.method} ${request.url}`)
  assert(['document', 'script', 'stylesheet', 'font', 'image'].includes(request.resourceType), `Unexpected request type: ${request.resourceType} ${request.url}`)
  assert(url.search === '', `Unexpected request data: ${request.url}`)
  assert(staticPath, `Unexpected non-static request path: ${request.url}`)
  assert(!/^\/(?:api|analytics|track|tracking|collect|events|telemetry)(?:\/|$)/i.test(url.pathname), `Unexpected API or tracking request: ${request.url}`)
}

function seededFault(seed) {
  let hash = 2166136261
  for (const character of seed) {
    hash ^= character.charCodeAt(0)
    hash = Math.imul(hash, 16777619)
  }
  hash >>>= 0
  return { x: .25 + (hash % 50) / 100, y: .2 + (Math.floor(hash / 64) % 60) / 100 }
}

try {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, serviceWorkers: 'block' })
  const page = await context.newPage()
  const unexpectedErrors = []
  page.on('pageerror', (error) => unexpectedErrors.push(error.message))
  page.on('console', (message) => {
    if (message.type() === 'error' && !page.url().includes('/not-a-real-route-polish-5')) unexpectedErrors.push(message.text())
  })

  const landingResponse = await page.goto(`${base}/`, { waitUntil: 'networkidle' })
  await page.evaluate(() => document.fonts.ready)
  report.landing = await page.evaluate(() => ({
    factsBottom: document.querySelector('.trust-line')?.getBoundingClientRect().bottom,
    headline: document.querySelector('h1')?.textContent,
    height: innerHeight,
    title: document.title,
    trustFacts: document.querySelector('.trust-line')?.textContent?.replace(/\s+/g, ' ').trim(),
    width: document.documentElement.scrollWidth,
  }))
  assert(landingResponse?.status() === 200, 'Landing did not return 200.')
  assert(report.landing.title === 'Replay Capsule — replay browser-game bugs', 'Landing title is wrong.')
  assert(report.landing.width <= 390, 'Landing overflows on a 390px phone.')
  assert(report.landing.factsBottom <= report.landing.height, 'Landing facts are outside the first phone view.')
  assert(report.landing.trustFacts.includes('No tracking or API calls'), 'Landing privacy fact is not precise.')
  await page.screenshot({ path: `${output}/landing-mobile-390x844.png` })

  await page.getByRole('link', { name: 'Try it with sample data' }).click()
  await page.waitForURL(`${base}/demo`)
  assert(await page.getByRole('heading', { level: 1 }).evaluate((element) => element === document.activeElement), 'Demo navigation did not focus its h1.')
  report.demo = await page.evaluate(async () => ({
    banner: document.querySelector('#demo-banner')?.textContent?.replace(/\s+/g, ' ').trim(),
    caches: await caches.keys(),
    databases: (await indexedDB.databases()).map((database) => database.name),
    events: document.querySelector('#event-readout')?.textContent,
    local: Object.keys(localStorage),
    namespace: document.body.dataset.stateNamespace,
    quickActionBottom: document.querySelector('.demo-quick-action')?.getBoundingClientRect().bottom,
    registrations: (await navigator.serviceWorker.getRegistrations()).length,
    seed: document.querySelector('#seed-readout')?.textContent,
    session: Object.keys(sessionStorage),
  }))
  assert(report.demo.banner.includes('Demo — sample data, nothing is saved.'), 'Demo banner is missing.')
  assert(report.demo.namespace === 'demo:replay-capsule:memory', 'Demo storage namespace is not isolated.')
  assert(report.demo.seed === 'RC-SAMPLE-FAULT-17' && report.demo.events === '1', 'Demo sample is not loaded.')
  assert(report.demo.quickActionBottom <= 844, 'Demo action is outside the first phone view.')
  assert(report.demo.local.length === 0 && report.demo.session.length === 0 && report.demo.databases.length === 0 && report.demo.caches.length === 0 && report.demo.registrations === 0, 'Demo wrote browser storage.')
  await page.screenshot({ path: `${output}/demo-mobile-390x844.png` })

  await page.getByRole('button', { name: 'Start recording' }).click()
  await page.keyboard.press('ArrowRight')
  await page.getByRole('button', { name: 'Reset demo' }).click()
  assert(await page.locator('#seed-readout').textContent() === 'RC-SAMPLE-FAULT-17', 'Reset demo did not restore the seed.')
  assert(await page.locator('#event-readout').textContent() === '1', 'Reset demo did not restore the event count.')
  await context.setOffline(true)
  await page.getByRole('button', { name: 'Replay sample' }).click()
  await page.waitForFunction(() => document.querySelector('#demo-message')?.textContent?.includes('Replay complete'))
  report.demo.offlineMessage = await page.locator('#demo-message').textContent()
  await context.setOffline(false)
  await page.getByRole('link', { name: 'Start for real' }).click()
  await page.waitForURL(`${base}/`)
  assert(await page.locator('#demo-banner').isHidden(), 'Demo banner remains after exiting demo mode.')

  await page.locator('header').getByRole('link', { name: 'Demo' }).click()
  assert(await page.getByRole('heading', { level: 1 }).evaluate((element) => element === document.activeElement), 'Header Demo link did not focus its h1.')
  await page.goBack()
  assert(await page.getByRole('heading', { level: 1 }).evaluate((element) => element === document.activeElement), 'Back navigation did not focus the landing h1.')

  const routes = [
    ['/', 200, 'Replay Capsule — replay browser-game bugs'],
    ['/demo', 200, 'Demo — Replay Capsule'],
    ['/privacy/', 200, 'Privacy — Replay Capsule'],
    ['/terms/', 200, 'Terms — Replay Capsule'],
    ['/not-a-real-route-polish-5', 404, 'Page not found — Replay Capsule'],
  ]
  for (const [route, status, title] of routes) {
    const response = await page.goto(`${base}${route}`, { waitUntil: 'networkidle' })
    await page.evaluate(() => document.fonts.ready)
    const routeReport = await page.evaluate(() => ({
      canonical: Boolean(document.querySelector('link[rel="canonical"]')),
      description: Boolean(document.querySelector('meta[name="description"]')),
      externalLinks: document.querySelectorAll('a[href^="http"]').length,
      footer: [...document.querySelectorAll('footer nav a')].map((element) => element.textContent?.trim()),
      h1: document.querySelectorAll('h1').length,
      header: [...document.querySelectorAll('header nav a')].map((element) => element.textContent?.trim()),
      lang: document.documentElement.lang,
      main: document.querySelectorAll('main').length,
      og: document.querySelectorAll('meta[property^="og:"]').length,
      title: document.title,
      twitter: document.querySelectorAll('meta[name^="twitter:"]').length,
    }))
    assert(response?.status() === status, `${route} returned ${response?.status()} instead of ${status}.`)
    assert(routeReport.title === title && routeReport.lang === 'en' && routeReport.h1 === 1 && routeReport.main === 1, `${route} document structure failed.`)
    assert(routeReport.description && routeReport.canonical && routeReport.og >= 7 && routeReport.twitter >= 4, `${route} metadata failed.`)
    assert(JSON.stringify(routeReport.header) === JSON.stringify(['Demo', 'Privacy', 'Terms']), `${route} header navigation failed.`)
    assert(JSON.stringify(routeReport.footer) === JSON.stringify(['Demo', 'Privacy', 'Terms']), `${route} footer navigation failed.`)
    assert(routeReport.externalLinks === 0, `${route} contains an unmarked external link.`)
    const axe = await new AxeBuilder({ page }).analyze()
    assert(axe.violations.length === 0, `${route} has Axe violations.`)
    await page.evaluate(() => { document.documentElement.style.fontSize = '200%' })
    const reflow = await page.evaluate(() => ({
      clientWidth: document.documentElement.clientWidth,
      links: [...document.querySelectorAll('header nav a')].map((element) => {
        const box = element.getBoundingClientRect()
        return { left: box.left, right: box.right }
      }),
      scrollWidth: document.documentElement.scrollWidth,
    }))
    assert(reflow.scrollWidth <= reflow.clientWidth && reflow.links.every((link) => link.left >= 0 && link.right <= 390), `${route} fails at 200% text.`)
    report.routes[route] = { ...routeReport, reflow, status: response.status() }
    report.axe[route] = axe.violations.map(({ id, impact }) => ({ id, impact }))
  }
  await page.screenshot({ path: `${output}/not-found-mobile-200-percent.png`, fullPage: true })

  await page.goto(`${base}/demo/`, { waitUntil: 'networkidle' })
  assert(page.url() === `${base}/demo`, 'Trailing demo URL did not resolve to the canonical route.')

  const fixture = await context.newPage()
  await fixture.goto(`${base}/phaser-fixture.html`, { waitUntil: 'networkidle' })
  await fixture.locator('#status').waitFor({ state: 'visible' })
  assert(await fixture.locator('#status').textContent() === 'Phaser scene ready.', 'Phaser fixture did not start.')
  const fixtureCanvas = await fixture.locator('canvas').boundingBox()
  await fixture.evaluate(() => window.armPhaserRecording?.('polish-5-live'))
  await fixture.mouse.click(fixtureCanvas.x + fixtureCanvas.width * .25, fixtureCanvas.y + fixtureCanvas.height * .75)
  const recorded = await fixture.evaluate(() => window.exportPhaserRecording?.())
  assert(recorded.seed === 'polish-5-live' && recorded.events.some((event) => event.type === 'pointer' && event.x === .25 && event.y === .75), 'Phaser recording did not preserve seed and normalized pointer input.')
  let reproduced = 0
  for (let index = 0; index < 20; index += 1) {
    const seed = `phaser-seeded-failure-${index}`
    const fault = seededFault(seed)
    const capsule = { format: 'replay-capsule', version: 1, createdAt: '2026-09-01T00:00:00.000Z', durationMs: 0, seed, truncated: false, events: [{ type: 'pointer', action: 'down', x: fault.x, y: fault.y, button: 0, buttons: 1, pointerId: 1, pointerType: 'mouse', pressure: .5, t: 0 }], checkpoints: [{ label: 'seeded-fault', data: fault, t: 0 }] }
    const replay = await fixture.evaluate((input) => window.runPhaserReplay?.(input), capsule)
    assert(JSON.stringify(replay?.events) === JSON.stringify(capsule.events), `Phaser replay ${index} changed its event sequence.`)
    if (replay?.failed) reproduced += 1
  }
  assert(reproduced === 20, `Phaser reproduced ${reproduced}/20 failures.`)
  report.phaser = { recordedEvents: recorded.events.length, recordedSeed: recorded.seed, reproduced }
  await fixture.screenshot({ path: `${output}/phaser-recording.png` })
  await context.close()

  const networkContext = await browser.newContext({ serviceWorkers: 'block' })
  const networkPage = await networkContext.newPage()
  const requests = []
  networkPage.on('request', (request) => requests.push({ method: request.method(), resourceType: request.resourceType(), url: request.url() }))
  await networkPage.goto(`${base}/demo`, { waitUntil: 'networkidle' })
  await networkPage.evaluate(() => document.fonts.ready)
  await networkPage.getByRole('button', { name: 'Replay capsule' }).click()
  await networkPage.waitForFunction(() => document.querySelector('#demo-message')?.textContent?.includes('Replay complete'))
  for (const request of requests) staticDemoRequest(request, base)
  report.network = requests
  await networkContext.close()

  assert(unexpectedErrors.length === 0, `Unexpected browser errors: ${unexpectedErrors.join(' | ')}`)
  await writeFile(`${output}/live-audit.json`, JSON.stringify(report, null, 2))
  console.log(JSON.stringify({ axe: report.axe, networkRequests: report.network.length, phaser: report.phaser, routes: Object.keys(report.routes) }, null, 2))
} finally {
  await browser.close()
}
