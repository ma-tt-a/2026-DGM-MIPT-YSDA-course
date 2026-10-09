import { chromium } from 'playwright-chromium'
import { resolve } from 'node:path'
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import assert from 'node:assert/strict'
import { root, lecturePaths } from './course.mjs'
const lecture=lecturePaths('7'), base=process.env.SLIDEV_QA_URL||`http://localhost:${lecture.port}`
const map=JSON.parse(readFileSync(lecture.map,'utf8')), qa=resolve(root,'output/qa/lecture7/visual-demos')
mkdirSync(qa,{recursive:true})
const browser=await chromium.launch({executablePath:process.env.SLIDEV_BROWSER_PATH||'/Applications/Yandex.app/Contents/MacOS/Yandex',headless:true})
const context=await browser.newContext({viewport:{width:1280,height:720}}), page=await context.newPage()
const errors=[],http=[],external=[],states=[]
page.on('pageerror',e=>errors.push(String(e)))
page.on('response',r=>{if(r.status()>=400)http.push([r.status(),r.url()])})
await context.route('**/*',route=>{const u=new URL(route.request().url());if(['http:','https:'].includes(u.protocol)&&u.origin!==new URL(base).origin){external.push(u.href);return route.abort()}return route.continue()})
const slide=frame=>map.find(s=>s.frame===frame)
async function go(s,tools=false){await page.goto(`${base}/${s.slide}?clicks=${s.clicks}${tools?'&tools':''}`,{waitUntil:'networkidle'});await page.evaluate(()=>document.fonts.ready);return page.locator('[data-demo]:visible')}
async function snapshot(name){
  await page.mouse.move(1240,20)
  const violations=await page.locator('.slidev-layout:visible').evaluate(layout=>{
    const r=layout.getBoundingClientRect(),scale=r.width/1280,source=layout.querySelector('.source').getBoundingClientRect().top
    return [...layout.querySelectorAll('[data-demo], [data-chain], .takeaway, .demo-takeaway, .demo-note, .block, p, li')].filter(e=>getComputedStyle(e).visibility!=='hidden'&&!e.closest('.slidev-vclick-hidden')).map(e=>({text:e.textContent.slice(0,90),r:e.getBoundingClientRect().toJSON()})).filter(e=>e.r.width&&e.r.height&&(e.r.bottom>Math.min(source-10*scale,r.top+665*scale)||e.r.left<r.left+40*scale||e.r.right>r.right-40*scale))
  })
  assert.deepEqual(violations,[],`Layout in ${name}`);assert.equal(await page.locator('.katex-error:visible').count(),0)
  await page.screenshot({path:resolve(qa,`${name}.png`)});states.push(name)
}
const data=demo=>demo.evaluate(e=>({...e.dataset}))
async function reentry(demo,s){
  const before=await data(demo)
  await page.locator('.slidev-layout:visible h1').click();await page.keyboard.press('ArrowRight');await page.waitForURL(new RegExp(`/${s.slide+1}(?:\\?|$)`))
  await page.keyboard.press('ArrowLeft');await page.waitForURL(new RegExp(`/${s.slide}(?:\\?|$)`));assert.deepEqual(await data(demo),before)
  await page.keyboard.press('ArrowUp');await page.waitForURL(new RegExp(`/${s.slide-1}(?:\\?|$)`))
  await page.keyboard.press('ArrowDown');await page.waitForURL(new RegExp(`/${s.slide}(?:\\?|$)`))
  for(let i=0;i<s.clicks;i++)await page.keyboard.press('ArrowRight')
  assert.deepEqual(await data(demo),before)
}
try{
  const reverse=slide('extension: 18'),schedule=slide('extension: 19'),prediction=slide('extension: imported: 8:13')
  let demo=await go(reverse);await snapshot('reverse-unknown')
  await demo.getByRole('button',{name:'Known x₀',exact:true}).click()
  for(const x of [-2,2]){await demo.getByRole('button',{name:`Use x₀ = ${x}`,exact:true}).click();await snapshot(`reverse-known-${x}`)}
  const observation=demo.getByRole('slider',{name:'Noisy observation'})
  for(const x of ['-2','2']){await observation.fill(x);await snapshot(`reverse-observation-${x}`)}
  await observation.focus();const url=page.url();await page.keyboard.press('ArrowLeft');assert.equal(page.url(),url);assert.equal(+(await data(demo)).xt,1.95)
  await reentry(demo,reverse);await demo.getByRole('button',{name:'Reset',exact:true}).click();assert.equal((await data(demo)).known,'false');assert.equal(+(await data(demo)).xt,0)

  demo=await go(schedule);const timestep=demo.getByRole('slider',{name:'Schedule timestep'})
  for(const t of ['1','250','500','750','1000']){await timestep.fill(t);assert.equal(+(await data(demo)).t,+t);await snapshot(`schedule-${t}`)}
  await timestep.focus();const scheduleURL=page.url();await page.keyboard.press('ArrowLeft');assert.equal(page.url(),scheduleURL);assert.equal(+(await data(demo)).t,999)
  await reentry(demo,schedule);await demo.getByRole('button',{name:'Reset',exact:true}).click();assert.equal(+(await data(demo)).t,500)

  demo=await go(prediction)
  const values=d=>({noise:+d.noise,clean:+d.clean,mean:+d.mean})
  const near=(a,b)=>assert.ok(Math.abs(a-b)<1e-8)
  for(const [key,name] of [['clean','Clean data'],['noise','Noise'],['mean','Reverse mean']]) {
    const before=values(await data(demo))
    await demo.getByRole('button',{name,exact:true}).click()
    assert.deepEqual(values(await data(demo)),before,'Switching output must preserve all predictions')
    assert.equal((await data(demo)).output,key)
    await snapshot('parameterization-'+key)
    const slider=demo.getByRole('slider',{name:name+' prediction',exact:true})
    const min=+(await slider.getAttribute('min')),max=+(await slider.getAttribute('max'))
    for(const fraction of [0,.5,1]) {
      // First select a different output, then drag this formerly computed control.
      await demo.getByRole('button',{name:key==='noise'?'Clean data':'Noise',exact:true}).click()
      if(fraction===0){await slider.press('End');await slider.press('Home')}
      else if(fraction===1){await slider.press('Home');await slider.press('End')}
      else await slider.fill(String(+(min+(max-min)*fraction).toFixed(8)))
      const d=await data(demo),v=values(d)
      assert.equal(d.output,key)
      near(Math.sqrt(.39)*v.clean+Math.sqrt(.61)*v.noise,1)
      near(v.mean,Math.sqrt(.6)*.35/.61 + Math.sqrt(.65)*.4/.61*v.clean)
      near(+await slider.inputValue(),v[key])
      await snapshot('parameterization-'+key+'-'+fraction)
    }
  }
  await demo.getByRole('button',{name:'Reset',exact:true}).click()
  const noise=demo.getByRole('slider',{name:'Noise prediction',exact:true})
  await noise.focus();const predictionURL=page.url();await page.keyboard.press('ArrowRight')
  assert.equal(page.url(),predictionURL);assert.ok(+(await data(demo)).noise>.5 && +(await data(demo)).noise<.6)
  await reentry(demo,prediction)
  await demo.getByRole('button',{name:'Reset',exact:true}).click()
  assert.equal((await data(demo)).output,'noise');near(+(await data(demo)).noise,.5)

  for(const frame of [20,21,25]){const s=slide(frame);await go(s);await snapshot(`chain-${frame}`)}
  for(const s of [reverse,schedule,prediction]){
    demo=await go(s,true)
    const pen=page.getByRole('navigation',{name:'Lecture annotation tools'}).getByRole('button',{name:'Pen',exact:true})
    if(await pen.getAttribute('aria-pressed')!=='true')await pen.click()
    const slider=s===prediction?demo.getByRole('slider',{name:'Noise prediction',exact:true}):demo.getByRole('slider');await slider.fill(s===reverse?'1':s===schedule?'750':'1.5')
    const reset=await demo.getByRole('button',{name:'Reset',exact:true}).boundingBox(),cdp=await context.newCDPSession(page)
    for(const type of ['mousePressed','mouseReleased'])await cdp.send('Input.dispatchMouseEvent',{type,x:reset.x+reset.width/2,y:reset.y+reset.height/2,button:'left',buttons:type==='mousePressed'?1:0,clickCount:1,pointerType:'pen'})
    await cdp.detach();assert.equal(+(await data(demo))[s===reverse?'xt':s===schedule?'t':'noise'],s===reverse?0:s===schedule?500:.5)
    await snapshot(`pen-${s.slide}`);await pen.click()
  }
  assert.deepEqual(errors,[]);assert.deepEqual(http,[]);assert.deepEqual(external,[])
  console.log(`Lecture 7 demos: ${states.length} visual states; controls, boundaries, keyboard, reentry, Reset, parameterization invariance, offline and synthetic pen checks passed.`)
}finally{writeFileSync(resolve(qa,'report.json'),JSON.stringify({states,errors,http,external},null,2));await browser.close()}
