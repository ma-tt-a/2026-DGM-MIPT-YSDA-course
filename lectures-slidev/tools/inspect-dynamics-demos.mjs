import { chromium } from 'playwright-chromium'
import { resolve } from 'node:path'
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import assert from 'node:assert/strict'
import { root, lecturePaths } from './course.mjs'
const lecture=lecturePaths('9'),base=process.env.SLIDEV_QA_URL||`http://localhost:${lecture.port}`
const map=JSON.parse(readFileSync(lecture.map,'utf8')),qa=resolve(root,'output/qa/lecture9/dynamics-demos')
mkdirSync(qa,{recursive:true})
const browser=await chromium.launch({executablePath:process.env.SLIDEV_BROWSER_PATH||'/Applications/Yandex.app/Contents/MacOS/Yandex',headless:true})
const context=await browser.newContext({viewport:{width:1280,height:720}}),page=await context.newPage()
const errors=[],http=[],external=[],states=[]
page.on('pageerror',e=>errors.push(String(e)));page.on('response',r=>{if(r.status()>=400)http.push([r.status(),r.url()])})
await context.route('**/*',route=>{const url=new URL(route.request().url());if(['http:','https:'].includes(url.protocol)&&url.origin!==new URL(base).origin){external.push(url.href);return route.abort()}return route.continue()})
const slide=title=>map.find(s=>s.title===title)
const selected=[slide('Numerical Solution of ODEs: Euler and Heun'),slide('Divergence: Where Does the Density Go?'),slide('Langevin: Moving Particles, Stationary Density')]
const data=demo=>demo.evaluate(el=>({...el.dataset}))
async function go(s,query=''){await page.goto(`${base}/${s.slide}${query}`,{waitUntil:'networkidle'});await page.evaluate(()=>document.fonts.ready);return page.locator('[data-demo]:visible')}
async function snapshot(name){
  await page.mouse.move(1270,20)
  const bad=await page.locator('.slidev-layout:visible').evaluate(layout=>{
    const rect=layout.getBoundingClientRect(),source=layout.querySelector('.source').getBoundingClientRect().top
    return [...layout.querySelectorAll('[data-demo],.demo-note,.demo-takeaway,svg text,button,input,.l9-formula')].filter(el=>el.getBoundingClientRect().width&&getComputedStyle(el).visibility!=='hidden').map(el=>({tag:el.tagName,text:el.textContent.slice(0,70),rect:el.getBoundingClientRect().toJSON()})).filter(({rect:r})=>r.bottom>Math.min(source-8,rect.top+672)||r.left<rect.left+40||r.right>rect.right-40)
  })
  assert.deepEqual(bad,[],`Layout ${name}`);assert.equal(await page.locator('.katex-error:visible').count(),0)
  await page.screenshot({path:resolve(qa,`${name}.png`)});states.push(name)
}
async function reentry(demo,s){
  const before=await data(demo);await page.locator('.slidev-layout:visible h1').click();await page.keyboard.press('ArrowRight');await page.waitForURL(new RegExp(`/${s.slide+1}(?:\\?|$)`));await page.keyboard.press('ArrowLeft');await page.waitForURL(new RegExp(`/${s.slide}(?:\\?|$)`));await demo.waitFor({state:'visible'});assert.deepEqual(await data(demo),before)
  await page.keyboard.press('ArrowUp');await page.waitForURL(new RegExp(`/${s.slide-1}(?:\\?|$)`));await page.keyboard.press('ArrowDown');await page.waitForURL(new RegExp(`/${s.slide}(?:\\?|$)`));await demo.waitFor({state:'visible'});assert.deepEqual(await data(demo),before)
}
try{
  let demo=await go(selected[0]);await snapshot('solver-initial')
  for(const n of [4,8,16,32]){
    await demo.getByRole('button',{name:String(n),exact:true}).click();await demo.getByRole('button',{name:'Complete',exact:true}).click();assert.equal(+(await data(demo)).count,n);await snapshot(`solver-${n}`)
  }
  await demo.getByRole('button',{name:'Reset',exact:true}).click();await demo.getByRole('button',{name:'One step',exact:true}).click();assert.equal(+(await data(demo)).count,2);await reentry(demo,selected[0])
  demo=await go(selected[1]);for(const mode of ['Expansion','Contraction','Shear']){await demo.getByRole('button',{name:mode,exact:true}).click();for(const t of ['0','0.75','1.5']){await demo.getByRole('slider').fill(t);await snapshot(`patch-${mode}-${t}`)}}await reentry(demo,selected[1])
  demo=await go(selected[2]);for(const mode of ['Drift only','Diffusion only','Both']){await demo.getByRole('button',{name:mode,exact:true}).click();for(const step of ['0','60','120']){await demo.getByRole('slider').fill(step);await snapshot(`stationary-${mode.replaceAll(' ','-')}-${step}`)}}await reentry(demo,selected[2])
  await demo.getByRole('button',{name:'Reset',exact:true}).click();await demo.getByRole('button',{name:'Step',exact:true}).click();assert.equal(+(await data(demo)).step,1);await demo.getByRole('button',{name:'Run',exact:true}).click();await page.waitForFunction(()=>+document.querySelector('[data-demo="stationary-langevin"]').dataset.step>3);await page.locator('.slidev-layout:visible h1').click();await page.keyboard.press('ArrowRight');await page.keyboard.press('ArrowLeft');assert.equal((await data(demo)).running,'false')
  for(const s of selected){
    demo=await go(s,'?tools');const slider=demo.getByRole('slider')
    if(await slider.count()){await slider.focus();const url=page.url();await page.keyboard.press('ArrowRight');assert.equal(page.url(),url)}
    const pen=page.getByRole('navigation',{name:'Lecture annotation tools'}).getByRole('button',{name:'Pen',exact:true});if(await pen.getAttribute('aria-pressed')!=='true')await pen.click()
    const reset=await demo.getByRole('button',{name:'Reset',exact:true}).boundingBox(),cdp=await context.newCDPSession(page)
    for(const type of ['mousePressed','mouseReleased'])await cdp.send('Input.dispatchMouseEvent',{type,x:reset.x+reset.width/2,y:reset.y+reset.height/2,button:'left',buttons:type==='mousePressed'?1:0,clickCount:1,pointerType:'pen'})
    await cdp.detach();await snapshot(`pen-${s.slide}`);await pen.click()
    await go(s,'?print');assert.equal(await page.locator('[data-demo]:visible .demo-controls').count(),0);await snapshot(`print-${s.slide}`)
  }
  assert.deepEqual(errors,[]);assert.deepEqual(http,[]);assert.deepEqual(external,[])
  console.log(`Lecture 9: ${states.length} states passed; presets, endpoints, step/run/pause, reentry, keyboard, offline, print, synthetic pen.`)
}finally{writeFileSync(resolve(qa,'report.json'),JSON.stringify({states,errors,http,external},null,2));await browser.close()}
