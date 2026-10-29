// Two equally likely, translating isotropic Gaussians, shown at t = 0.5.
// Their shape stays fixed, so each conditional velocity is constant in space.
export const cloudCenters = [[-1,0],[1,0]]
export const cloudSigma = .9
export const conditionalVelocities = [[.8,.75],[-.8,.75]]
export const cloudDensity = (point,i,t=.5) => {
  const squaredDistance = point.reduce((sum,x,k) => sum+(x-cloudCenters[i][k]-(t-.5)*conditionalVelocities[i][k])**2,0)
  return Math.exp(-squaredDistance/(2*cloudSigma**2))/(2*Math.PI*cloudSigma**2)
}
export const posteriorWeight = point => {
  const densities = cloudCenters.map((_,i) => cloudDensity(point,i))
  return densities[0]/(densities[0]+densities[1])
}
export const averageVelocity = weight => conditionalVelocities[0].map((v,i) => weight*v+(1-weight)*conditionalVelocities[1][i])
export const endpoint = 2
export const coneEndpoints = [-2,0,2]
// Fixed Gaussian quantiles: deterministic representative particles, not fresh noise.
export const particles = [-1.96,-1.44,-1.04,-.67,-.32,0,.32,.67,1.04,1.44,1.96]
export const interpolate = (x0,t,target=endpoint) => (1-t)*x0+t*target
export const density = (x,t,target=endpoint) => {
  if (!(t >= 0 && t < 1)) throw new RangeError('Gaussian density requires 0 <= t < 1; t = 1 is a point mass')
  return Math.exp(-.5*((x-t*target)/(1-t))**2)/((1-t)*Math.sqrt(2*Math.PI))
}
