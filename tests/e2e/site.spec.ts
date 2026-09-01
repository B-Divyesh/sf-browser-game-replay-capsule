import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'
import { seededFault } from '../../examples/seeded-failure-model'

test('landing page is semantic, clean, and accessible', async ({ page }, testInfo) => {
  const errors: string[] = []
  page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()) })
  await page.goto('/')

  await expect(page).toHaveTitle(/Replay Capsule/)
  await expect(page.locator('html')).toHaveAttribute('lang', 'en')
  await expect(page.locator('main')).toHaveCount(1)
  await expect(page.locator('h1')).toHaveCount(1)
  await expect(page.locator('img')).toHaveAttribute('alt', /cream and petrol recorder/)
  await expect(page.getByRole('heading', { name: 'Replay browser-game bugs from a small file.' })).toBeVisible()
  expect(errors).toEqual([])

  // axe bundles its own Playwright peer types; runtime is pinned by this project.
  const results = await new AxeBuilder({ page: page as never }).analyze()
  expect(results.violations, JSON.stringify(results.violations, null, 2)).toEqual([])

  if (testInfo.project.name === 'mobile') {
    const dimensions = await page.evaluate(() => ({ scroll: document.documentElement.scrollWidth, client: document.documentElement.clientWidth }))
    expect(dimensions.scroll).toBeLessThanOrEqual(dimensions.client)
  }
})

test('sample demo has no axe violations', async ({ page }) => {
  await page.goto('/demo')
  const results = await new AxeBuilder({ page: page as never }).analyze()
  expect(results.violations, JSON.stringify(results.violations, null, 2)).toEqual([])
})

test('shows seeded product controls in the first mobile demo viewport', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile', 'This is a phone first-screen regression.')
  await page.goto('/demo')
  for (const locator of [page.locator('.demo-quick-action'), page.getByRole('button', { name: 'Replay sample' })]) {
    const box = await locator.boundingBox()
    expect(box).not.toBeNull()
    expect(box!.y + box!.height).toBeLessThanOrEqual(844)
  }
  await expect(page.locator('.demo-quick-action')).toContainText('RC-SAMPLE-FAULT-17')
})

test('keeps all first-screen facts visible on desktop', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'chromium', 'This is a desktop first-screen regression.')
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/')
  await page.evaluate(() => document.fonts.ready)
  const box = await page.locator('.trust-line').boundingBox()
  expect(box).not.toBeNull()
  expect(box!.y + box!.height).toBeLessThanOrEqual(900)
})

test('keeps all first-screen facts visible at the exact 390 by 844 phone edge', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile', 'This is the required cold phone first-screen regression.')
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/')
  await page.evaluate(() => document.fonts.ready)
  const facts = page.locator('.trust-line')
  await expect(facts).toContainText('Record, import, and replay offline after this page loads')
  await expect(facts).toContainText('Free under the MIT License')
  await expect(facts).toContainText('No tracking or API calls')
  const box = await facts.boundingBox()
  expect(box).not.toBeNull()
  expect(box!.y + box!.height).toBeLessThanOrEqual(844)
})

test('the trailing demo URL resolves to the canonical demo URL', async ({ page }) => {
  await page.goto('/demo/')
  await page.waitForURL('**/demo')
  await expect(page).toHaveTitle('Demo — Replay Capsule')
})

test('moves focus to the destination heading after document navigation', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('link', { name: 'Try it with sample data' }).click()
  await expect(page.getByRole('heading', { level: 1, name: 'Replay a sample browser-game bug.' })).toBeFocused()

  await page.goBack()
  await expect(page.getByRole('heading', { level: 1, name: 'Replay browser-game bugs from a small file.' })).toBeFocused()
})

test('the direct ?demo=1 sandbox loads sample data with reset and real-mode controls', async ({ page }) => {
  await page.goto('/?demo=1')
  await page.waitForURL('**/demo')
  await expect(page.getByText('Demo — sample data, nothing is saved.')).toBeVisible()
  await expect(page.locator('#seed-readout')).toHaveText('RC-SAMPLE-FAULT-17')
  await expect(page.locator('#event-readout')).toHaveText('1')
  await expect(page.getByRole('button', { name: 'Reset demo' })).toBeVisible()
  await expect(page.getByRole('link', { name: 'Start for real' })).toBeVisible()
  expect(await page.evaluate(() => document.body.dataset.stateNamespace)).toBe('demo:replay-capsule:memory')
})

