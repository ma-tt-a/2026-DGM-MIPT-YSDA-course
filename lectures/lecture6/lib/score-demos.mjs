// Analytic toy distributions; no fitted network or simulated training.
export const cleanPoints = [{ x: -1.6, y: -.75 }, { x: -1.25, y: .9 }, { x: 1.6, y: .15 }]
export const observationPresets = [
  { label: 'Between modes', x: 0, y: .15 },
  { label: 'Near left', x: -1.4, y: .2 },
  { label: 'Near right', x: 1.4, y: .15 },
]
export const observationBounds = { xmin: -2.4, xmax: 2.4, ymin: -1.5, ymax: 1.5 }

export function posteriorAt(point, sigma = 1) {
  if (!(sigma > 0)) throw new RangeError('Noise standard deviation must be positive')
  const variance = sigma ** 2
  const logits = cleanPoints.map(p => -((point.x - p.x) ** 2 + (point.y - p.y) ** 2) / (2 * variance))
  const maximum = Math.max(...logits)
  const unnormalized = logits.map(l => Math.exp(l - maximum))
  const total = unnormalized.reduce((a, b) => a + b, 0)
  const weights = unnormalized.map(w => w / total)
  const conditionalScores = cleanPoints.map(p => ({ x: (p.x - point.x) / variance, y: (p.y - point.y) / variance }))
  const average = vectors => vectors.reduce((a, v, i) => ({ x: a.x + weights[i] * v.x, y: a.y + weights[i] * v.y }), { x: 0, y: 0 })
  return { weights, conditionalScores, mean: average(cleanPoints), score: average(conditionalScores),
    logDensity: maximum + Math.log(total / cleanPoints.length) - Math.log(2 * Math.PI * variance) }
}

export const diffusionBeta = .01
export const diffusionData = { means: [-2, 2], sigma: .35 }
export const diffusionTimes = [0, 75, 250, 1000]
export function diffusionAt(t) {
  if (!Number.isInteger(t) || t < 0 || t > 1000) throw new RangeError('Expected an integer timestep from 0 to 1000')
  const alphaBar = (1 - diffusionBeta) ** t
  return { t, alphaBar, signal: Math.sqrt(alphaBar), noise: Math.sqrt(1 - alphaBar),
    means: diffusionData.means.map(m => Math.sqrt(alphaBar) * m),
    variance: alphaBar * diffusionData.sigma ** 2 + 1 - alphaBar }
}
export function normalDensity(x, mean = 0, variance = 1) {
  return Math.exp(-((x - mean) ** 2) / (2 * variance)) / Math.sqrt(2 * Math.PI * variance)
}
export function diffusionDensity(x, t) {
  const { means, variance } = diffusionAt(t)
  return means.reduce((sum, m) => sum + normalDensity(x, m, variance), 0) / means.length
}
export function densityPath(density, width = 480, height = 190) {
  return Array.from({ length: 401 }, (_, i) => {
    const x = -4.5 + 9 * i / 400
    return `${i ? 'L' : 'M'}${(width * i / 400).toFixed(3)},${(height * (1 - density(x) / .65)).toFixed(3)}`
  }).join(' ')
}
