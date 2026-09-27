import assert from 'node:assert/strict'
import { test } from 'node:test'
import { supportDistances, knnRadii, membership, realPoints, generatedPoints, precisionRecall, initialLangevin, advanceLangevin, langevinSnapshot, langevinScore, langevinMarginal, logLangevinDensity, langevinConfig, xHistogram } from '../lecture5/lib/geometry-demos.mjs'

test('parallel singular supports: exact match is the only finite-KL case', () => {
  assert.deepEqual(supportDistances(0), { wasserstein: 0, jsd: 0, kl: 0 })
  for (const theta of [-2, -.4, -1e-12, 1e-12, .4, 2]) {
    const distances = supportDistances(theta)
    assert.equal(distances.wasserstein, Math.abs(theta))
    assert.equal(distances.jsd, Math.log(2))
    assert.equal(distances.kl, Infinity)
  }
})

test('k-NN balls exclude self and include their boundary', () => {
  const points = [0, 1, 4, 8].map(x => ({ x, y: 0 }))
  assert.deepEqual(knnRadii(points, 1), [1, 1, 3, 4])
  assert.deepEqual(membership([{ x: -1, y: 0 }, { x: -1.001, y: 0 }], points, 1), [true, false])
  assert.throws(() => knnRadii(points, 4), RangeError)
})

test('the three empirical precision/recall examples separate coverage and outliers', () => {
  for (const [preset, expected] of [['matched', [1, 1]], ['missing', [1, .5]], ['outliers', [.5, 1]]]) {
    const generated = generatedPoints(preset), scores = precisionRecall(realPoints, generated)
    assert.deepEqual([scores.precision, scores.recall], expected)
    assert.equal(scores.precisionCount / generated.length, scores.precision)
    assert.equal(scores.recallCount / realPoints.length, scores.recall)
    const reversed = precisionRecall(generated, realPoints)
    assert.equal(reversed.precision, scores.recall)
    assert.equal(reversed.recall, scores.precision)
  }
})

test('empirical PR is translation invariant; shifting only the generator changes membership', () => {
  const move = points => points.map(p => ({ x: p.x + 2.3, y: p.y - 1.7 }))
  const generated = generatedPoints('missing')
  assert.deepEqual(precisionRecall(move(realPoints), move(generated)), precisionRecall(realPoints, generated))
  assert.ok(precisionRecall(realPoints, generatedPoints('matched', .9)).precision < 1)
  assert.deepEqual(generatedPoints('matched'), generatedPoints('matched'))
})

test('the exact mixture score agrees with the gradient of log density, including tails', () => {
  const h = 1e-5
  for (const x of [-12, -2, -.2, 0, .7, 2, 12]) for (const y of [-1.5, 0, 1]) {
    const score = langevinScore({ x, y })
    const dx = (logLangevinDensity(x + h, y) - logLangevinDensity(x - h, y)) / (2 * h)
    const dy = (logLangevinDensity(x, y + h) - logLangevinDensity(x, y - h)) / (2 * h)
    assert.ok(Math.abs(score.x - dx) < 1e-7)
    assert.ok(Math.abs(score.y - dy) < 1e-7)
  }
  let mass = 0, moment = 0
  for (let i = 0; i < 3200; i++) {
    const x = -8 + (i + .5) * .005, density = langevinMarginal(x)
    mass += density * .005; moment += x * x * density * .005
  }
  assert.ok(Math.abs(mass - 1) < 1e-8)
  assert.ok(Math.abs(moment - (langevinConfig.mean ** 2 + langevinConfig.sigma ** 2)) < 1e-8)
})

test('seeded Langevin is reproducible, independent of batching, and does not mutate initial snapshots', () => {
  const a = initialLangevin(), b = initialLangevin(), baseline = structuredClone(a)
  advanceLangevin(a, true, 60)
  for (let i = 0; i < 15; i++) advanceLangevin(b, true, 4)
  assert.deepEqual(a, b)
  assert.deepEqual(initialLangevin(), baseline)
  assert.equal(a.step, 60)
  assert.ok(a.points.every(p => Number.isFinite(p.x) && Number.isFinite(p.y)))
})

test('noiseless score ascent collapses within-mode spread, unlike noisy sampling', () => {
  const off = langevinSnapshot(false), on = langevinSnapshot(true)
  const yVariance = points => points.reduce((sum, p) => sum + p.y * p.y, 0) / points.length
  assert.ok(yVariance(off.points) < 1e-10)
  assert.ok(off.points.every(p => Math.hypot(...Object.values(langevinScore(p))) < 1e-5))
  assert.ok(Math.abs(yVariance(on.points) - .49) < .15)
  assert.ok(on.points.some(p => Math.abs(p.x) > 2.5))
})

test('long-run mixture moments approximate the target; the update has eta/2 drift and sqrt(eta) noise', () => {
  const simulation = initialLangevin()
  advanceLangevin(simulation, true, 600)
  let count = 0, x = 0, y = 0, xx = 0, yy = 0
  for (let i = 0; i < 120; i++) {
    advanceLangevin(simulation, true, 5)
    for (const p of simulation.points) { count++; x += p.x; y += p.y; xx += p.x * p.x; yy += p.y * p.y }
  }
  assert.ok(Math.abs(x / count) < .18)
  assert.ok(Math.abs(y / count) < .08)
  assert.ok(Math.abs(xx / count - 2.74) < .2)
  assert.ok(Math.abs(yy / count - .49) < .06)
  advanceLangevin(simulation, true, 10)
  assert.equal(simulation.step, langevinConfig.maxSteps)
})

test('histogram density accounts for all particles without clipping or renormalizing tails', () => {
  const points = [{ x: -10 }, { x: -1.5 }, { x: 0 }, { x: 1.5 }, { x: 12 }]
  const { bins, outside } = xHistogram(points)
  assert.equal(outside, 2)
  assert.equal(bins.reduce((sum, bin) => sum + bin.count, 0) + outside, points.length)
  assert.ok(Math.abs(bins.reduce((sum, bin) => sum + bin.width * bin.density, 0) - .6) < 1e-12)
})