test('keyboard users can reach and activate the sample action with a visible focus ring', async ({ page }) => {
  await page.goto('/')
  await page.keyboard.press('Tab')
  await expect(page.getByRole('link', { name: 'Skip to main content' })).toBeFocused()

  const sampleAction = page.getByRole('link', { name: 'Try it with sample data' })
  for (let step = 0; step < 10 && !(await sampleAction.evaluate((element) => element === document.activeElement)); step += 1) {
    await page.keyboard.press('Tab')
  }
  await expect(sampleAction).toBeFocused()
  const focus = await sampleAction.evaluate((element) => {
    const style = getComputedStyle(element)
    return { width: style.outlineWidth, style: style.outlineStyle, color: style.outlineColor }
  })
  expect(focus).toEqual({ width: '3px', style: 'solid', color: 'rgb(164, 71, 33)' })
  await page.keyboard.press('Enter')
  await expect(page).toHaveURL(/\/demo\/?$/)
})

test('reduced motion and 200% text keep the interface usable', async ({ page }, testInfo) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/')
  await page.evaluate(() => document.fonts.ready)
  const motion = await page.evaluate(() => ({
    scrollBehavior: getComputedStyle(document.documentElement).scrollBehavior,
    animationDuration: getComputedStyle(document.querySelector('.hero-copy')!).animationDuration,
  }))
  expect(motion.scrollBehavior).toBe('auto')
  expect(Number.parseFloat(motion.animationDuration)).toBeLessThanOrEqual(0.00001)

  if (testInfo.project.name === 'mobile') {
    for (const route of ['/', '/demo', '/privacy/', '/terms/', '/404.html']) {
      await page.goto(route)
      await page.evaluate(() => document.fonts.ready)
      await page.evaluate(() => { document.documentElement.style.fontSize = '200%' })
      const dimensions = await page.evaluate(() => ({ scroll: document.documentElement.scrollWidth, client: document.documentElement.clientWidth }))
      expect(dimensions.scroll, `${route} should not scroll sideways after fonts load at 200% text`).toBeLessThanOrEqual(dimensions.client)
      const headerLinks = page.locator('header nav a')
      for (let index = 0; index < await headerLinks.count(); index += 1) {
        const box = await headerLinks.nth(index).boundingBox()
        expect(box, `${route} header link ${index} should have a box`).not.toBeNull()
        expect(box!.x, `${route} header link ${index} should start inside the viewport`).toBeGreaterThanOrEqual(0)
        expect(box!.x + box!.width, `${route} header link ${index} should end inside the viewport`).toBeLessThanOrEqual(390)
      }
    }

    await page.goto('/')
    await expect(page.getByRole('link', { name: 'Try it with sample data' })).toBeVisible()
  }
})

test('@claim:sample-demo loads isolated sample data in one click and can reset or exit', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('link', { name: 'Try it with sample data' }).click()
  await expect(page).toHaveURL(/\/demo\/?$/)
  await expect(page).toHaveTitle('Demo — Replay Capsule')
  await expect(page.getByText('Demo — sample data, nothing is saved.')).toBeVisible()
  await expect(page.locator('#seed-readout')).toHaveText('RC-SAMPLE-FAULT-17')
  await expect(page.locator('#event-readout')).toHaveText('1')
  expect(await page.evaluate(() => ({ local: Object.keys(localStorage), session: Object.keys(sessionStorage), namespace: document.body.dataset.stateNamespace }))).toEqual({ local: [], session: [], namespace: 'demo:replay-capsule:memory' })
  await page.getByRole('button', { name: 'Reset demo' }).click()
  await expect(page.locator('#seed-readout')).toHaveText('RC-SAMPLE-FAULT-17')
  await page.getByRole('link', { name: 'Start for real' }).click()
  await expect(page).toHaveURL(/\/$/)
  await expect(page.locator('#demo-banner')).toBeHidden()
})

