import AxeBuilder from '@axe-core/playwright'
import { chromium } from '@playwright/test'
import { writeFile } from 'node:fs/promises'

const base = 'https://browser-game-replay-capsule.sociobot.in'
const output = '.factory/verification-artifacts/polish-4-live'
const browser = await chromium.launch({ headless: true })
const results = { base, checkedAt: new Date().toISOString(), routes: {}, axe: {}, errors: [], expected404Errors: [], requests: [] }

const assert = (condition, message) => {
  if (!condition) throw new Error(message)
}

const hashSeed = (seed) => {
  let hash = 2166136261
  for (let index = 0; index < seed.length; index += 1) {
    hash ^= seed.charCodeAt(index)
    hash = Math.imul(hash, 16777619)
  }
  return hash >>> 0
}

const seededFault = (seed) => {
  const hash = hashSeed(seed)
  return { x: .25 + (hash % 50) / 100, y: .2 + (Math.floor(hash / 64) % 60) / 100 }
}

try {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, serviceWorkers: 'block' })
  const page = await context.newPage()
  page.on('console', (message) => {
    if (message.type() !== 'error') return
    const target = page.url().includes('/not-a-real-route-polish-4') ? results.expected404Errors : results.errors
    target.push(message.text())
  })
  page.on('pageerror', (error) => results.errors.push(error.message))
  page.on('request', (request) => results.requests.push(request.url()))

  const response = await page.goto(`${base}/`, { waitUntil: 'networkidle' })
  assert(response?.status() === 200, 'Landing route did not return 200.')
  await page.evaluate(() => document.fonts.ready)
  const landing = await page.evaluate(() => ({
    title: document.title,
    lang: document.documentElement.lang,
    h1: document.querySelectorAll('h1').length,
    main: document.querySelectorAll('main').length,
    width: document.documentElement.scrollWidth,
    factsBottom: document.querySelector('.trust-line')?.getBoundingClientRect().bottom,
    heading: document.querySelector('h1')?.textContent,
    externalLinks: document.querySelectorAll('a[href^="http"]').length,
  }))
  assert(landing.width <= 390, 'Landing overflows at normal text size.')
  assert(landing.factsBottom <= 844, 'Landing facts do not fit in the first phone view.')
  await page.screenshot({ path: `${output}/live-landing-mobile-390x844.png` })

  await page.getByRole('link', { name: 'Try it with sample data' }).click()
  await page.waitForURL(`${base}/demo`)
  assert(await page.getByRole('heading', { level: 1 }).evaluate((element) => element === document.activeElement), 'Demo heading did not receive focus.')
  const demo = await page.evaluate(async () => ({
    title: document.title,
    banner: document.querySelector('#demo-banner')?.textContent?.replace(/\s+/g, ' ').trim(),
    namespace: document.body.dataset.stateNamespace,
    seed: document.querySelector('#seed-readout')?.textContent,
    events: document.querySelector('#event-readout')?.textContent,
    quickActionBottom: document.querySelector('.demo-quick-action')?.getBoundingClientRect().bottom,
    local: Object.keys(localStorage),
    session: Object.keys(sessionStorage),
    databases: (await indexedDB.databases()).map((database) => database.name),
    caches: await caches.keys(),
    registrations: (await navigator.serviceWorker.getRegistrations()).length,
  }))
  assert(demo.banner?.includes('Demo — sample data, nothing is saved.'), 'Demo banner is missing.')
  assert(demo.namespace === 'demo:replay-capsule:memory', 'Demo namespace is not isolated.')
  assert(demo.seed === 'RC-SAMPLE-FAULT-17' && demo.events === '1', 'Seeded sample is missing.')
  assert(demo.quickActionBottom <= 844, 'Demo action is outside the first phone view.')
  assert(demo.local.length === 0 && demo.session.length === 0 && demo.databases.length === 0 && demo.caches.length === 0 && demo.registrations === 0, 'Demo wrote browser storage.')
  await page.screenshot({ path: `${output}/live-demo-mobile-390x844.png` })

  await page.getByRole('button', { name: 'Start recording' }).click()
  await page.keyboard.press('ArrowRight')
  assert(await page.locator('#event-readout').textContent() === '2', 'Demo recording did not add sample input.')
  await page.getByRole('button', { name: 'Reset demo' }).click()
  assert(await page.locator('#seed-readout').textContent() === 'RC-SAMPLE-FAULT-17', 'Reset did not restore the sample seed.')
  assert(await page.locator('#event-readout').textContent() === '1', 'Reset did not restore the sample event count.')

  await context.setOffline(true)
  await page.getByRole('button', { name: 'Replay sample' }).click()
  await page.locator('#demo-message').waitFor({ state: 'visible' })
  await page.waitForFunction(() => document.querySelector('#demo-message')?.textContent?.includes('Replay complete'))
  const offlineMessage = await page.locator('#demo-message').textContent()
  await context.setOffline(false)
  await page.getByRole('link', { name: 'Start for real' }).click()
  await page.waitForURL(`${base}/`)
  assert(await page.evaluate(() => document.body.dataset.stateNamespace) === 'real:replay-capsule:memory', 'Demo exit did not enter real mode.')
  assert(await page.locator('#demo-banner').isHidden(), 'Demo banner remained after exit.')

  await page.goto(`${base}/`)
  await page.locator('header').getByRole('link', { name: 'Demo' }).click()
  assert(await page.getByRole('heading', { level: 1 }).evaluate((element) => element === document.activeElement), 'Demo nav focus failed.')
  await page.goBack()
  assert(await page.getByRole('heading', { level: 1 }).evaluate((element) => element === document.activeElement), 'Back navigation focus failed.')

  const routeExpectations = [
    ['/', 200, 'Replay Capsule — replay browser-game bugs'],
    ['/demo', 200, 'Demo — Replay Capsule'],
    ['/privacy/', 200, 'Privacy — Replay Capsule'],
    ['/terms/', 200, 'Terms — Replay Capsule'],
    ['/not-a-real-route-polish-4', 404, 'Page not found — Replay Capsule'],
  ]
  for (const [route, status, title] of routeExpectations) {
    const routeResponse = await page.goto(`${base}${route}`, { waitUntil: 'networkidle' })
    await page.evaluate(() => document.fonts.ready)
    const data = await page.evaluate(() => ({
      title: document.title,
      lang: document.documentElement.lang,
      h1: document.querySelectorAll('h1').length,
      main: document.querySelectorAll('main').length,
      description: Boolean(document.querySelector('meta[name="description"]')),
      canonical: Boolean(document.querySelector('link[rel="canonical"]')),
      og: document.querySelectorAll('meta[property^="og:"]').length,
      twitter: document.querySelectorAll('meta[name^="twitter:"]').length,
      headerLinks: [...document.querySelectorAll('header nav a')].map((element) => element.textContent?.trim()),
      footerLinks: [...document.querySelectorAll('footer nav a')].map((element) => element.textContent?.trim()),
      externalLinks: document.querySelectorAll('a[href^="http"]').length,
    }))
    assert(routeResponse?.status() === status, `${route} returned ${routeResponse?.status()} instead of ${status}.`)
    assert(data.title === title && data.lang === 'en' && data.h1 === 1 && data.main === 1, `${route} structure failed.`)
    assert(data.description && data.canonical && data.og >= 7 && data.twitter >= 4, `${route} metadata failed.`)
    assert(JSON.stringify(data.headerLinks) === JSON.stringify(['Demo', 'Privacy', 'Terms']), `${route} header nav failed.`)
    assert(JSON.stringify(data.footerLinks) === JSON.stringify(['Demo', 'Privacy', 'Terms']), `${route} footer nav failed.`)
    assert(data.externalLinks === 0, `${route} has unexpected external links.`)
    results.routes[route] = { status: routeResponse.status(), ...data }

    const axe = await new AxeBuilder({ page }).analyze()
    results.axe[route] = axe.violations.map(({ id, impact }) => ({ id, impact }))
    assert(axe.violations.length === 0, `${route} has Axe violations.`)

    await page.evaluate(() => { document.documentElement.style.fontSize = '200%' })
    const enlarged = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
      links: [...document.querySelectorAll('header nav a')].map((element) => {
        const box = element.getBoundingClientRect()
        return { text: element.textContent?.trim(), x: box.x, right: box.right }
      }),
    }))
    assert(enlarged.scrollWidth <= enlarged.clientWidth, `${route} overflows at 200% text.`)
    assert(enlarged.links.every((link) => link.x >= 0 && link.right <= 390), `${route} clips header links at 200% text.`)
    results.routes[route].enlarged = enlarged
  }
  await page.screenshot({ path: `${output}/live-404-mobile-200-percent.png`, fullPage: true })

  const trailingResponse = await page.goto(`${base}/demo/`, { waitUntil: 'networkidle' })
  assert(trailingResponse?.status() === 200 && page.url() === `${base}/demo`, 'Trailing demo URL did not normalize.')

  const fixturePage = await context.newPage()
  await fixturePage.goto(`${base}/phaser-fixture.html`, { waitUntil: 'networkidle' })
  await fixturePage.locator('#status').waitFor({ state: 'visible' })
  assert(await fixturePage.locator('#status').textContent() === 'Phaser scene ready.', 'Phaser fixture did not start.')
  const canvas = fixturePage.locator('canvas')
  const canvasBox = await canvas.boundingBox()
  await fixturePage.evaluate(() => window.armPhaserRecording?.('live-phaser-recording-proof'))
  await fixturePage.mouse.click(canvasBox.x + canvasBox.width * .25, canvasBox.y + canvasBox.height * .75)
  const recorded = await fixturePage.evaluate(() => window.exportPhaserRecording?.())
  assert(recorded?.seed === 'live-phaser-recording-proof', 'Live Phaser recording seed failed.')
  assert(recorded?.events.some((event) => event.type === 'pointer' && event.action === 'down' && event.x === .25 && event.y === .75), 'Live Phaser pointer normalization failed.')

  let reproduced = 0
  for (let index = 0; index < 20; index += 1) {
    const seed = `phaser-seeded-failure-${index}`
    const fault = seededFault(seed)
    const capsule = {
      format: 'replay-capsule', version: 1, createdAt: '2026-09-01T00:00:00.000Z', durationMs: 0, seed, truncated: false,
      events: [{ type: 'pointer', action: 'down', x: fault.x, y: fault.y, button: 0, buttons: 1, pointerId: 1, pointerType: 'mouse', pressure: .5, t: 0 }],
      checkpoints: [{ label: 'seeded-fault', data: fault, t: 0 }],
    }
    const replay = await fixturePage.evaluate((input) => window.runPhaserReplay?.(input), capsule)
    assert(JSON.stringify(replay?.events) === JSON.stringify(capsule.events), `Live Phaser event sequence ${index} failed.`)
    if (replay?.failed) reproduced += 1
  }
  assert(reproduced === 20, `Live Phaser replay reproduced ${reproduced}/20 failures.`)
  await fixturePage.screenshot({ path: `${output}/live-phaser-recording.png` })

  const origins = [...new Set(results.requests.map((url) => new URL(url).origin))]
  assert(origins.length === 1 && origins[0] === base, 'Observed a non-product request origin.')
  assert(results.errors.length === 0, `Console or page errors: ${results.errors.join(' | ')}`)
  results.landing = landing
  results.demo = demo
  results.offlineMessage = offlineMessage
  results.requestOrigins = origins
  results.phaser = { recordingSeed: recorded.seed, pointerEvents: recorded.events.filter((event) => event.type === 'pointer').length, reproduced }
  await context.close()
  await writeFile(`${output}/live-audit.json`, JSON.stringify(results, null, 2))
} finally {
  await browser.close()
}
