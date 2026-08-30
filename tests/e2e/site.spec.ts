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
  await expect(page.locator('img')).toHaveAttribute('alt', /flight recorder/)
  await expect(page.getByRole('heading', { name: 'Make the bug play itself.' })).toBeVisible()
  expect(errors).toEqual([])

  // axe bundles its own Playwright peer types; runtime is pinned by this project.
  const results = await new AxeBuilder({ page: page as never }).analyze()
  const serious = results.violations.filter((violation) => ['serious', 'critical'].includes(violation.impact ?? ''))
  expect(serious, JSON.stringify(serious, null, 2)).toEqual([])

  if (testInfo.project.name === 'mobile') {
    const dimensions = await page.evaluate(() => ({ scroll: document.documentElement.scrollWidth, client: document.documentElement.clientWidth }))
    expect(dimensions.scroll).toBeLessThanOrEqual(dimensions.client)
  }
})

test('records, exports, and replays a real input capsule', async ({ page }) => {
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

test('keeps compact navigation and code actions at 44px targets on mobile', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile', 'Target dimensions are a compact-layout regression.')
  await page.goto('/')
  for (const selector of ['.wordmark', '.copy-code']) {
    const box = await page.locator(selector).boundingBox()
    expect(box, `${selector} should have a measurable target`).not.toBeNull()
    expect(box!.height).toBeGreaterThanOrEqual(44)
  }
})

test('invalid imports explain how to recover', async ({ page }) => {
  await page.goto('/#demo')
  await page.locator('#import').setInputFiles({ name: 'not-a-capsule.json', mimeType: 'application/json', buffer: Buffer.from('{bad') })
  await expect(page.locator('#demo-message')).toContainText('not valid JSON')
  await expect(page.locator('#demo-message')).toContainText('under 1 MB')
})

test('never records text-field keystrokes', async ({ page }) => {
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
})

test('never records text typed in a Shadow DOM input', async ({ page }) => {
  await page.goto('/#demo')
  await page.getByRole('button', { name: 'Arm & start' }).click()
  await page.evaluate(() => {
    const host = document.createElement('shadow-private-input')
    const shadow = host.attachShadow({ mode: 'open' })
    const input = document.createElement('input')
    input.setAttribute('aria-label', 'Shadow private text')
    shadow.append(input)
    document.body.append(host)
    input.focus()
  })

  // This is the verifier's exact failure: before the regression fix, these
  // six characters produced 12 key down/up events because window received a
  // retargeted Shadow DOM host instead of the input.
  await page.keyboard.type('secret')
  await expect(page.locator('#event-readout')).toHaveText('0')
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

test('continues to record offline without browser persistence', async ({ page, context }) => {
  await page.goto('/#demo')
  expect(await page.evaluate(() => ({ local: Object.keys(localStorage), session: Object.keys(sessionStorage) }))).toEqual({ local: [], session: [] })
  expect(await context.cookies()).toEqual([])

  await context.setOffline(true)
  await page.evaluate(() => window.dispatchEvent(new Event('offline')))
  await expect(page.getByText('You are offline.')).toBeVisible()
  await page.getByRole('button', { name: 'Arm & start' }).click()
  await page.keyboard.press('ArrowRight')
  await expect(page.locator('#event-readout')).toHaveText('2')
  await context.setOffline(false)
})

test('legal pages are reachable', async ({ page }) => {
  await page.goto('/privacy/')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Privacy, by construction.')
  await page.goto('/terms/')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Plain terms for a small tool.')
})
