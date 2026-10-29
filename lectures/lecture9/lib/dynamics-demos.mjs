export const colors = { ink: '#17324d', muted: '#587083', teal: '#007f82', purple: '#8854c0', orange: '#e17838', grid: '#dce5eb' }
export function normalGenerator(seed = 90421) {
  let state = seed >>> 0
  const uniform = () => { state = (Math.imul(1664525, state) + 1013904223) >>> 0; return (state + .5) / 4294967296 }
  return () => Math.sqrt(-2 * Math.log(uniform())) * Math.cos(2 * Math.PI * uniform())
}
export const gaussian = (x, variance = 1) => Math.exp(-x * x / (2 * variance)) / Math.sqrt(2 * Math.PI * variance)
export const path = (points, px, py) => points.map((p, i) => `${i ? 'L' : 'M'}${px(p[0]).toFixed(3)},${py(p[1]).toFixed(3)}`).join(' ')
export const rotation = ([x, y], t) => [x * Math.cos(t) - y * Math.sin(t), x * Math.sin(t) + y * Math.cos(t)]
export function solveRotation(steps = 8, count = steps) {
  const h = 3 / steps, euler = [[-1, 0]], heun = [[-1, 0]], predictors = []
  for (let i = 0; i < count; i++) {
    const [x, y] = euler.at(-1); euler.push([x + h * y, y - h * x])
    const [u, v] = heun.at(-1), predictor = [u + h * v, v - h * u]
    predictors.push(predictor); heun.push([u + h * (v + predictor[1]) / 2, v - h * (u + predictor[0]) / 2])
  }
  const exact = rotation([-1, 0], -h * count), error = point => Math.hypot(point[0] - exact[0], point[1] - exact[1])
  return { h, euler, heun, predictors, exact, eulerError: error(euler.at(-1)), heunError: error(heun.at(-1)), eulerNfe: count, heunNfe: 2 * count }
}
export const patchModes = ['Expansion', 'Contraction', 'Shear']
export function patchPoint([x, y], t, mode) { return mode === 'Shear' ? [x + .8 * t * y, y] : [x * Math.exp((mode === 'Expansion' ? .45 : -.45) * t), y * Math.exp((mode === 'Expansion' ? .45 : -.45) * t)] }
export function patchVelocity([x, y], mode) { return mode === 'Shear' ? [.8 * y, 0] : [x * (mode === 'Expansion' ? .45 : -.45), y * (mode === 'Expansion' ? .45 : -.45)] }
export function patchStats(t, mode) { const divergence = mode === 'Shear' ? 0 : mode === 'Expansion' ? .9 : -.9; return { divergence, area: Math.exp(divergence * t), density: Math.exp(-divergence * t) } }
export const langevinModes = ['Drift only', 'Diffusion only', 'Both']
export const langevinConfig = { dt: .025, maxSteps: 120, count: 768 }
export function stationaryVariance(mode, t) { return mode === 'Drift only' ? Math.exp(-t) : mode === 'Diffusion only' ? 1 + t : 1 }
// Exact transitions isolate stationarity from Euler-Maruyama discretization bias.
export function stationaryFrames(mode) {
  const random = normalGenerator(93037), { dt, maxSteps, count } = langevinConfig
  let points = Array.from({ length: count }, () => random())
  const frames = [points]
  const decay = Math.exp(-dt / 2), noise = Math.sqrt(1 - Math.exp(-dt))
  for (let step = 0; step < maxSteps; step++) {
    points = points.map(x => { const z = random(); return mode === 'Drift only' ? decay * x : mode === 'Diffusion only' ? x + Math.sqrt(dt) * z : decay * x + noise * z })
    frames.push(points)
  }
  return frames
}
export const stationaryCache = Object.fromEntries(langevinModes.map(mode => [mode, stationaryFrames(mode)]))
export function histogram(points, bins = 40, bound = 6) {
  const width = 2 * bound / bins, counts = Array(bins).fill(0)
  for (const x of points) { const i = Math.floor((x + bound) / width); if (i >= 0 && i < bins) counts[i]++ }
  return counts.map((count, i) => ({ x: -bound + i * width, width, density: count / (points.length * width) }))
}
