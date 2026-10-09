import test from 'node:test'
import assert from 'node:assert/strict'
import { solveRotation, patchPoint, patchStats, patchModes, stationaryCache, stationaryVariance, langevinModes, langevinConfig, histogram, gaussian } from '../lecture9/lib/dynamics-demos.mjs'
const near = (a,b,tolerance=1e-10) => assert.ok(Math.abs(a-b)<tolerance, `${a} != ${b}`)
test('Euler and Heun converge at first and second order for rotation; cost is explicit',()=>{
  const a=solveRotation(64),b=solveRotation(128)
  assert.ok(a.eulerError/b.eulerError>1.9&&a.eulerError/b.eulerError<2.1)
  assert.ok(a.heunError/b.heunError>3.9&&a.heunError/b.heunError<4.1)
  for(const n of [4,8,16,32]) {const s=solveRotation(n);assert.ok(s.heunError<s.eulerError);assert.equal(s.eulerNfe,n);assert.equal(s.heunNfe,2*n)}
})
test('the exact rotation and numerical trajectories move from left to right',()=>{
  for(const n of [4,8,16,32]) {
    const s=solveRotation(n)
    assert.deepEqual(s.euler[0],[-1,0]);assert.deepEqual(s.heun[0],[-1,0])
    for(const points of [s.euler,s.heun]) for(let i=1;i<points.length;i++) assert.ok(points[i][0]>=points[i-1][0]-1e-12)
    near(s.exact[0],-Math.cos(3));near(s.exact[1],Math.sin(3))
  }
})
test('material patch area from its corners matches the divergence integral and preserves mass',()=>{
  for(const mode of patchModes) for(const t of [0,.2,1,1.5]) {
    const corners=[[-.5,-.5],[.5,-.5],[.5,.5],[-.5,.5]].map(p=>patchPoint(p,t,mode))
    const area=Math.abs(corners.reduce((sum,p,i)=>{const q=corners[(i+1)%4];return sum+p[0]*q[1]-q[0]*p[1]},0))/2
    const stats=patchStats(t,mode);near(area,stats.area);near(area*stats.density,1)
  }
})
test('stationary examples share initial samples; exact transitions track theoretical variances',()=>{
  const moments=xs=>{const mean=xs.reduce((a,b)=>a+b)/xs.length;return{mean,variance:xs.reduce((a,b)=>a+(b-mean)**2,0)/xs.length}}
  const initial=stationaryCache.Both[0]
  for(const mode of langevinModes) {
    assert.deepEqual(stationaryCache[mode][0],initial)
    for(const step of [0,40,80,120]) {
      const {mean,variance}=moments(stationaryCache[mode][step]),expected=stationaryVariance(mode,step*langevinConfig.dt)
      assert.ok(Math.abs(variance/expected-1)<.13,`${mode}/${step}: variance ${variance}, expected ${expected}`)
      assert.ok(Math.abs(mean)/Math.sqrt(expected)<.1)
    }
  }
  assert.notEqual(stationaryCache.Both[0][0],stationaryCache.Both[120][0])
})
test('histogram counts outside the visible window are not renormalized; stationary KFP terms cancel',()=>{
  const bins=histogram([-7,0,1,7]);near(bins.reduce((sum,b)=>sum+b.density*b.width,0),.5)
  for(const x of [-2,-1,0,1,2]) {
    const p=gaussian(x),drift=.5*(1-x*x)*p,diffusion=.5*(x*x-1)*p;near(drift+diffusion,0)
  }
})
