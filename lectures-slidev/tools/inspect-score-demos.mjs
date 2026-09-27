import { chromium } from 'playwright-chromium'
import { resolve } from 'node:path'
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { createHash } from 'node:crypto'
import assert from 'node:assert/strict'
import { lecturePaths, root } from './course.mjs'
import { observationPresets, observationBounds, posteriorAt, diffusionAt, diffusionTimes } from '../lecture6/lib/score-demos.mjs'

const lecture = lecturePaths('6')
const base = process.env.SLIDEV_QA_URL || `http://localhost:${lecture.port}`
const map = JSON.parse(readFileSync(lecture.map, 'utf8'))
const tweedie = map.find(s => s.title === 'From Conditional Scores to Denoising')
const diffusion = map.find(s => s.frame === 'imported: 7:12')
const qa = resolve(root, 'output/qa/lecture6/score-demos')
mkdirSync(qa, { recursive: true })
const browser = await chromium.launch({ executablePath: process.env.SLIDEV_BROWSER_PATH || '/Applications/Yandex.app/Contents/MacOS/Yandex', headless: true })
const context = await browser.newContext({ viewport: { width: 1280, height: 720 } })
const page = await context.newPage()
const errors = [], failures = [], external = [], states = []
page.on('pageerror', e => errors.push(String(e)))
page.on('response', r => { if (r.status() >= 400) failures.push([r.status(), r.url()]) })
await context.route('**/*', route => {
  const url = new URL(route.request().url())
  if (['http:', 'https:'].includes(url.protocol) && url.origin !== new URL(base).origin) { external.push(url.href); return route.abort() }
  return route.continue()
})
const close = (a, b) => assert.ok(Math.abs(a-b) < 1e-9, `${a} != ${b}`)
const dataset = demo => demo.evaluate(el => ({...el.dataset}))
async function go(s, clicks = s.clicks, penTools = false) {
  await page.goto(`${base}/${s.slide}?clicks=${clicks}${penTools ? '&tools' : ''}`, { waitUntil: 'networkidle' })
  await page.evaluate(() => document.fonts.ready)
  assert.match(await page.locator('.course-folio:visible').last().innerText(), new RegExp(`/ ${map.length}$`))
  const demo = page.locator('[data-demo]:visible'); await demo.waitFor({state:'visible'}); return demo
}
async function snapshot(name) {
  await page.mouse.move(1240,20)
  const overflow = await page.locator('[data-demo]:visible').evaluate(demo => {
    const layout = demo.closest('.slidev-layout'), r = layout.getBoundingClientRect(), scale = r.width / 1280
    const bottom = Math.min(r.top + 660*scale, layout.querySelector('.source').getBoundingClientRect().top - 12*scale)
    return [...demo.querySelectorAll('button,label,svg,.explanation-step,.demo-takeaway,.plot-key,.coefficients,.density-note,.diffusion-description')]
      .filter(el => getComputedStyle(el).visibility !== 'hidden')
      .map(el => ({text:el.textContent.slice(0,100),r:el.getBoundingClientRect().toJSON()}))
      .filter(el => el.r.width>0 && (el.r.bottom>bottom+.5 || el.r.right>r.right-40*scale || el.r.left<r.left+40*scale))
  })
  assert.deepEqual(overflow,[],`Overflow in ${name}`)
  assert.equal(await page.locator('.katex-error:visible').count(),0)
  await page.screenshot({path:resolve(qa,`${name}.png`)})
  states.push(name)
}
async function validatePosterior(demo) {
  const d = await dataset(demo), p = posteriorAt({x:+d.x,y:+d.y})
  close(+d.meanX,p.mean.x); close(+d.meanY,p.mean.y); close(+d.scoreX,p.score.x); close(+d.scoreY,p.score.y)
  d.weights.split(',').forEach((w,i)=>close(+w,p.weights[i]))
}
async function returns(demo,s) {
  const before = await dataset(demo)
  await page.locator('.slidev-layout:visible h1').click()
  await page.keyboard.press('ArrowRight'); await page.waitForURL(new RegExp(`/${s.slide+1}(?:\\?|$)`))
  await page.keyboard.press('ArrowLeft'); await page.waitForURL(new RegExp(`/${s.slide}(?:\\?|$)`))
  assert.deepEqual(await dataset(demo),before,'Return from next slide')
  await page.keyboard.press('ArrowUp'); await page.waitForURL(new RegExp(`/${s.slide-1}(?:\\?|$)`))
  await page.keyboard.press('ArrowDown'); await page.waitForURL(new RegExp(`/${s.slide}(?:\\?|$)`))
  for(let i=0;i<s.clicks;i++)await page.keyboard.press('ArrowRight')
  assert.deepEqual(await dataset(demo),before,'Return from previous slide')
}
try {
  let demo = await go(tweedie,0)
  const initialBox = await demo.locator('svg').first().boundingBox()
  for(let stage=0;stage<=3;stage++) {
    if(stage)await page.keyboard.press('ArrowRight')
    await page.waitForFunction(s=>document.querySelector('[data-demo="tweedie"]').dataset.stage===String(s),stage)
    for(const [selector,reveal] of [['[data-posterior-weights]',1],['[data-marginal-formula]',2],['[data-tweedie-formula]',3]]) {
      assert.equal(await demo.locator(selector).evaluate(el=>getComputedStyle(el).visibility), stage>=reveal?'visible':'hidden')
    }
    assert.deepEqual(await demo.locator('svg').first().boundingBox(),initialBox,'Reveal must preserve plot geometry')
    await snapshot(`tweedie-stage-${stage}`)
  }
  for(let stage=2;stage>=0;stage--) {await page.keyboard.press('ArrowLeft');close(+(await dataset(demo)).stage,stage)}
  for(let stage=1;stage<=3;stage++)await page.keyboard.press('ArrowRight')
  for(const preset of observationPresets) {
    await demo.getByRole('button',{name:preset.label,exact:true}).click()
    close(+(await dataset(demo)).x,preset.x);close(+(await dataset(demo)).y,preset.y)
    await validatePosterior(demo);await snapshot(`tweedie-${preset.label.toLowerCase().replaceAll(' ','-')}`)
  }
  const handle = demo.locator('[data-observation-handle]')
  await handle.focus();const beforeURL=page.url();await page.keyboard.press('ArrowLeft')
  assert.equal(page.url(),beforeURL);close(+(await dataset(demo)).x,1.35)
  await page.keyboard.press('Home');close(+(await dataset(demo)).x,0)
  const box = await handle.boundingBox()
  await page.mouse.move(box.x+box.width/2,box.y+box.height/2);await page.mouse.down()
  await page.mouse.move(box.x+box.width/2+70,box.y+box.height/2-35,{steps:8});await page.mouse.up()
  assert.ok(+(await dataset(demo)).x>.7);await validatePosterior(demo);await snapshot('tweedie-drag')
  const moved=await handle.boundingBox();await page.mouse.move(moved.x+moved.width/2,moved.y+moved.height/2);await page.mouse.down()
  await page.mouse.move(1240,680,{steps:8});await page.mouse.up()
  close(+(await dataset(demo)).x,observationBounds.xmax);close(+(await dataset(demo)).y,observationBounds.ymin)
  await snapshot('tweedie-boundary');await returns(demo,tweedie)
  await demo.getByRole('button',{name:'Reset',exact:true}).click();close(+(await dataset(demo)).x,0)

  demo = await go(diffusion)
  for(const t of diffusionTimes) {
    await demo.getByRole('button',{name:String(t),exact:true}).click()
    const d=await dataset(demo),expected=diffusionAt(t)
    close(+d.t,t);close(+d.signal,expected.signal);close(+d.noise,expected.noise)
    await snapshot(`diffusion-${t}`)
  }
  const slider = demo.getByRole('slider',{name:'Diffusion timestep'})
  await slider.fill('417');close(+(await dataset(demo)).t,417)
  await slider.focus();const url=page.url();await page.keyboard.press('ArrowRight')
  assert.equal(page.url(),url);close(+(await dataset(demo)).t,418)
  await returns(demo,diffusion)
  await demo.getByRole('button',{name:'Reset',exact:true}).click();close(+(await dataset(demo)).t,0)

  for(const slide of [tweedie,diffusion]) {
    demo=await go(slide,slide.clicks,true)
    const pen=page.getByRole('navigation',{name:'Lecture annotation tools'}).getByRole('button',{name:'Pen',exact:true})
    if(await pen.getAttribute('aria-pressed')!=='true')await pen.click()
    const control=demo.getByRole('button',{name:slide===tweedie?'Near right':'250',exact:true})
    await control.click()
    if(slide===tweedie) {
      close(+(await dataset(demo)).x,1.4)
      assert.equal(await demo.locator('[data-observation-handle]').evaluate(el=>getComputedStyle(el).pointerEvents),'none')
    } else close(+(await dataset(demo)).t,250)
    await snapshot(`pen-${slide.slide}`)
    const reset=await demo.getByRole('button',{name:'Reset',exact:true}).boundingBox()
    const cdp=await context.newCDPSession(page)
    for(const type of ['mousePressed','mouseReleased'])await cdp.send('Input.dispatchMouseEvent',{type,x:reset.x+reset.width/2,y:reset.y+reset.height/2,button:'left',buttons:type==='mousePressed'?1:0,clickCount:1,pointerType:'pen'})
    await cdp.detach()
    close(+(await dataset(demo))[slide===tweedie?'x':'t'],0)
    await pen.click()
  }
  assert.deepEqual(errors,[]);assert.deepEqual(failures,[]);assert.deepEqual(external,[])
  console.log(`Score demos: ${states.length} visual states; reveals, exact readouts, drag bounds, keyboard, returns, reset, offline and pen hit-testing passed.`)
} finally {
  await page.screenshot({path:resolve(qa,'last-state.png')})
  writeFileSync(resolve(qa,'report.json'),JSON.stringify({states,errors,failures,external,sourceSha256:createHash('sha256').update(readFileSync(lecture.entry)).digest('hex')},null,2))
  await browser.close()
}
