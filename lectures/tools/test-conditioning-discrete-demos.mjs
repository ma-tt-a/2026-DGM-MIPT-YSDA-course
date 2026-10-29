import test from 'node:test'
import assert from 'node:assert/strict'
import { pathMoments, sources, targets, initialPairing, paired, otPairing, shuffledPairing, pairingCost, transition, tokenDistribution, multiply, sampleChain, retention } from '../lecture12/lib/demos.mjs'
const near = (a,b) => assert.ok(Math.abs(a-b)<1e-12, `${a} != ${b}`)
test('Smoothing stays constant, vanishes only in the limit; one-sided cloud contracts', () => {
  for (const t of [0,.2,.5,.9,1]) {
    const pair=pathMoments(t,.35,-1.5,1.5)
    near(pair.mean,-1.5+3*t);near(pair.scale,.35)
    near(pathMoments(t,0,-1.5,1.5).scale,0)
    const one=pathMoments(t,.35,-1.5,1.5,true)
    near(one.mean,1.5*t);near(one.scale,1-t)
  }
})
test('Pairings preserve both empirical marginals and exact scalar OT has sorted matches', () => {
  for(const perm of [initialPairing,paired,otPairing,...Array.from({length:20},(_,i)=>shuffledPairing(938+i))]) {
    assert.deepEqual([...perm].sort(),sources.map((_,i)=>i))
    assert.deepEqual(perm.map(j=>targets[j]).sort((a,b)=>a-b),targets)
    assert.ok(pairingCost(otPairing)<=pairingCost(perm)+1e-12)
  }
  assert.deepEqual(otPairing,[0,1,2,3,4,5])
  assert.deepEqual(shuffledPairing(938),shuffledPairing(938))
})
test('Closed-form cumulative kernels equal repeated matrix application', () => {
  for(const mode of ['uniform','absorbing']) for(let start=0;start<4;start++) {
    let v=Array.from({length:4},(_,i)=>Number(i===start))
    for(let t=0;t<=20;t++) {
      const exact=tokenDistribution(mode,t,start)
      exact.forEach((p,i)=>near(p,v[i]));near(exact.reduce((a,b)=>a+b,0),1)
      v=multiply(transition(mode),v)
    }
  }
})
test('Uniform retains additional same-token mass; absorbing mask cannot be left', () => {
  near(tokenDistribution('uniform',4,0)[0],retention(4)+(1-retention(4))/4)
  for(let t=0;t<=20;t++) assert.deepEqual(tokenDistribution('absorbing',t,3),[0,0,0,1])
  for(let start=0;start<3;start++) {
    const chain=sampleChain('absorbing',start)
    const masked=chain.indexOf(3)
    assert.ok(masked>0);assert.ok(chain.slice(masked).every(x=>x===3))
    assert.deepEqual(chain,sampleChain('absorbing',start))
  }
  for(const row of transition('uniform',0)) row.forEach(p=>near(p,.25))
  assert.deepEqual(transition('absorbing',0),[[0,0,0,0],[0,0,0,0],[0,0,0,0],[1,1,1,1]])
})
