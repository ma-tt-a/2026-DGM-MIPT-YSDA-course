import test from 'node:test'
import assert from 'node:assert/strict'
import { bridge, gaussian, conditionalMean, reverseAt, schedules, scheduleAt, noisyImage, predictionInput, predictionFrom, predictionBounds } from '../lecture7/lib/diffusion-demos.mjs'
const near=(a,b,tol=1e-10)=>assert.ok(Math.abs(a-b)<tol,`${a} != ${b}`)
const integral=fn=>{let sum=0;const dx=.002;for(let x=-10+dx/2;x<10;x+=dx)sum+=fn(x)*dx;return sum}

test('Conditioned Gaussian agrees with Bayes rule and integrates to one',()=>{
  for(const x0 of [-2,2])for(const xt of [-2,0,1.5]) {
    const kernel=x=>gaussian(x,conditionalMean(xt,x0),bridge.variance)
    near(integral(kernel),1)
    for(const x of [-2,-.7,0,.8,2]) {
      const bayes=gaussian(xt,Math.sqrt(bridge.alpha)*x,1-bridge.alpha)
        *gaussian(x,Math.sqrt(bridge.alphaBarPrevious)*x0,1-bridge.alphaBarPrevious)
        /gaussian(xt,Math.sqrt(bridge.alphaBar)*x0,1-bridge.alphaBar)
      near(kernel(x),bayes)
    }
  }
})
test('Unknown clean data is a normalized posterior-weighted mixture, not a chosen mode',()=>{
  for(const xt of [-2,0,2]) {
    const r=reverseAt(xt);near(r.weights[0]+r.weights[1],1);near(integral(r.density),1)
    const qPrevious=x=>.5*gaussian(x,-2*Math.sqrt(.65),.35)+.5*gaussian(x,2*Math.sqrt(.65),.35)
    const qCurrent=.5*gaussian(xt,-2*Math.sqrt(.39),.61)+.5*gaussian(xt,2*Math.sqrt(.39),.61)
    for(const x of [-2,-1,0,1,2])near(r.density(x),qPrevious(x)*gaussian(xt,Math.sqrt(.6)*x,.4)/qCurrent)
  }
  near(reverseAt(0).weights[0],.5)
  assert.ok(reverseAt(2).weights[1]>.99)
  near(reverseAt(-1).weights[0],reverseAt(1).weights[1])
})
test('Both discrete schedules conserve squared scales and decrease log-SNR',()=>{
  for(const kind of schedules) {
    near(scheduleAt(kind,0).alphaBar,1);assert.equal(scheduleAt(kind,0).logSnr,Infinity)
    let previous=Infinity
    for(let t=1;t<=1000;t++) {
      const a=scheduleAt(kind,t)
      near(a.signal**2+a.noise**2,1);near(1/(1+Math.exp(-a.logSnr)),a.alphaBar)
      assert.ok(a.logSnr<previous);previous=a.logSnr
    }
  }
  const f=t=>Math.cos((t/1000+.008)/1.008*Math.PI/2)**2
  near(scheduleAt('cosine',500).alphaBar,f(500)/f(0))
  near(scheduleAt('cosine',1000).alphaBar/scheduleAt('cosine',999).alphaBar,.001)
  assert.ok(scheduleAt('cosine',500).signal>scheduleAt('linear',500).signal)
})
test('Image comparisons share the same Gaussian realization at every noise level',()=>{
  const clean=noisyImage('linear',0)
  for(const t of [1,250,500,1000]) {
    const reconstructed=schedules.map(kind=>{const s=scheduleAt(kind,t);return noisyImage(kind,t).map((v,i)=>(v-s.signal*clean[i])/s.noise)})
    reconstructed[0].forEach((v,i)=>near(v,reconstructed[1][i]))
  }
})
test('Every output parameterization represents the same forward identity and reverse mean',()=>{
  const { xt, alphaBar }=predictionInput
  for(let noise=-2;noise<=2;noise+=.05) {
    const p=predictionFrom('noise',noise)
    near(Math.sqrt(alphaBar)*p.clean+Math.sqrt(1-alphaBar)*p.noise,xt)
    // Independent expression for the Gaussian conditional mean in the lecture.
    near(conditionalMean(xt,p.clean),p.mean)
    for(const output of ['clean','noise','mean']) {
      const roundtrip=predictionFrom(output,p[output])
      for(const key of ['clean','noise','mean'])near(roundtrip[key],p[key])
    }
  }
})
test('All three slider ranges cover the same predictions without clipping',()=>{
  for(const key of ['clean','noise','mean']) {
    const endpoints=predictionBounds[key].map(value=>predictionFrom(key,value).noise).sort((a,b)=>a-b)
    near(endpoints[0],-2);near(endpoints[1],2)
    const [low,high]=predictionBounds[key]
    for(const fraction of [0,.1,.5,.9,1]) {
      const p=predictionFrom(key,low+(high-low)*fraction)
      for(const other of ['clean','noise','mean']) {
        const [a,b]=predictionBounds[other]
        assert.ok(p[other]>=a-1e-12 && p[other]<=b+1e-12)
      }
    }
  }
})
