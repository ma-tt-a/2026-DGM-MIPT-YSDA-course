import { chromium } from 'playwright-chromium'
import { resolve } from 'node:path'
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import assert from 'node:assert/strict'
import { root, lecturePaths } from './course.mjs'
const lecture = lecturePaths('8'), base = process.env.SLIDEV_QA_URL || `http://localhost:${lecture.port}`
const map = JSON.parse(readFileSync(lecture.map, 'utf8')), qa = resolve(root, 'output/qa/lecture8/guidance-demos')
mkdirSync(qa, { recursive: true })
const browser = await chromium.launch({ executablePath: process.env.SLIDEV_BROWSER_PATH || '/Applications/Yandex.app/Contents/MacOS/Yandex', headless: true })
const context = await browser.newContext({ viewport: { width: 1280, height: 720 } }), page = await context.newPage()
const errors = [], http = [], external = [], states = []
page.on('pageerror', e => errors.push(String(e)))
page.on('response', r => { if (r.status() >= 400) http.push([r.status(), r.url()]) })
await context.route('**/*', route => {
  const u = new URL(route.request().url())
  if (['http:', 'https:'].includes(u.protocol) && u.origin !== new URL(base).origin) { external.push(u.href); return route.abort() }
  return route.continue()
})
const slide = frame => map.find(s => s.frame === frame)
const data = demo => demo.evaluate(e => ({ ...e.dataset }))
async function go(s, tools = false) {
  await page.goto(`${base}/${s.slide}?clicks=${s.clicks}${tools ? '&tools' : ''}`, { waitUntil: 'networkidle' })
  await page.evaluate(() => document.fonts.ready)
  return page.locator('[data-demo]:visible')
}
async function snapshot(name) {
  await page.mouse.move(1270, 20)
  const violations = await page.locator('.slidev-layout:visible').evaluate(layout => {
    const r = layout.getBoundingClientRect(), scale = r.width / 1280, source = layout.querySelector('.source').getBoundingClientRect().top
    return [...layout.querySelectorAll('[data-demo], .demo-takeaway, .demo-note, p, li, svg text, foreignObject')]
      .filter(e => getComputedStyle(e).visibility !== 'hidden' && !e.closest('.slidev-vclick-hidden'))
      .map(e => ({ text: e.textContent.slice(0, 90), r: e.getBoundingClientRect().toJSON() }))
      .filter(e => e.r.width && e.r.height && (e.r.bottom > Math.min(source - 10 * scale, r.top + 672 * scale) || e.r.left < r.left + 40 * scale || e.r.right > r.right - 40 * scale))
  })
  assert.deepEqual(violations, [], `Layout in ${name}`)
  assert.equal(await page.locator('.katex-error:visible').count(), 0)
  await page.screenshot({ path: resolve(qa, `${name}.png`) }); states.push(name)
}
async function reentry(demo, s) {
  const before = await data(demo)
  await page.locator('.slidev-layout:visible h1').click()
  await page.keyboard.press('ArrowRight'); await page.waitForURL(new RegExp(`/${s.slide + 1}(?:\\?|$)`))
  await page.keyboard.press('ArrowLeft'); await page.waitForURL(new RegExp(`/${s.slide}(?:\\?|$)`))
  await demo.waitFor({ state: 'visible' }); assert.deepEqual(await data(demo), before)
  await page.keyboard.press('ArrowUp'); await page.waitForURL(new RegExp(`/${s.slide - 1}(?:\\?|$)`))
  await page.keyboard.press('ArrowDown'); await page.waitForURL(new RegExp(`/${s.slide}(?:\\?|$)`))
  await demo.waitFor({ state: 'visible' }); assert.deepEqual(await data(demo), before)
}
try {
  const geometry = slide('extension: 28'), density = slide('extension: 30'), cfg = slide('extension: 33')
  let demo = await go(geometry), slider = demo.getByRole('slider')
  const purpleEndpoints = () => demo.locator('[data-score-arrow="unconditional"]').evaluate(e => ['x1','y1','x2','y2'].map(a => e.getAttribute(a)))
  const fixedUnconditional = await purpleEndpoints()
  for (const label of ['A', 'B']) {
    await demo.getByRole('button', { name: label, exact: true }).click()
    for (const value of ['0', '1', '3', '7']) {
      await slider.fill(value)
      assert.deepEqual(await purpleEndpoints(), fixedUnconditional, `Unconditional arrow moved for class ${label}, gamma ${value}`)
      const ends = await demo.locator('[data-score-arrow]').evaluateAll(arrows => arrows.map(e => [+e.getAttribute('x2'), +e.getAttribute('y2')]))
      for (const [x, y] of ends) assert.ok(x >= 58 && x <= 546 && y >= 32 && y <= 284, `Arrow leaves plot for class ${label}, gamma ${value}`)
      await snapshot(`geometry-${label}-${value}`)
    }
  }
  const handle = demo.locator('[data-observation-handle]'), handleBox = await handle.boundingBox()
  await page.mouse.move(handleBox.x + handleBox.width / 2, handleBox.y + handleBox.height / 2)
  await page.mouse.down(); await page.mouse.move(handleBox.x + handleBox.width / 2 + 70, handleBox.y + handleBox.height / 2 + 35, { steps: 8 }); await page.mouse.up()
  assert.ok(+(await data(demo)).x > .6); assert.ok(+(await data(demo)).y < 0); await snapshot('geometry-drag')
  await handle.focus(); const url = page.url(), x = +(await data(demo)).x
  await page.keyboard.press('ArrowLeft'); assert.equal(page.url(), url); assert.ok(Math.abs(+(await data(demo)).x - (x - .05)) < 1e-8)
  for (const direction of ['ArrowLeft', 'ArrowRight']) {
    for (let i = 0; i < 75; i++) await page.keyboard.press(direction)
    await snapshot(`geometry-bound-${direction}`)
  }
  await page.keyboard.press('Home'); assert.equal(+(await data(demo)).x, 1)
  await reentry(demo, geometry); await demo.getByRole('button', { name: 'Reset', exact: true }).click()
  assert.equal(+(await data(demo)).gamma, 1); assert.equal(+(await data(demo)).label, 1)
  for (const s of [density, cfg]) {
    demo = await go(s); slider = demo.getByRole('slider')
    for (const value of s === density ? ['0', '0.5', '1', '3', '7'] : ['0', '0.5', '1', '3', '5']) {
      await slider.fill(value); assert.equal(+(await data(demo)).gamma, +value); await snapshot(`${s === density ? 'density' : 'cfg'}-${value}`)
    }
    if (s === density) { await demo.getByRole('button', { name: 'A', exact: true }).click(); await snapshot('density-class-A') }
    await slider.focus(); const oldURL = page.url(); await page.keyboard.press('ArrowLeft'); assert.equal(page.url(), oldURL)
    await reentry(demo, s); await demo.getByRole('button', { name: 'Reset', exact: true }).click(); assert.equal(+(await data(demo)).gamma, 1)
  }
  for (const s of [geometry, density, cfg]) {
    demo = await go(s, true)
    const pen = page.getByRole('navigation', { name: 'Lecture annotation tools' }).getByRole('button', { name: 'Pen', exact: true })
    if (await pen.getAttribute('aria-pressed') !== 'true') await pen.click()
    await demo.getByRole('slider').fill('3')
    const reset = await demo.getByRole('button', { name: 'Reset', exact: true }).boundingBox(), cdp = await context.newCDPSession(page)
    for (const type of ['mousePressed', 'mouseReleased']) await cdp.send('Input.dispatchMouseEvent', { type, x: reset.x + reset.width / 2, y: reset.y + reset.height / 2, button: 'left', buttons: type === 'mousePressed' ? 1 : 0, clickCount: 1, pointerType: 'pen' })
    await cdp.detach(); assert.equal(+(await data(demo)).gamma, 1)
    if (s === geometry) assert.equal(await demo.locator('[data-observation-handle]').getAttribute('aria-disabled'), 'true')
    await snapshot(`pen-${s.slide}`); await pen.click()
  }
  for (const s of [geometry, density, cfg]) {
    await page.goto(`${base}/${s.slide}?print`, { waitUntil: 'networkidle' })
    await page.evaluate(() => document.fonts.ready)
    assert.equal(await page.locator('[data-demo]:visible .demo-controls').count(), 0)
    await snapshot(`print-slide-${s.slide}`)
  }
  assert.deepEqual(errors, []); assert.deepEqual(http, []); assert.deepEqual(external, [])
  console.log(`Lecture 8 guidance demos: ${states.length} visual states; fixed unconditional arrow across gamma/classes, arrow bounds, sliders, classes, drag, keyboard, bounds, Reset, both-neighbor reentry, offline and synthetic pen checks passed.`)
} finally {
  writeFileSync(resolve(qa, 'report.json'), JSON.stringify({ states, errors, http, external }, null, 2)); await browser.close()
}
