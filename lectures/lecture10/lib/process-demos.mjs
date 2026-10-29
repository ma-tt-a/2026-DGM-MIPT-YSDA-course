// Analytic Gaussian-mixture examples; no learned network or external data.
export const T = 2, steps = 60, count = 384
export const means = [-1.8, 1.8], cleanVariance = .25
export function rng(seed=42) { let s=seed>>>0; return ()=>{s=(1664525*s+1013904223)>>>0;return (s+.5)/4294967296} }
export function normal(random) {return Math.sqrt(-2*Math.log(random()))*Math.cos(2*Math.PI*random())}
export function gaussian(x,m,v){return Math.exp(-((x-m)**2)/(2*v))/Math.sqrt(2*Math.PI*v)}
export function density(x,t){return means.reduce((s,m)=>s+.5*gaussian(x,m,cleanVariance+2*t),0)}
export function score(x,t){const v=cleanVariance+2*t, a=means.map(m=>gaussian(x,m,v));return a.reduce((s,w,i)=>s+w*(means[i]-x)/v,0)/(a[0]+a[1])}
function erf(x){const sign=x<0?-1:1,z=Math.abs(x),t=1/(1+.3275911*z);return sign*(1-(((((1.061405429*t-1.453152027)*t)+1.421413741)*t-.284496736)*t+.254829592)*t*Math.exp(-z*z))}
export function cdf(x,t){return means.reduce((s,m)=>s+.25*(1+erf((x-m)/Math.sqrt(2*(cleanVariance+2*t)))),0)}
export function quantile(u,t){let a=-16,b=16;for(let k=0;k<42;k++){const m=(a+b)/2;if(cdf(m,t)<u)a=m;else b=m}return(a+b)/2}
const qs=Array.from({length:count},(_,i)=>(i+.5)/count)
// Permute stratified quantiles so the highlighted particles span both modes.
const us=qs.map((_,i)=>qs[(i*149)%count])
const pf=Array.from({length:steps+1},(_,j)=>us.map(u=>quantile(u,T*j/steps)))
export function reverseTransition(x,t,h,random){const v=cleanVariance+2*t,w=v-2*h,a=gaussian(x,means[0],v),b=gaussian(x,means[1],v),m=random()<a/(a+b)?means[0]:means[1];return m+w/v*(x-m)+Math.sqrt(w*(1-w/v))*normal(random)}
const caches=new Map()
export function simulation(reverse=false,seed=42){const key=`${reverse}-${seed}`;if(caches.has(key))return caches.get(key);const random=rng(seed),start=pf[reverse?steps:0].slice(),sde=[start],h=T/steps;
for(let j=1;j<=steps;j++){const t=T-(j-1)*h;sde.push(sde[j-1].map(x=>reverse?reverseTransition(x,t,h,random):x+Math.sqrt(2*h)*normal(random)))}
const result={sde,pf:reverse?[...pf].reverse():pf};caches.set(key,result);if(caches.size>8)caches.delete(caches.keys().next().value);return result}
export function histogram(xs,min=-9,max=9,n=48){const bins=Array(n).fill(0),w=(max-min)/n;for(const x of xs){const k=Math.floor((x-min)/w);if(k>=0&&k<n)bins[k]++}return bins.map((v,i)=>({x:min+i*w,w,y:v/(xs.length*w)}))}
export const cleanCenters=[[-2,-.8],[1.6,1]]
export function denoiser(x,sigma){const v=.12+sigma*sigma,logw=cleanCenters.map(m=>-((x[0]-m[0])**2+(x[1]-m[1])**2)/(2*v)),max=Math.max(...logw),w=logw.map(l=>Math.exp(l-max)),sum=w[0]+w[1];return [0,1].map(d=>cleanCenters.reduce((s,m,i)=>s+w[i]/sum*(m[d]+.12/v*(x[d]-m[d])),0))}
export function denoiserStep(x,sigma,next){if(sigma===0)return [...x];const d=denoiser(x,sigma),r=next/sigma;return x.map((v,i)=>r*v+(1-r)*d[i])}
export function transport(z,t,mode='Direct'){const angle=mode==='Rotation'?1.3*Math.sin(Math.PI*t):0,c=Math.cos(angle),s=Math.sin(angle),a=1-.45*t,b=1-.2*t,mu=[-2+4*t,mode==='Detour'?1.6*Math.sin(Math.PI*t):0];return [mu[0]+a*(c*z[0]-s*z[1]),mu[1]+b*(s*z[0]+c*z[1])]}
export const transportPoints=(()=>{const r=rng(77);return Array.from({length:96},()=>[normal(r),normal(r)])})()