test('@claim:no-network-calls permits only known same-origin static requests and no API or tracking calls', async ({ page }) => {
  const requests: Array<{ method: string; resourceType: string; url: string }> = []
  page.on('request', (request) => requests.push({
    method: request.method(),
    resourceType: request.resourceType(),
    url: request.url(),
  }))
  await page.goto('/demo')
  await page.evaluate(() => document.fonts.ready)
  await page.getByRole('button', { name: 'Replay capsule' }).click()
  await expect(page.locator('#demo-message')).toContainText('Replay complete')
  const origin = new URL(page.url()).origin

  const isKnownStaticPath = (pathname: string) => pathname === '/demo'
    || pathname === '/favicon.svg'
    || pathname === '/apple-touch-icon.png'
    || /^\/assets\/[a-zA-Z0-9_-]+\.(?:css|js|woff2|png|svg|webp)$/.test(pathname)

  expect(requests).not.toEqual([])
  for (const request of requests) {
    const url = new URL(request.url)
    expect(url.origin, `${request.method} ${request.url} must stay on this origin`).toBe(origin)
    expect(request.method, `${request.url} must be a static GET`).toBe('GET')
    expect(['document', 'script', 'stylesheet', 'font', 'image'], `${request.url} must be a static resource type`).toContain(request.resourceType)
    expect(url.search, `${request.url} must not send request data`).toBe('')
    expect(isKnownStaticPath(url.pathname), `${request.resourceType} ${url.pathname} is not an approved static path`).toBe(true)
    expect(url.pathname, `${url.pathname} must not be an API, analytics, tracking, or telemetry path`).not.toMatch(/^\/(?:api|analytics|track|tracking|collect|events|telemetry)(?:\/|$)/i)
  }
})

test('@claim:opt-in-recording captures nothing before the person starts recording', async ({ page }) => {
  await page.goto('/demo')
  await page.keyboard.press('ArrowRight')
  await expect(page.locator('#event-readout')).toHaveText('1')
  await page.getByRole('button', { name: 'Start recording' }).click()
  await page.keyboard.press('ArrowRight')
  await expect(page.locator('#event-readout')).toHaveText('2')
})

test('@claim:no-browser-persistence keeps a real run in memory and leaves existing browser data untouched', async ({ page, context }) => {
  await context.addCookies([{ name: 'host-sentinel', value: 'keep', url: 'http://127.0.0.1:4173/' }])
  await page.goto('/')
  await page.evaluate(() => {
    localStorage.setItem('host-sentinel', 'keep')
    sessionStorage.setItem('host-sentinel', 'keep')
  })
  await page.getByRole('button', { name: 'Start recording' }).click()
  await page.keyboard.press('ArrowRight')
  await page.getByRole('button', { name: 'Stop recording' }).click()
  const downloadPromise = page.waitForEvent('download')
  await page.getByRole('button', { name: 'Download capsule' }).click()
  const download = await downloadPromise
  await page.locator('#import').setInputFiles((await download.path())!)
  await page.getByRole('button', { name: 'Replay capsule' }).click()
  await expect(page.locator('#demo-message')).toContainText('Replay complete')
  await page.reload()
  expect(await page.evaluate(async () => ({
    local: Object.entries(localStorage), session: Object.entries(sessionStorage),
    databases: (await indexedDB.databases()).map((database) => database.name),
    caches: await caches.keys(), registrations: (await navigator.serviceWorker.getRegistrations()).length,
  }))).toEqual({ local: [['host-sentinel', 'keep']], session: [['host-sentinel', 'keep']], databases: [], caches: [], registrations: 0 })
  expect((await context.cookies()).map(({ name, value }) => [name, value])).toEqual([['host-sentinel', 'keep']])
})

