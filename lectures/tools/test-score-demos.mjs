import { test } from 'node:test'
import assert from 'node:assert/strict'
import { cleanPoints, posteriorAt, diffusionAt, diffusionDensity, normalDensity, diffusionBeta, diffusionData } from '../lecture6/lib/score-demos.mjs'

const close = (a, b, tolerance = 1e-10) => assert.ok(Math.abs(a-b) < tolerance, `${a} != ${b}`)
test('Posterior probabilities follow Bayes, and conditional-score regression yields the marginal score', () => {
  for (const sigma of [.4, 1, 2]) for (const point of [{ x: 0, y: 0 }, { x: -1.3, y: .8 }, { x: 2.4, y: -1.5 }]) {
    const result = posteriorAt(point, sigma)
    close(result.weights.reduce((a,b)=>a+b,0), 1)
    const likelihoods = cleanPoints.map(p => normalDensity(point.x,p.x,sigma**2)*normalDensity(point.y,p.y,sigma**2))
    for(let i=0;i<3;i++)close(result.weights[i],likelihoods[i]/likelihoods.reduce((a,b)=>a+b,0))
    for (const axis of ['x','y']) {
      const h = 1e-5
      const derivative = (posteriorAt({...point,[axis]:point[axis]+h},sigma).logDensity-posteriorAt({...point,[axis]:point[axis]-h},sigma).logDensity)/(2*h)
      close(result.score[axis],derivative,1e-8)
      close(result.mean[axis],point[axis]+sigma**2*result.score[axis])
    }
  }
})
test('Tweedie gives the posterior mean and minimizes posterior squared error, not a clean atom', () => {
  const { mean, weights } = posteriorAt({x:0,y:.15})
  const risk = p => cleanPoints.reduce((s,x,i)=>s+weights[i]*((p.x-x.x)**2+(p.y-x.y)**2),0)
  for(const p of [...cleanPoints, {x:mean.x+.4,y:mean.y-.2}]) {
    close(risk(p)-risk(mean),(p.x-mean.x)**2+(p.y-mean.y)**2)
    assert.ok(risk(p)>risk(mean))
  }
})
test('Posterior computation stays finite in the tails', () => {
  const p=posteriorAt({x:100,y:-100},.1)
  close(p.weights.reduce((a,b)=>a+b,0),1)
  assert.ok(Number.isFinite(p.logDensity) && Number.isFinite(p.score.x))
})
test('Closed-form diffusion matches repeated Gaussian transition moments', () => {
  let means=[...diffusionData.means], variance=diffusionData.sigma**2
  for(let t=0;t<=1000;t++) {
    const p=diffusionAt(t)
    means.forEach((m,i)=>close(p.means[i],m))
    close(p.variance,variance);close(p.signal**2+p.noise**2,1)
    means=means.map(m=>Math.sqrt(1-diffusionBeta)*m)
    variance=(1-diffusionBeta)*variance+diffusionBeta
  }
})
test('Diffusion densities normalize and approach a standard Gaussian', () => {
  const dx=.005
  for(const t of [0,75,250,1000]) {
    let mass=0,mean=0,second=0
    for(let x=-9;x<=9;x+=dx) {const p=diffusionDensity(x,t);mass+=p*dx;mean+=x*p*dx;second+=x*x*p*dx}
    close(mass,1,1e-9);close(mean,0,1e-9)
    close(second,diffusionAt(t).variance+diffusionAt(t).means[0]**2,1e-9)
  }
  assert.ok(diffusionAt(1000).signal<.007)
  for(let x=-4;x<=4;x+=.1)close(diffusionDensity(x,1000),normalDensity(x),3e-5)
})
