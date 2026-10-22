export const gaussian = (x, mean, variance) => Math.exp(-((x - mean) ** 2) / (2 * variance)) / Math.sqrt(2 * Math.PI * variance)

// A finite clean-data distribution makes both reverse kernels exactly computable.
export const cleanValues = [-2, 2]
export const bridge = { alpha: .6, alphaBarPrevious: .65 }
bridge.alphaBar = bridge.alpha * bridge.alphaBarPrevious
bridge.variance = (1 - bridge.alpha) * (1 - bridge.alphaBarPrevious) / (1 - bridge.alphaBar)
export function conditionalMean(xt, x0) {
  return Math.sqrt(bridge.alpha) * (1 - bridge.alphaBarPrevious) / (1 - bridge.alphaBar) * xt
    + Math.sqrt(bridge.alphaBarPrevious) * (1 - bridge.alpha) / (1 - bridge.alphaBar) * x0
}
export function reverseAt(xt) {
  const likelihoods = cleanValues.map(x0 => gaussian(xt, Math.sqrt(bridge.alphaBar) * x0, 1 - bridge.alphaBar))
  const sum = likelihoods.reduce((a, b) => a + b, 0)
  const weights = likelihoods.map(v => v / sum)
  const means = cleanValues.map(x0 => conditionalMean(xt, x0))
  return { weights, means, density: x => weights.reduce((v, w, i) => v + w * gaussian(x, means[i], bridge.variance), 0) }
}

export const totalSteps = 1000
export const schedules = ['linear', 'cosine']
const alphaBars = Object.fromEntries(schedules.map(kind => {
  const values = [1]
  const f = t => Math.cos((t / totalSteps + .008) / 1.008 * Math.PI / 2) ** 2
  for (let t = 1; t <= totalSteps; t++) {
    const beta = kind === 'linear' ? .0001 + (t - 1) / (totalSteps - 1) * (.02 - .0001) : Math.min(.999, 1 - f(t) / f(t - 1))
    values.push(values[t - 1] * (1 - beta))
  }
  return [kind, values]
}))
export function scheduleAt(kind, t) {
  const alphaBar = alphaBars[kind][t]
  return { alphaBar, signal: Math.sqrt(alphaBar), noise: Math.sqrt(1 - alphaBar), logSnr: Math.log(alphaBar / (1 - alphaBar)) }
}

// A code-drawn digit, with one seeded Gaussian noise field shared by both schedules.
function distanceToSegment(x, y, ax, ay, bx, by) {
  const u = Math.max(0, Math.min(1, ((x-ax)*(bx-ax)+(y-ay)*(by-ay))/((bx-ax)**2+(by-ay)**2)))
  return Math.hypot(x-ax-u*(bx-ax), y-ay-u*(by-ay))
}
let seed = 1707
const uniform = () => { seed = (Math.imul(1664525, seed) + 1013904223) >>> 0; return (seed + .5) / 4294967296 }
export const cleanImage = [], imageNoise = []
for (let y = 0; y < 32; y++) for (let x = 0; x < 32; x++) {
  const d = Math.min(distanceToSegment(x,y,7,7,25,7), distanceToSegment(x,y,24,7,12,26))
  cleanImage.push(1 - 2 * Math.max(0, Math.min(1, (d - 1.7) / 1.2)))
  imageNoise.push(Math.sqrt(-2 * Math.log(uniform())) * Math.cos(2 * Math.PI * uniform()))
}
export function noisyImage(kind, t) {
  const { signal, noise } = scheduleAt(kind, t)
  return cleanImage.map((v, i) => signal * v + noise * imageNoise[i])
}

// One coordinate of a prediction, with the noisy input and timestep held fixed.
// There is no sampled clean target or true noise in this parameterization demo.
export const predictionInput = { xt: 1, alpha: bridge.alpha, alphaBar: bridge.alphaBar }
export function predictionFrom(output, value) {
  const { xt, alpha, alphaBar } = predictionInput
  const signal = Math.sqrt(alphaBar), noiseScale = Math.sqrt(1 - alphaBar)
  const factor = (1 - alpha) / Math.sqrt(alpha * (1 - alphaBar))
  let noise
  if (output === 'noise') noise = value
  else if (output === 'clean') noise = (xt - signal * value) / noiseScale
  else if (output === 'mean') noise = (xt / Math.sqrt(alpha) - value) / factor
  else throw new Error('Unknown prediction parameterization: ' + output)
  return {
    noise,
    clean: (xt - noiseScale * noise) / signal,
    mean: xt / Math.sqrt(alpha) - factor * noise,
  }
}
// Each slider spans exactly the same family of predictions; no independent clipping.
export const predictionBounds = Object.fromEntries(['clean', 'noise', 'mean'].map(key => {
  const values = [-2, 2].map(noise => predictionFrom('noise', noise)[key])
  return [key, [Math.min(...values), Math.max(...values)]]
}))
