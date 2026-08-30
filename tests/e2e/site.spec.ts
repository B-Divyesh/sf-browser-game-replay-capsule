import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

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
  await page.goto('/demo/')
  const results = await new AxeBuilder({ page: page as never }).analyze()
  expect(results.violations, JSON.stringify(results.violations, null, 2)).toEqual([])
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
  const motion = await page.evaluate(() => ({
    scrollBehavior: getComputedStyle(document.documentElement).scrollBehavior,
    animationDuration: getComputedStyle(document.querySelector('.hero-copy')!).animationDuration,
  }))
  expect(motion.scrollBehavior).toBe('auto')
  expect(Number.parseFloat(motion.animationDuration)).toBeLessThanOrEqual(0.00001)

  if (testInfo.project.name === 'mobile') {
    await page.evaluate(() => { document.documentElement.style.fontSize = '200%' })
    const dimensions = await page.evaluate(() => ({ scroll: document.documentElement.scrollWidth, client: document.documentElement.clientWidth }))
    expect(dimensions.scroll).toBeLessThanOrEqual(dimensions.client)
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

test('@claim:no-network-calls uses only same-origin assets and makes no API calls', async ({ page }) => {
  const requests: string[] = []
  page.on('request', (request) => requests.push(request.url()))
  await page.goto('/demo/')
  await page.getByRole('button', { name: 'Replay capsule' }).click()
  await expect(page.locator('#demo-message')).toContainText('Replay complete')
  const origin = new URL(page.url()).origin
  expect(requests).not.toEqual([])
  expect(requests.every((url) => new URL(url).origin === origin)).toBe(true)
})

test('@claim:opt-in-recording captures nothing before the person starts recording', async ({ page }) => {
  await page.goto('/demo/')
  await page.keyboard.press('ArrowRight')
  await expect(page.locator('#event-readout')).toHaveText('1')
  await page.getByRole('button', { name: 'Arm & start' }).click()
  await page.keyboard.press('ArrowRight')
  await expect(page.locator('#event-readout')).toHaveText('2')
})

test('@claim:record-export-replay records, exports, imports, and replays a real input capsule', async ({ page }) => {
  await page.goto('/#demo')
  await page.getByRole('button', { name: 'Arm & start' }).click()
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
  await page.locator('#import').setInputFiles(downloadPath!)
  await expect(page.locator('#demo-message')).toContainText('Imported 4 events')

  await page.getByRole('button', { name: 'Replay capsule' }).click()
  await expect(page.locator('#demo-message')).toContainText('Replay complete')
})

test('keeps the visible import control focused for keyboard users', async ({ page }) => {
  await page.goto('/#demo')
  await page.getByRole('button', { name: 'Arm & start' }).click()
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
  for (const selector of ['.wordmark', '.copy-code', 'footer a[href="/demo"]']) {
    const box = await page.locator(selector).boundingBox()
    expect(box, `${selector} should have a measurable target`).not.toBeNull()
    expect(box!.width).toBeGreaterThanOrEqual(44)
    expect(box!.height).toBeGreaterThanOrEqual(44)
  }
})

test('invalid imports explain how to recover', async ({ page }) => {
  await page.goto('/#demo')
  await page.locator('#import').setInputFiles({ name: 'not-a-capsule.json', mimeType: 'application/json', buffer: Buffer.from('{bad') })
  await expect(page.locator('#demo-message')).toContainText('not valid JSON')
  await expect(page.locator('#demo-message')).toContainText('under 1 MB')
})

test('@claim:text-entry-excluded never records text-field keystrokes', async ({ page }) => {
  await page.goto('/#demo')
  await page.getByRole('button', { name: 'Arm & start' }).click()
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
  await page.getByRole('button', { name: 'Arm & start' }).click()
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
  await page.getByRole('button', { name: 'Arm & start' }).click()

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

test('@claim:offline-demo continues to record offline without browser persistence', async ({ browser }) => {
  const offlineContext = await browser.newContext()
  const offlinePage = await offlineContext.newPage()
  try {
    await offlinePage.goto('http://127.0.0.1:4173/demo/')
    expect(await offlinePage.evaluate(() => ({ local: Object.keys(localStorage), session: Object.keys(sessionStorage) }))).toEqual({ local: [], session: [] })
    expect(await offlineContext.cookies()).toEqual([])

    await offlineContext.setOffline(true)
    await offlinePage.evaluate(() => window.dispatchEvent(new Event('offline')))
    await expect(offlinePage.getByText('You are offline.')).toBeVisible()
    await offlinePage.getByRole('button', { name: 'Arm & start' }).click()
    await offlinePage.keyboard.press('ArrowRight')
    await expect(offlinePage.locator('#event-readout')).toHaveText('2')
  } finally {
    await offlineContext.close()
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
