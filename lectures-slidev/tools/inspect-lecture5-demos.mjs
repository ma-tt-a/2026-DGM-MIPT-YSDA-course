import assert from 'node:assert/strict'
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { chromium } from 'playwright-chromium'
import { lecturePaths, root } from './course.mjs'
import { initialLangevin, advanceLangevin, langevinConfig } from '../lecture5/lib/geometry-demos.mjs'

const lecture = lecturePaths(5), map = JSON.parse(readFileSync(lecture.map, 'utf8'))
const base = process.env.SLIDEV_QA_URL || `http://localhost:${lecture.port}`
const qa = process.env.SLIDEV_QA_DIR || resolve(root, 'output/qa/lecture5/interactive-demos')
mkdirSync(qa, { recursive: true })
const browser = await chromium.launch({ executablePath: process.env.SLIDEV_BROWSER_PATH || '/Applications/Yandex.app/Contents/MacOS/Yandex', headless: true })
const context = await browser.newContext({ viewport: { width: 1280, height: 720 } })
const page = await context.newPage(), errors = [], failed = [], external = [], checks = [], screenshots = []
page.on('pageerror', e => errors.push(String(e)))
page.on('response', r => { if (r.status() >= 400) failed.push([r.status(), r.url()]) })
await context.route('**/*', route => {
  const url = new URL(route.request().url())
  if (['http:', 'https:'].includes(url.protocol) && url.origin !== new URL(base).origin) { external.push(url.href); return route.abort() }
  return route.continue()
})
const demo = () => page.locator('[data-demo]:visible')
const data = () => demo().evaluate(el => ({ ...el.dataset }))
const slideByFrame = frame => map.find(s => s.frame === frame)
async function go(slide, pen = false) {
  await page.goto(`${base}/${slide.slide}?clicks=${slide.clicks}${pen ? '&tools' : ''}`, { waitUntil: 'networkidle' })
  await page.evaluate(() => document.fonts.ready)
  await demo().waitFor()
  assert.match(await page.locator('.course-folio:visible').innerText(), new RegExp(`/ ${map.length}$`))
}
async function snapshot(name) {
  await page.mouse.move(1235, 40)
  const overflow = await demo().evaluate(el => {
    const layout = el.closest('.slidev-layout'), box = layout.getBoundingClientRect(), scale = box.width / 1280
    const source = layout.querySelector('.source').getBoundingClientRect(), bottom = source.top - 12 * scale
    return [el, ...el.querySelectorAll('button,input,output,svg,.katex-html,.demo-takeaway,.demo-note,.plot-caption,.readout')]
      .filter(node => { const r = node.getBoundingClientRect(); return r.width && (r.bottom > bottom + .5 || r.right > box.right - 30 * scale || r.left < box.left + 30 * scale) })
      .map(node => ({ text: node.textContent.slice(0, 80), bounds: node.getBoundingClientRect().toJSON() }))
  })
  assert.deepEqual(overflow, [], `Overflow: ${name}`)
  assert.equal(await page.locator('.katex-error').count(), 0)
  await page.screenshot({ path: resolve(qa, `${name}.png`) })
  screenshots.push(name)
}
async function returnTo(slide) {
  const before = await data()
  await page.locator('.slidev-layout:visible h1').click()
  for (const [out, back, neighbor] of [['ArrowDown', 'ArrowUp', slide.slide + 1], ['ArrowUp', 'ArrowDown', slide.slide - 1]]) {
    await page.keyboard.press(out); await page.waitForURL(new RegExp(`/${neighbor}(?:\\?|$)`))
    await page.keyboard.press(back); await page.waitForURL(new RegExp(`/${slide.slide}(?:\\?|$)`))
    let shown = Number(new URL(page.url()).searchParams.get('clicks') || 0)
    while (shown++ < slide.clicks) await page.keyboard.press('ArrowRight')
    assert.deepEqual(await data(), before)
  }
  checks.push(`State preserved on return from both neighbors: ${slide.slide}`)
}
async function slider(name, key, field, expected) {
  const url = page.url()
  await demo().getByRole('slider', { name, exact: true }).focus()
  await page.keyboard.press(key)
  assert.equal(page.url(), url, 'Slider key navigated the deck')
  assert.ok(Math.abs(Number((await data())[field]) - expected) < 1e-9)
}
async function penClick(button) {
  const box = await button.boundingBox(), cdp = await context.newCDPSession(page)
  try {
    for (const type of ['mousePressed', 'mouseReleased']) await cdp.send('Input.dispatchMouseEvent', { type, x: box.x + box.width / 2, y: box.y + box.height / 2, button: 'left', buttons: type === 'mousePressed' ? 1 : 0, clickCount: 1, pointerType: 'pen' })
  } finally { await cdp.detach() }
}
const support = slideByFrame(20), langevin = slideByFrame('extension: imported: 6:14')
try {
  // Warm the deck before deep links, so stock navigation styles/fonts are loaded.
  await page.goto(`${base}/1`, { waitUntil: 'networkidle' })
  await page.evaluate(() => document.fonts.ready)
  await go(support)
  assert.equal(+(await data()).theta, 1.5)
  await snapshot('support-initial')
  await demo().getByRole('button', { name: 'Match', exact: true }).click()
  const matched = await data()
  assert.equal(+matched.theta, 0); assert.equal(+matched.w, 0); assert.equal(+matched.jsd, 0); assert.equal(+matched.kl, 0)
  await snapshot('support-matched')
  await slider('Support displacement', 'ArrowLeft', 'theta', -.05)
  const separated = await data()
  assert.equal(+separated.w, .05); assert.equal(+separated.jsd, Math.log(2)); assert.equal(+separated.kl, Infinity)
  await returnTo(support)
  await demo().getByRole('button', { name: 'Reset', exact: true }).click()
  assert.equal(+(await data()).theta, 1.5)
  checks.push('Inline support displacement, exact match, negative displacement, keyboard isolation and Reset')

  await go(langevin)
  const initial = await data()
  await snapshot('langevin-initial')
  await demo().getByRole('button', { name: 'Step', exact: true }).click()
  const expected = advanceLangevin(initialLangevin(), false), after = await data()
  assert.equal(+after.step, 1)
  assert.ok(Math.abs(+after.x - expected.points[0].x) < 1e-12)
  const stepUrl = page.url()
  await demo().getByRole('button', { name: 'Step', exact: true }).focus()
  await page.keyboard.press('Enter')
  assert.equal(page.url(), stepUrl); assert.equal(+(await data()).step, 2)
  for (const noise of [false, true]) {
    await demo().getByRole('button', { name: noise ? 'Noise on' : 'Noise off', exact: true }).click()
    await demo().getByRole('button', { name: 'Reset', exact: true }).click()
    await demo().getByRole('button', { name: 'Run', exact: true }).click()
    await page.waitForFunction(() => Number(document.querySelector('[data-demo="langevin"]')?.getAttribute('data-step')) >= 300)
    await demo().getByRole('button', { name: 'Pause', exact: true }).click()
    const paused = await data()
    assert.equal(paused.running, 'false'); assert.equal(paused.noise, String(noise))
    await snapshot(`langevin-${noise ? 'noise' : 'no-noise'}`)
    await returnTo(langevin)
  }
  await demo().getByRole('button', { name: 'Run', exact: true }).click()
  await page.locator('.slidev-layout:visible h1').click(); await page.keyboard.press('ArrowDown')
  await page.waitForURL(new RegExp(`/${langevin.slide + 1}(?:\\?|$)`))
  await page.keyboard.press('ArrowUp'); await demo().waitFor()
  assert.equal((await data()).running, 'false', 'Simulation must pause on leaving the slide')
  await demo().getByRole('button', { name: 'Reset', exact: true }).click()
  assert.equal((await data()).x, initial.x); assert.equal((await data()).y, initial.y)
  await demo().getByRole('button', { name: 'Noise off', exact: true }).click()
  checks.push('Langevin exact step, both live simulations, Pause, navigation stop and reproducible Reset')
  await demo().getByRole('button', { name: 'Run', exact: true }).click()
  await page.waitForFunction(limit => Number(document.querySelector('[data-demo="langevin"]')?.getAttribute('data-step')) === limit, langevinConfig.maxSteps)
  assert.equal((await data()).running, 'false')
  assert.equal(await demo().getByRole('button', { name: 'Run', exact: true }).isDisabled(), true)
  assert.equal(await demo().getByRole('button', { name: 'Step', exact: true }).isDisabled(), true)
  await snapshot('langevin-finished-600')
  await demo().getByRole('button', { name: 'Reset', exact: true }).click()
  assert.equal(+(await data()).step, 0)
  assert.equal(await demo().getByRole('button', { name: 'Run', exact: true }).isEnabled(), true)
  checks.push('Langevin stops at 600 steps; Run/Step disable and Reset restores controls')

  for (const [slide, button] of [[support, 'Match'], [langevin, 'Noise on']]) {
    await go(slide, true)
    const toolbar = page.getByRole('navigation', { name: 'Lecture annotation tools' })
    await toolbar.waitFor()
    await toolbar.getByRole('button', { name: 'Ink #007f82', exact: true }).click()
    const url = page.url()
    await penClick(demo().getByRole('button', { name: button, exact: true }))
    assert.equal(page.url(), url)
    const values = await data()
    if (slide === support) assert.equal(+values.theta, 0)
    if (slide === langevin) assert.equal(values.noise, 'true')
    await snapshot(`pen-controls-${slide.slide}`)
    // Isolated QA server/context: check one annotation, then undo exactly that stroke.
    const layer = page.locator('#slideshow ~ svg.w-full.h-full.absolute.top-0'), before = await layer.innerHTML()
    await page.mouse.move(250, 320); await page.mouse.down(); await page.mouse.move(350, 355, { steps: 8 }); await page.mouse.up()
    assert.notEqual(await layer.innerHTML(), before)
    await toolbar.getByRole('button', { name: 'Undo', exact: true }).click()
    assert.equal(await layer.innerHTML(), before)
    await toolbar.getByRole('button', { name: 'Pen', exact: true }).click()
  }
  checks.push('Controls work with pen active; plots accept annotations; synthetic strokes undone')
  for (const slide of [support, langevin]) {
    await page.goto(`${base}/${slide.slide}?print&clicks=${slide.clicks}`, { waitUntil: 'networkidle' })
    await page.evaluate(() => document.fonts.ready)
    assert.equal(await demo().locator('button,input').count(), 0)
    await snapshot(`print-${slide.slide}`)
  }
  const alpha = await demo().locator('.histogram rect').first().evaluate(el => getComputedStyle(el).fill)
  assert.ok(!alpha.startsWith('rgba'), 'Particle colors must not be made transparent by an SVG attribute utility')
  checks.push('Print comparisons fit above citations; controls omitted; particle fill remains visible')
  assert.deepEqual(errors, []); assert.deepEqual(failed, []); assert.deepEqual(external, [])
  console.log(JSON.stringify({ checks, screenshots: screenshots.length, errors, failed, external }, null, 2))
} finally {
  writeFileSync(resolve(qa, 'report.json'), JSON.stringify({ checks, screenshots, errors, failed, external }, null, 2))
  await browser.close()
}
