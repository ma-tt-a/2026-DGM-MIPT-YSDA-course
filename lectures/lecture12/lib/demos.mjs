// Deterministic teaching examples; all matrices use the course's column convention.
export const quantiles = [-1.64, -.84, 0, .84, 1.64]
export const pathMoments = (t, sigma, x0, x1, oneSided = false) => ({
  mean: oneSided ? t * x1 : (1 - t) * x0 + t * x1,
  scale: oneSided ? 1 - t : sigma,
})
export const sources = [-2.2, -1.3, -.4, .5, 1.1, 2]
export const targets = [-1.8, -.9, .2, .8, 1.7, 2.5]
export const paired = [1, 0, 3, 2, 5, 4]
export const initialPairing = [4, 0, 5, 1, 3, 2]
export const pairingCost = permutation => sources.reduce((sum, x, i) => sum + (x - targets[permutation[i]]) ** 2, 0)
// Exact assignment for this small batch, not an approximation to the full-data OT problem.
export function optimalPairing() {
  let best = null, cost = Infinity
  function visit(prefix, remaining) {
    if (!remaining.length) {
      const value = pairingCost(prefix)
      if (value < cost) { best = prefix; cost = value }
      return
    }
    for (const j of remaining) visit([...prefix, j], remaining.filter(k => k !== j))
  }
  visit([], sources.map((_, i) => i))
  return best
}
export const otPairing = optimalPairing()
export function shuffledPairing(seed) {
  let s = seed >>> 0
  const result = sources.map((_, i) => i)
  for (let i = result.length - 1; i > 0; i--) {
    s = (Math.imul(1664525, s) + 1013904223) >>> 0
    const j = Math.floor(s / 4294967296 * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}
export const tokens = ['A', 'B', 'C', '[MASK]']
export const beta = .25
export const retention = t => (1 - beta) ** t
export function transition(mode, alpha = 1 - beta) {
  return tokens.map((_, i) => tokens.map((_, j) => alpha * Number(i === j) + (1 - alpha) * (mode === 'uniform' ? .25 : Number(i === 3))))
}
export const tokenDistribution = (mode, t, start) => transition(mode, retention(t)).map(row => row[start])
export const multiply = (matrix, vector) => matrix.map(row => row.reduce((sum, p, j) => sum + p * vector[j], 0))
export function sampleChain(mode, start, steps = 20) {
  const matrix = transition(mode), states = [start]
  let seed = 3
  for (let t = 0; t < steps; t++) {
    seed = (Math.imul(1664525, seed) + 1013904223) >>> 0
    const u = seed / 4294967296
    let total = 0
    for (let i = 0; i < tokens.length; i++) {
      total += matrix[i][states[t]]
      if (u < total || i === tokens.length - 1) { states.push(i); break }
    }
  }
  return states
}
