// One-dimensional example: independent X0 ~ N(0,1),
// X1 ~ .5 N(-1.8,.4²) + .5 N(1.8,.4²). Time runs noise -> data.
export const targetMean = 1.8
export const targetStd = .4
export const pathVariance = t => (1-t)**2+(targetStd*t)**2
export const normalCDF = x => {
  const z=Math.abs(x),k=1/(1+.2316419*z)
  const tail=Math.exp(-z*z/2)/Math.sqrt(2*Math.PI)*k*(.319381530+k*(-.356563782+k*(1.781477937+k*(-1.821255978+k*1.330274429))))
  return x>=0?1-tail:tail
}
export const pathCDF = (x,t) => {
  const s=Math.sqrt(pathVariance(t)),m=targetMean*t
  return .5*(normalCDF((x-m)/s)+normalCDF((x+m)/s))
}
export function quantile(p,t) {
  let lo=-9,hi=9
  for(let i=0;i<60;i++){const mid=(lo+hi)/2;if(pathCDF(mid,t)<p)lo=mid;else hi=mid}
  return (lo+hi)/2
}
// Exact population conditional mean E[X1-X0 | Xt=x].
export const marginalVelocity = (x,t) => {
  const variance=pathVariance(t),a=(-(1-t)+targetStd**2*t)/variance
  const posteriorMean=targetMean*Math.tanh(targetMean*t*x/variance)
  return a*x+(1-a*t)*posteriorMean
}
const count=20
export const initialPoints=Array.from({length:count},(_,i)=>quantile((i+.5)/count,0))
const endpoints=Array.from({length:count},(_,i)=>quantile((i+.5)/count,1))
// Fixed shuffled stratified samples illustrate the independent training pairing.
const permutation=Array.from({length:count},(_,i)=>i)
let seed=27
for(let i=count-1;i>0;i--){seed=(Math.imul(1664525,seed)+1013904223)>>>0;const j=Math.floor(seed/2**32*(i+1));[permutation[i],permutation[j]]=[permutation[j],permutation[i]]}
export const trainingPairs=initialPoints.map((x0,i)=>({x0,x1:endpoints[permutation[i]]}))
export const defaultPair=trainingPairs.findIndex(p=>p.x0<-.5&&p.x1>1)
export const conditionalPosition=(i,t)=>(1-t)*trainingPairs[i].x0+t*trainingPairs[i].x1
export const integrationSteps=320
export const odePaths=initialPoints.map(x0=>{
  const path=[x0],h=1/integrationSteps
  for(let i=0;i<integrationSteps;i++){
    const t=i*h,x=path[i],k1=marginalVelocity(x,t),k2=marginalVelocity(x+h*k1/2,t+h/2),k3=marginalVelocity(x+h*k2/2,t+h/2),k4=marginalVelocity(x+h*k3,t+h)
    path.push(x+h*(k1+2*k2+2*k3+k4)/6)
  }
  return path
})
export function odePosition(i,t) {
  const step=Math.max(0,Math.min(integrationSteps,t*integrationSteps)),j=Math.min(integrationSteps-1,Math.floor(step)),f=step-j
  return odePaths[i][j]*(1-f)+odePaths[i][j+1]*f
}
