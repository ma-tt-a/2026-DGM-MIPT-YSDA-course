// Exact parallel-support example; the distributions are singular, not narrow Gaussians.
export function supportDistances(theta) {
  return { wasserstein: Math.abs(theta), jsd: theta === 0 ? 0 : Math.log(2), kl: theta === 0 ? 0 : Infinity }
}

export const langevinConfig = { mean: 1.5, sigma: .7, eta: .04, particles: 192, maxSteps: 600, printSteps: 300, seed: 52147 }
// Two isotropic Gaussians, with an exact, stable score evaluated in data space.
export function logLangevinDensity(x, y = 0) {
  const { mean: a, sigma } = langevinConfig, variance = sigma ** 2
  const left = -((x + a) ** 2 + y * y) / (2 * variance)
  const right = -((x - a) ** 2 + y * y) / (2 * variance), top = Math.max(left, right)
  return top + Math.log(Math.exp(left - top) + Math.exp(right - top)) - Math.log(4 * Math.PI * variance)
}
export const langevinDensity = (x, y) => Math.exp(logLangevinDensity(x, y))
export function langevinMarginal(x) {
  const { mean: a, sigma } = langevinConfig
  return (Math.exp(-.5 * ((x - a) / sigma) ** 2) + Math.exp(-.5 * ((x + a) / sigma) ** 2)) / (2 * sigma * Math.sqrt(2 * Math.PI))
}
export function langevinScore({ x, y }) {
  const { mean: a, sigma } = langevinConfig, variance = sigma ** 2
  return { x: (a * Math.tanh(a * x / variance) - x) / variance, y: -y / variance }
}
// The RNG state is serializable and belongs to the simulation, not the renderer.
function uniform(state) {
  state.rng = (Math.imul(1664525, state.rng) + 1013904223) >>> 0
  return (state.rng + .5) / 4294967296
}
function normalPair(state) {
  const radius = Math.sqrt(-2 * Math.log(uniform(state))), angle = 2 * Math.PI * uniform(state)
  return { x: radius * Math.cos(angle), y: radius * Math.sin(angle) }
}
export function initialLangevin() {
  const state = { rng: langevinConfig.seed, step: 0, points: [], trails: [] }
  for (let i = 0; i < langevinConfig.particles / 2; i++) {
    const x = 6 * uniform(state) - 3, y = 4 * uniform(state) - 2
    state.points.push({ x, y }, { x: -x, y: -y })
  }
  state.trails = state.points.slice(0, 4).map(p => [{ ...p }])
  return state
}
export function advanceLangevin(state, noise = true, steps = 1) {
  const { eta, maxSteps } = langevinConfig
  for (let step = 0; step < steps && state.step < maxSteps; step++) {
    state.points = state.points.map(p => {
      const score = langevinScore(p), epsilon = normalPair(state)
      return { x: p.x + eta / 2 * score.x + (noise ? Math.sqrt(eta) * epsilon.x : 0), y: p.y + eta / 2 * score.y + (noise ? Math.sqrt(eta) * epsilon.y : 0) }
    })
    state.trails = state.trails.map((trail, i) => [...trail.slice(-29), { ...state.points[i] }])
    state.step++
  }
  return state
}
export function langevinSnapshot(noise, steps = langevinConfig.printSteps) {
  return advanceLangevin(initialLangevin(), noise, steps)
}
export function xHistogram(points) {
  const low = -4.5, high = 4.5, count = 24, width = (high - low) / count
  const bins = Array.from({ length: count }, (_, i) => ({ x: low + i * width, width, count: 0, density: 0 }))
  let outside = 0
  for (const p of points) {
    const i = Math.floor((p.x - low) / width)
    if (i < 0 || i >= count) outside++
    else bins[i].count++
  }
  for (const bin of bins) bin.density = bin.count / (points.length * width)
  return { bins, outside }
}