test('@claim:capture-surface keeps page, identity, cookie, and network values out of exported capsules', async ({ page }) => {
  await page.goto('/#demo')
  await page.evaluate(async () => {
    document.body.dataset.privateDomValue = 'dom-secret-480'
    document.cookie = 'identity=person-480'
    await fetch('/robots.txt')
  })
  await page.getByRole('button', { name: 'Start recording' }).click()
  await page.keyboard.press('ArrowRight')
  await page.getByRole('button', { name: 'Stop recording' }).click()
  const downloadPromise = page.waitForEvent('download')
  await page.getByRole('button', { name: 'Download capsule' }).click()
  const download = await downloadPromise
  const downloadPath = await download.path()
  expect(downloadPath).not.toBeNull()
  const capsule = JSON.parse(await (await import('node:fs/promises')).readFile(downloadPath!, 'utf8'))
  expect(Object.keys(capsule).sort()).toEqual(['checkpoints', 'createdAt', 'durationMs', 'events', 'format', 'seed', 'truncated', 'version'])
  expect(JSON.stringify(capsule)).not.toMatch(/dom-secret-480|person-480|robots\.txt/)
})

test('@claim:record-export-replay records, exports, imports, and replays the exact input sequence', async ({ page }) => {
  await page.goto('/#demo')
  await page.getByRole('button', { name: 'Start recording' }).click()
  await expect(page.getByText('Recording', { exact: true })).toBeVisible()
  await page.keyboard.press('ArrowRight')
  await page.keyboard.press('ArrowUp')
  await page.getByRole('button', { name: 'Stop recording' }).click()
  await expect(page.locator('#event-readout')).toHaveText('4')

  const downloadPromise = page.waitForEvent('download')
  await page.getByRole('button', { name: 'Download capsule' }).click()
  const download = await downloadPromise
  expect(download.suggestedFilename()).toMatch(/^replay-.+\.json$/)

  const downloadPath = await download.path()
  expect(downloadPath).not.toBeNull()
  const capsule = JSON.parse(await (await import('node:fs/promises')).readFile(downloadPath!, 'utf8'))
  expect(capsule.events).toHaveLength(4)
  await page.locator('#import').setInputFiles(downloadPath!)
  await expect(page.locator('#demo-message')).toContainText('Imported 4 events')

  await page.getByRole('button', { name: 'Replay capsule' }).click()
  await expect(page.locator('#demo-message')).toHaveText('Replay complete: the same 4 recorded events were applied.')
  expect(await page.evaluate(() => JSON.parse(document.body.dataset.replayedEvents ?? '[]'))).toEqual(capsule.events)
  expect(await page.locator('body').getAttribute('data-replay-outcome')).toBe('recorded-sequence-applied')
})

test('keeps the visible import control focused for keyboard users', async ({ page }) => {
  await page.goto('/#demo')
  await page.getByRole('button', { name: 'Start recording' }).click()
  await page.keyboard.press('ArrowRight')
  await page.getByRole('button', { name: 'Stop recording' }).click()
  await page.getByRole('button', { name: 'Download capsule' }).focus()
  await page.keyboard.press('Tab')
  await expect(page.locator('#import')).toBeFocused()
  const focus = await page.locator('#import-label').evaluate((label) => {
    const style = getComputedStyle(label)
    const box = label.getBoundingClientRect()
    return { outlineWidth: style.outlineWidth, outlineStyle: style.outlineStyle, box: { width: box.width, height: box.height } }
  })
  expect(focus.outlineWidth).toBe('3px')
  expect(focus.outlineStyle).toBe('solid')
  expect(focus.box.height).toBeGreaterThanOrEqual(44)
})

test('keeps compact navigation, footer links, and code actions at 44px targets on mobile', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile', 'Target dimensions are a compact-layout regression.')
  await page.goto('/')
  for (const selector of ['.wordmark', '.copy-code', 'footer a[href="/demo"]', 'header nav a']) {
    const targets = page.locator(selector)
    for (let index = 0; index < await targets.count(); index += 1) {
      const box = await targets.nth(index).boundingBox()
      expect(box, `${selector} ${index} should have a measurable target`).not.toBeNull()
      expect(box!.width).toBeGreaterThanOrEqual(44)
      expect(box!.height).toBeGreaterThanOrEqual(44)
    }
  }
})

