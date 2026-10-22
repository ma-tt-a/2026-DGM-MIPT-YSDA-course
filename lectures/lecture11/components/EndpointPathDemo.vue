<script setup lang="ts">
import { computed } from 'vue'
import { useNav } from '@slidev/client'
import { endpoint, coneEndpoints, particles, interpolate } from '../lib/cfm-demos.mjs'
import { endpointState as state } from '../lib/demo-state'
const props=withDefaults(defineProps<{staticView?:boolean}>(),{staticView:false})
const { isPrintMode }=useNav(), frozen=computed(()=>isPrintMode.value||props.staticView), t=computed(()=>frozen.value?.5:state.t)
const px=(time:number)=>55+300*time, py=(x:number)=>90-25*x
const coneX=(i:number,time:number)=>455+215*i+165*time
const coneY=(x:number)=>90-24*x
const band=(i:number,a:number,sigma:number)=>`${coneX(i,0)},${coneY(-sigma)} ${coneX(i,0)},${coneY(sigma)} ${coneX(i,1)},${coneY(a)}`
</script>
<template>
<DemoPanel class="endpoint-demo" data-demo="endpoint-path" :data-t="t">
 <div class="demo-controls" v-if="!frozen"><label>Time <input aria-label="Conditional path time" type="range" min="0" max="1" step=".01" v-model.number="state.t"/><output>{{t.toFixed(2)}}</output></label><button v-for="v in [0,.5,1]" :key="v" @click="state.t=v">{{v}}</button><span class="demo-note">Bands: mean ± σ / ± 2σ.</span><button class="demo-reset" @click="state.t=.5">Reset</button></div>
 <div v-else class="print-context">t = 0.5 · fixed particles; shaded bands: mean ± σ / ± 2σ.</div>
 <svg viewBox="0 0 1120 180" role="img" aria-label="Fixed particles move to endpoint 2. Three Gaussian cones contract to endpoints minus 2, zero, and 2; shaded bands show one and two standard deviations">
  <text x="18" y="96">x</text><text x="205" y="19" text-anchor="middle">Particles · x₁ = 2</text>
  <line x1="55" y1="145" x2="355" y2="145" stroke="#bbced8"/>
  <path v-for="(x,i) in particles" :key="i" :d="`M55,${py(x)} L355,${py(endpoint)}`" fill="none" :stroke="i===2?'#8854c0':'#bbced8'" :stroke-width="i===2?2.5:1"/>
  <line :x1="px(t)" y1="30" :x2="px(t)" y2="143" stroke="#e17838" stroke-width="2" stroke-dasharray="4 4"/>
  <circle v-for="(x,i) in particles" :key="`p${i}`" :cx="px(t)" :cy="py(interpolate(x,t))" :r="i===2?5:3" :fill="i===2?'#8854c0':'#007f82'"/>
  <circle cx="355" :cy="py(endpoint)" r="5" fill="#e17838"/>
  <text x="55" y="168">0 · noise</text><text x="355" y="168" text-anchor="end">1 · endpoint</text>
  <g v-for="(a,i) in coneEndpoints" :key="a" data-cone :data-endpoint="a" :data-mean="t*a" :data-sigma="1-t">
   <text :x="coneX(i,.5)" y="19" text-anchor="middle">x₁ = {{a}}</text>
   <line :x1="coneX(i,0)" y1="145" :x2="coneX(i,1)" y2="145" stroke="#bbced8"/>
   <polygon :points="band(i,a,2)" style="fill: #e0eeee" stroke="#82b9ba" stroke-width="1"/>
   <polygon :points="band(i,a,1)" style="fill: #abd3d4"/>
   <line :x1="coneX(i,0)" :y1="coneY(0)" :x2="coneX(i,1)" :y2="coneY(a)" stroke="#007f82" stroke-width="1.5"/>
   <line :x1="coneX(i,t)" y1="30" :x2="coneX(i,t)" y2="143" stroke="#e17838" stroke-width="2" stroke-dasharray="4 4"/>
   <line :x1="coneX(i,t)" :y1="coneY(t*a-2*(1-t))" :x2="coneX(i,t)" :y2="coneY(t*a+2*(1-t))" stroke="#007f82" stroke-width="4"/>
   <circle :cx="coneX(i,t)" :cy="coneY(t*a)" r="4" fill="#e17838" stroke="white" stroke-width="1"/>
   <circle :cx="coneX(i,1)" :cy="coneY(a)" r="3" fill="#e17838"/>
   <text :x="coneX(i,0)" y="168">0</text><text :x="coneX(i,1)" y="168" text-anchor="end">1</text><text :x="coneX(i,.5)" y="168" text-anchor="middle">t</text>
  </g>
 </svg>
</DemoPanel>
</template>
<style scoped>
.endpoint-demo svg{display:block;width:100%;height:180px}.endpoint-demo text{font:18px Arial;fill:#587083}.demo-controls{margin:0 0 4px;gap:10px}.demo-controls label{display:flex;align-items:center;gap:10px}.demo-controls input{width:240px}.demo-controls output{width:45px;font-variant-numeric:tabular-nums}.print-context{height:48px;color:#587083;font-size:18px;padding-top:8px}
</style>
