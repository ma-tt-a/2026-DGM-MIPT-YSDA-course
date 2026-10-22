<script setup lang="ts">
import { computed } from 'vue'
import L11Math from './L11Math.vue'
import { useNav } from '@slidev/client'
import { trainingPairs, defaultPair, conditionalPosition, odePosition, odePaths, integrationSteps } from '../lib/path-comparison.mjs'
import { flowPathsState as state } from '../lib/demo-state'
const props=withDefaults(defineProps<{compare?:boolean,staticView?:boolean}>(),{compare:false,staticView:false})
const {isPrintMode}=useNav()
const frozen=computed(()=>isPrintMode.value||props.staticView)
const t=computed(()=>frozen.value?.5:state.t)
const selected=computed(()=>frozen.value?defaultPair:state.pair)
const pair=computed(()=>trainingPairs[selected.value])
const velocity=computed(()=>pair.value.x1-pair.value.x0)
const px=(s:number)=>48+(props.compare?260:460)*s,py=(x:number)=>(props.compare?75:80)-(props.compare?17:19)*x
const axisY=computed(()=>props.compare?132:142)
const color=(i:number)=>i<trainingPairs.length/2?'#8854c0':'#007f82'
const line=(i:number,ode:boolean)=>ode?odePaths[i].filter((_:number,k:number)=>k%4===0).map((x:number,k:number)=>`${k?'L':'M'}${px(k*4/integrationSteps)},${py(x)}`).join(' '):`M${px(0)},${py(trainingPairs[i].x0)} L${px(1)},${py(trainingPairs[i].x1)}`
function reset(){state.t=.5;state.pair=defaultPair}
</script>
<template>
<DemoPanel data-demo="flow-paths" :data-mode="compare?'compare':'single'" :data-t="t" :data-pair="selected" :data-velocity="velocity">
 <div class="plots" :class="{compare}">
  <svg v-for="mode in (compare?[false,true]:[false])" :key="String(mode)" :viewBox="`0 0 ${compare?360:560} ${compare?160:170}`" role="img" :aria-label="mode?'ODE trajectories of the averaged velocity field':'Straight conditional training paths; horizontal axis is time, vertical axis is the scalar position'">
   <text :x="compare?px(.5):280" y="18" text-anchor="middle">{{compare?(mode?'Sampling · averaged velocity':'Training · straight paths'):'One pair, one straight path'}}</text>
   <line x1="48" :y1="axisY" :x2="px(1)" :y2="axisY" stroke="#bbced8"/>
   <line x1="48" y1="28" x2="48" :y2="axisY" stroke="#bbced8"/>
   <text x="20" y="92">x</text>
   <text x="48" :y="axisY+24">0 · noise</text><text :x="px(1)" :y="axisY+24" text-anchor="end">1 · data</text><text :x="compare?px(.5):280" :y="axisY+24" text-anchor="middle">t</text>
   <path v-for="(_,i) in trainingPairs" :key="i" :d="line(i,mode)" fill="none" :stroke="compare?color(i):(i===selected?'#8854c0':'#c4d1db')" :stroke-width="!compare&&i===selected?3:1.3" :opacity="compare?.48:(!compare&&i===selected?1:.6)"/>
   <line :x1="px(t)" y1="28" :x2="px(t)" :y2="axisY" stroke="#e17838" stroke-width="1.5" stroke-dasharray="4 4"/>
   <circle v-for="(_,i) in trainingPairs" :key="`p${i}`" :cx="px(t)" :cy="py(mode?odePosition(i,t):conditionalPosition(i,t))" :r="!compare&&i===selected?6:3" :fill="compare?color(i):(i===selected?'#8854c0':'#9caebd')" :stroke="!compare&&i===selected?'white':'none'" stroke-width="2"/>
   <template v-if="!compare"><circle :cx="px(0)" :cy="py(pair.x0)" r="5" fill="#8854c0"/><circle :cx="px(1)" :cy="py(pair.x1)" r="5" fill="#8854c0"/></template>
  </svg>
  <div v-if="!compare" class="pair-explanation">
   <L11Math :formula="`x_0=${pair.x0.toFixed(2)},\\qquad x_1=${pair.x1.toFixed(2)}`"/>
   <div class="target"><L11Math :formula="`v=x_1-x_0=${velocity.toFixed(2)}`"/></div>
   <div class="demo-note">Move along the path: the velocity stays constant.</div>
  </div>
 <div v-if="!frozen" class="demo-controls">
  <label>Time <input type="range" min="0" max="1" step=".01" v-model.number="state.t" aria-label="Path time"/><output>{{t.toFixed(2)}}</output></label>
  <button v-if="!compare" @click="state.pair=(state.pair+1)%trainingPairs.length">Another pair</button>
  <span v-else class="demo-note">Same initial particles; endpoint pairings can differ.</span>
  <button class="demo-reset" @click="reset">Reset</button>
 </div>
 <div v-else class="print-context">{{compare?'t = 0.5 · Same initial particles; endpoint pairings can differ.':'t = 0.5 · A fixed pair has a constant target velocity.'}}</div>
 </div>
</DemoPanel>
</template>
<style scoped>
.plots{display:grid;grid-template-columns:1fr 1fr;gap:0 24px;align-items:center}.plots svg{display:block;width:100%;height:170px}.plots:not(.compare) svg{grid-row:1 / 3}.plots.compare{grid-template-columns:360px 360px;column-gap:72px;justify-content:center}.plots.compare svg{height:160px}.demo-controls,.print-context{grid-column:2}.compare .demo-controls,.compare .print-context{grid-column:1 / -1}.plots text{font:18px Arial;fill:#587083}.pair-explanation{font-size:24px}.target{color:#8854c0;margin:14px 0}.pair-explanation .demo-note{font-size:20px}.demo-controls{margin:0;gap:16px}.demo-controls label{display:flex;align-items:center;gap:10px}.demo-controls input{width:130px}.demo-controls output{width:45px;font-variant-numeric:tabular-nums}.print-context{height:48px;color:#587083;font-size:18px;padding-top:10px}
</style>