test('records gameplay keys but not Tab or Enter used to operate demo controls', async ({ page }) => {
  await page.goto('/demo')
  await page.getByRole('button', { name: 'Start recording' }).focus()
  await page.keyboard.press('Enter')
  await expect(page.locator('#game')).toBeFocused()
  await page.keyboard.press('ArrowRight')
  await page.keyboard.press('ArrowUp')
  await page.keyboard.press('Tab')
  await expect(page.getByRole('button', { name: 'Stop recording' })).toBeFocused()
  await page.keyboard.press('Enter')
  await expect(page.locator('#event-readout')).toHaveText('4')

  const downloadPromise = page.waitForEvent('download')
  await page.getByRole('button', { name: 'Download capsule' }).click()
  const downloadPath = await (await downloadPromise).path()
  expect(downloadPath).not.toBeNull()
  const capsule = JSON.parse(await (await import('node:fs/promises')).readFile(downloadPath!, 'utf8'))
  expect(capsule.events).toEqual([
    expect.objectContaining({ type: 'key', action: 'down', code: 'ArrowRight' }),
    expect.objectContaining({ type: 'key', action: 'up', code: 'ArrowRight' }),
    expect.objectContaining({ type: 'key', action: 'down', code: 'ArrowUp' }),
    expect.objectContaining({ type: 'key', action: 'up', code: 'ArrowUp' }),
  ])
})

test('invalid imports explain how to recover', async ({ page }) => {
  await page.goto('/#demo')
  await page.locator('#import').setInputFiles({ name: 'not-a-capsule.json', mimeType: 'application/json', buffer: Buffer.from('{bad') })
  await expect(page.locator('#demo-message')).toContainText('not valid JSON')
  await expect(page.locator('#demo-message')).toContainText('under 1 MB')
})

test('@claim:text-entry-excluded never records text-field keystrokes', async ({ page }) => {
  await page.goto('/#demo')
  await page.getByRole('button', { name: 'Start recording' }).click()
  await page.evaluate(() => {
    const input = document.createElement('input')
    input.setAttribute('aria-label', 'Private text test')
    document.body.append(input)
    input.focus()
  })
  await page.keyboard.type('never capture this')
  await expect(page.locator('#event-readout')).toHaveText('0')

  await page.evaluate(() => {
    const editable = document.createElement('div')
    editable.contentEditable = 'true'
    editable.setAttribute('aria-label', 'Private editable text test')
    document.body.append(editable)
    editable.focus()
  })
  await page.keyboard.type('also private')
  await expect(page.locator('#event-readout')).toHaveText('0')

  await page.evaluate(() => {
    const host = document.createElement('closed-private-input')
    host.setAttribute('aria-label', 'Closed Shadow DOM text test')
    const shadow = host.attachShadow({ mode: 'closed' })
    const input = document.createElement('input')
    shadow.append(input)
    document.body.append(host)
    input.focus()
  })
  await page.keyboard.type('secret')
  await expect(page.locator('#event-readout')).toHaveText('0')

  await page.evaluate(() => {
    const host = document.createElement('shadow-private-input')
    const shadow = host.attachShadow({ mode: 'open' })
    const input = document.createElement('input')
    input.setAttribute('aria-label', 'Shadow private text')
    shadow.append(input)
    document.body.append(host)
    input.focus()
  })

  await page.keyboard.type('secret')
  await expect(page.locator('#event-readout')).toHaveText('0')

  await page.getByRole('button', { name: 'Stop recording' }).click()
  const downloadPromise = page.waitForEvent('download')
  await page.getByRole('button', { name: 'Download capsule' }).click()
  const download = await downloadPromise
  const downloadPath = await download.path()
  expect(downloadPath).not.toBeNull()
  const capsule = JSON.parse(await (await import('node:fs/promises')).readFile(downloadPath!, 'utf8'))
  expect(capsule.events).toEqual([])
})

