// One coordinate of a prediction, with the noisy input and timestep held fixed.
// There is no sampled clean target or true noise in this parameterization demo.
export const predictionInput = { xt: 1, alpha: .6, alphaBar: .39 }
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
