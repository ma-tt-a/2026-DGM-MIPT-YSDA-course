import { chromium } from 'playwright-chromium'
import { resolve } from 'node:path'
import { mkdirSync, writeFileSync } from 'node:fs'
import assert from 'node:assert/strict'
const base=process.env.SLIDEV_QA_URL||'http://localhost:3042'
const out=resolve('output/qa/lecture12/interactive-demos');mkdirSync(out,{recursive:true})
const browser=await chromium.launch({executablePath:process.env.SLIDEV_BROWSER_PATH||'/Applications/Yandex.app/Contents/MacOS/Yandex',headless:true})
const context=await browser.newContext({viewport:{width:1280,height:720}}),page=await context.newPage(),errors=[],external=[],states=[]
page.on('pageerror',e=>errors.push(String(e)))
await context.route('**/*',r=>{const u=new URL(r.request().url());if(['http:','https:'].includes(u.protocol)&&u.origin!==new URL(base).origin){external.push(u.href);return r.abort()}return r.continue()})
const demo=()=>page.locator('.slidev-layout:visible [data-demo]')
async function go(n,c,extra=''){await page.goto(`${base}/${n}?clicks=${c}${extra}`,{waitUntil:'networkidle'});await page.evaluate(()=>document.fonts.ready)}
async function snap(name){
  await page.mouse.move(1270,10);await page.screenshot({path:resolve(out,name+'.png')})
  const overlap=await page.locator('.slidev-layout:visible').evaluate(e=>{const foot=e.querySelector('.source').getBoundingClientRect().top;return [...e.children].filter(c=>!c.classList.contains('source')).map(c=>({tag:c.tagName,bottom:c.getBoundingClientRect().bottom,foot})).filter(c=>c.bottom>foot-8)})
  states.push({name,overlap});assert.equal(await page.locator('.katex-error:visible').count(),0)
  assert.equal(await demo().evaluate(e=>/NaN|Infinity/.test(e.innerHTML)),false)
}
try{
  for(const [n,max] of (process.argv.includes('--coupling-only') ? [[31,3]] : [[25,2],[26,1],[31,3],[49,2],[50,1]])) {
    for(let c=0;c<=max;c++){await go(n,c);await snap(`${n}-${c}`)}
    if(n!==31){await page.locator('.slidev-layout:visible h1').click();await page.keyboard.press('ArrowLeft');assert.equal(await demo().evaluate(e=>e.classList.contains('slidev-vclick-hidden')),true);await page.keyboard.press('ArrowRight');assert.equal(await demo().evaluate(e=>e.classList.contains('slidev-vclick-hidden')),false)}
    if(n===25||n===26){
      for(const t of ['0','0.5','1'])for(const s of ['0','0.35','0.7']){await demo().getByRole('slider',{name:'Path time',exact:true}).fill(t);await demo().getByRole('slider',{name:'Smoothing scale'}).fill(s);await snap(`${n}-t${t}-s${s}`)}
      await demo().getByRole('slider',{name:'Path time',exact:true}).focus();const url=page.url();await page.keyboard.press('ArrowLeft');assert.equal(page.url(),url);assert.equal(await demo().getAttribute('data-t'),'0.99')
    }
    if(n===31){
      // Selecting a visible control must reveal its explanation, not require advance clicks.
      for(const stage of [1,2]) {
        await go(31,stage)
        const ot=demo().getByRole('button',{name:'Minibatch OT',exact:true})
        assert.equal(await ot.isEnabled(),true)
        await ot.click()
        await page.waitForFunction(()=>document.querySelector('.slidev-layout:not([hidden]) [data-demo="coupling"][data-stage="3"][data-mode="2"]'))
        assert.equal(await demo().getAttribute('data-mode'),'2')
        assert.equal(await demo().locator('svg').getAttribute('data-pairing'),'0,1,2,3,4,5')
        await page.locator('.slidev-layout:visible h1').click();await page.keyboard.press('ArrowLeft')
        assert.equal(await demo().getAttribute('data-stage'),'2')
        await demo().getByRole('button',{name:'Minibatch OT',exact:true}).focus();await page.keyboard.press('Enter')
        await page.waitForURL(/clicks=3/)
        assert.equal(await demo().getAttribute('data-mode'),'2')
        await snap(`31-ot-from-${stage}`)
      }
      for(const [i,label] of ['Independent','Paired data','Minibatch OT'].entries()){await demo().getByRole('button',{name:label,exact:true}).click();assert.equal(await demo().getAttribute('data-mode'),String(i));await snap(`31-mode${i}`)}
      await demo().getByRole('button',{name:'Independent',exact:true}).click();const old=await demo().locator('svg').getAttribute('data-pairing');await demo().getByRole('button',{name:'Reshuffle'}).click();assert.notEqual(await demo().locator('svg').getAttribute('data-pairing'),old)
    }
    if(n===49||n===50){
      for(const t of ['0','4','20'])for(const token of ['A','B','C']){await demo().getByRole('slider').fill(t);await demo().getByRole('button',{name:token,exact:true}).click();const ps=(await demo().getAttribute('data-probabilities')).split(',').map(Number);assert.ok(Math.abs(ps.reduce((a,b)=>a+b,0)-1)<1e-12);await snap(`${n}-t${t}-${token}`)}
      await demo().getByRole('slider').focus();const url=page.url();await page.keyboard.press('ArrowLeft');assert.equal(page.url(),url);assert.equal(await demo().getAttribute('data-t'),'19');await demo().getByRole('button',{name:'Step',exact:true}).click();assert.equal(await demo().getAttribute('data-t'),'20');assert.equal(await demo().getByRole('button',{name:'Step',exact:true}).isDisabled(),true)
    }
    await demo().getByRole('button',{name:'Reset',exact:true}).click()
    if(n!==31){await demo().getByRole('slider').first().fill(n<30?'0.37':'7');const before=await demo().getAttribute('data-t');await page.locator('.slidev-layout:visible h1').click();await page.keyboard.press('ArrowRight');await page.keyboard.press('ArrowLeft');assert.equal(await demo().getAttribute('data-t'),before)}
    await go(n,max,'&tools');const pen=page.getByRole('navigation',{name:'Lecture annotation tools'}).getByRole('button',{name:'Pen',exact:true});if(await pen.getAttribute('aria-pressed')!=='true')await pen.click()
    const box=await demo().getByRole('button',{name:'Reset',exact:true}).boundingBox(),cdp=await context.newCDPSession(page)
    for(const type of ['mousePressed','mouseReleased'])await cdp.send('Input.dispatchMouseEvent',{type,x:box.x+box.width/2,y:box.y+box.height/2,button:'left',buttons:type==='mousePressed'?1:0,clickCount:1,pointerType:'pen'})
    await cdp.detach();await pen.click()
    await go(n,max,'&print');await snap(`${n}-print`);assert.equal(await demo().locator('.demo-controls').count(),0)
  }
  assert.deepEqual(errors,[]);assert.deepEqual(external,[]);assert.deepEqual(states.filter(s=>s.overlap.length),[],'Content overlaps sources');console.log(`${states.length} states passed`)
}finally{writeFileSync(resolve(out,'report.json'),JSON.stringify({states,errors,external},null,2));await browser.close()}