test('@claim:pointer-normalization stores target-relative pointer coordinates', async ({ page }) => {
  await page.goto('/#demo')
  await page.getByRole('button', { name: 'Start recording' }).click()
  await page.locator('#game').evaluate((canvas) => {
    const box = canvas.getBoundingClientRect()
    canvas.dispatchEvent(new PointerEvent('pointerdown', {
      bubbles: true,
      clientX: box.left + box.width * 0.2,
      clientY: box.top + box.height * 0.8,
      pointerId: 7,
      pointerType: 'mouse',
      buttons: 1,
    }))
  })
  await page.getByRole('button', { name: 'Stop recording' }).click()
  const downloadPromise = page.waitForEvent('download')
  await page.getByRole('button', { name: 'Download capsule' }).click()
  const download = await downloadPromise
  const downloadPath = await download.path()
  expect(downloadPath).not.toBeNull()
  const capsule = JSON.parse(await (await import('node:fs/promises')).readFile(downloadPath!, 'utf8'))
  expect(capsule.events[0]).toMatchObject({ type: 'pointer', x: 0.2, y: 0.8, pointerId: 7 })
})

test('never records text-entry events through an open Shadow DOM path', async ({ page }) => {
  await page.goto('/#demo')
  await page.getByRole('button', { name: 'Start recording' }).click()

  for (const kind of ['textarea', 'select', 'editable'] as const) {
    await page.evaluate((controlKind) => {
      const host = document.createElement(`shadow-private-${controlKind}`)
      const shadow = host.attachShadow({ mode: 'open' })
      const control = controlKind === 'editable'
        ? document.createElement('div')
        : document.createElement(controlKind)
      control.setAttribute('aria-label', `Shadow private ${controlKind}`)
      if (controlKind === 'select') {
        control.innerHTML = '<option>First choice</option><option>Second choice</option>'
      }
      if (controlKind === 'editable') control.setAttribute('contenteditable', 'true')
      shadow.append(control)
      document.body.append(host)
      control.focus()
    }, kind)

    if (kind === 'select') await page.keyboard.press('ArrowDown')
    else await page.keyboard.type('secret')
    await expect(page.locator('#event-readout')).toHaveText('0')
  }
})

test('@claim:offline-demo records, imports, and replays after first load while offline', async ({ browser }) => {
  const offlineContext = await browser.newContext()
  const offlinePage = await offlineContext.newPage()
  try {
    await offlinePage.goto('http://127.0.0.1:4173/demo')
    expect(await offlinePage.evaluate(() => ({ local: Object.keys(localStorage), session: Object.keys(sessionStorage) }))).toEqual({ local: [], session: [] })
    expect(await offlineContext.cookies()).toEqual([])

    await offlineContext.setOffline(true)
    await offlinePage.evaluate(() => window.dispatchEvent(new Event('offline')))
    await expect(offlinePage.locator('#offline-note')).toHaveText('You are offline. You can record, import, and replay after this page loads.')

    const importedCapsule = {
      format: 'replay-capsule', version: 1, createdAt: '2026-09-01T00:00:00.000Z', durationMs: 0, seed: 'offline-import', truncated: false,
      events: [{ type: 'pointer', action: 'down', x: 0.2, y: 0.8, button: 0, buttons: 1, pointerId: 1, pointerType: 'mouse', pressure: 0.5, t: 0 }],
      checkpoints: [],
    }
    await offlinePage.locator('#import').setInputFiles({ name: 'offline-import.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify(importedCapsule)) })
    await expect(offlinePage.locator('#demo-message')).toHaveText('Imported 1 events. Seed and checkpoints validated locally.')
    await offlinePage.getByRole('button', { name: 'Replay capsule' }).click()
    await expect(offlinePage.locator('#demo-message')).toHaveText('Replay complete: the same 1 recorded events were applied.')

    await offlinePage.getByRole('button', { name: 'Start recording' }).click()
    await offlinePage.keyboard.press('ArrowRight')
    await expect(offlinePage.locator('#event-readout')).toHaveText('2')
  } finally {
    await offlineContext.close()
  }
})

test('@claim:seeded-failure-fixture runs 20 imported capsules through the shipped Phaser scene', async ({ page }) => {
  const errors: string[] = []
  page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()) })
  page.on('pageerror', (error) => errors.push(error.message))
  const response = await page.goto('/phaser-fixture.html')
  expect(response?.headers()['content-security-policy']).toContain("img-src 'self' data:")
  await expect(page.locator('#status')).toHaveText('Phaser scene ready.')
  await expect(page.locator('canvas')).toBeVisible()
  let reproduced = 0
  for (let index = 0; index < 20; index += 1) {
    const seed = `phaser-seeded-failure-${index}`
    const fault = seededFault(seed)
    const capsule = {
      format: 'replay-capsule', version: 1, createdAt: '2026-08-30T00:00:00.000Z', durationMs: 0, seed, truncated: false,
      events: [{ type: 'pointer', action: 'down', x: fault.x, y: fault.y, button: 0, buttons: 1, pointerId: 1, pointerType: 'mouse', pressure: .5, t: 0 }],
      checkpoints: [{ label: 'seeded-fault', data: { x: fault.x, y: fault.y }, t: 0 }],
    }
    const result = await page.evaluate(async (input) => {
      const runner = (window as Window & { runPhaserReplay?: (value: unknown) => Promise<{ failed: boolean; events: unknown[] }> }).runPhaserReplay
      if (!runner) throw new Error('The Phaser fixture did not initialize.')
      return runner(input)
    }, capsule)
    expect(result.events).toEqual(capsule.events)
    if (result.failed) reproduced += 1
  }
  expect(reproduced).toBeGreaterThanOrEqual(18)
  expect(reproduced).toBe(20)
  expect(errors).toEqual([])
})

test('@claim:phaser-recording records normalized pointer input from the Phaser canvas', async ({ page }) => {
  await page.goto('/phaser-fixture.html')
  await expect(page.locator('#status')).toHaveText('Phaser scene ready.')
  const canvas = page.locator('canvas')
  const box = await canvas.boundingBox()
  expect(box).not.toBeNull()

  await page.evaluate(() => {
    const arm = (window as Window & { armPhaserRecording?: (seed: string) => void }).armPhaserRecording
    if (!arm) throw new Error('The Phaser recording fixture did not initialize.')
    arm('phaser-recording-proof')
  })
  await page.mouse.click(box!.x + box!.width * .25, box!.y + box!.height * .75)

  const capsule = await page.evaluate(() => {
    const exportRecording = (window as Window & { exportPhaserRecording?: () => unknown }).exportPhaserRecording
    if (!exportRecording) throw new Error('The Phaser recording export is unavailable.')
    return exportRecording()
  }) as { seed: string; events: Array<{ type: string; action: string; x: number; y: number }> }

  expect(capsule.seed).toBe('phaser-recording-proof')
  expect(capsule.events).toEqual(expect.arrayContaining([
    expect.objectContaining({ type: 'pointer', action: 'down', x: .25, y: .75 }),
  ]))
})

test('keeps the same header and legal navigation on every route', async ({ page }, testInfo) => {
  for (const route of ['/', '/demo', '/privacy/', '/terms/', '/404.html']) {
    await page.goto(route)
    const headerLinks = await page.locator('header nav a').allTextContents()
    const footerLinks = await page.locator('footer nav a').allTextContents()
    expect(headerLinks).toEqual(['Demo', 'Privacy', 'Terms'])
    expect(footerLinks).toEqual(['Demo', 'Privacy', 'Terms'])
    if (testInfo.project.name === 'mobile') await expect(page.locator('header nav')).toBeVisible()
  }
})

test('legal pages are reachable', async ({ page }) => {
  const routes = [
    ['/privacy/', 'Privacy for Replay Capsule.'],
    ['/terms/', 'Terms for Replay Capsule.'],
    ['/404.html', 'That page was not found.'],
  ] as const
  for (const [route, heading] of routes) {
    await page.goto(route)
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(heading)
    const results = await new AxeBuilder({ page: page as never }).analyze()
    expect(results.violations, `${route}: ${JSON.stringify(results.violations, null, 2)}`).toEqual([])
  }
})
