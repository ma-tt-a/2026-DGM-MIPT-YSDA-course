<script setup lang="ts">
import { computed, ref, watch, onBeforeUnmount } from 'vue'
import { useNav } from '@slidev/client'
import L9Math from './L9Math.vue'
import StationaryPlot from './StationaryPlot.vue'
import { stationaryState as state } from '../lib/demo-state'
import { stationaryCache, stationaryVariance, langevinModes, langevinConfig } from '../lib/dynamics-demos.mjs'
import '../lib/demos.css'
const {isPrintMode,currentSlideNo}=useNav(),running=ref(false)
let timer: ReturnType<typeof setInterval>|undefined
function pause(){clearInterval(timer);timer=undefined;running.value=false}
function step(){state.step=Math.min(langevinConfig.maxSteps,state.step+1);if(state.step===langevinConfig.maxSteps)pause()}
function run(){if(running.value)return pause();running.value=true;timer=setInterval(step,40)}
function choose(mode: string){pause();state.mode=mode;state.step=0}
function reset(){choose('Both')}
watch(currentSlideNo,pause);onBeforeUnmount(pause)
const cases=computed(()=>(isPrintMode.value?langevinModes:[state.mode]).map(mode=>({mode,step:isPrintMode.value?120:state.step})))
const empiricalVariance=computed(()=>{const points=stationaryCache[state.mode][state.step],mean=points.reduce((a,b)=>a+b,0)/points.length;return points.reduce((a,b)=>a+(b-mean)**2,0)/points.length})
const formulas: Record<string,string>={'Drift only':'dx=-\\tfrac12 x\\,dt','Diffusion only':'dx=dw','Both':'dx=-\\tfrac12 x\\,dt+dw'}
</script>
<template>
  <DemoPanel class="l9-demo stationary-demo" data-demo="stationary-langevin" :class="{'print-demo':isPrintMode}" :data-mode="state.mode" :data-step="state.step" :data-running="running">
    <div class="l9-formula"><L9Math formula="p_0(x)=p_*(x)=\cN(0,1),\qquad\tfrac12\nabla_x\log p_*(x)=-\tfrac12x" /></div>
    <div v-if="!isPrintMode" class="demo-controls l9-controls"><button v-for="mode in langevinModes" :key="mode" @click="choose(mode)" :aria-pressed="state.mode===mode">{{ mode }}</button><label>Time <input type="range" min="0" max="120" step="1" aria-label="Langevin time step" v-model.number="state.step" @input="pause" /><output>{{ (state.step*.025).toFixed(2) }}</output></label><button class="primary" @click="run" :disabled="state.step===120">{{ running?'Pause':'Run' }}</button><button @click="step" :disabled="running||state.step===120">Step</button><button class="demo-reset" @click="reset">Reset</button></div>
    <div v-else class="l9-print-label">Same initial samples from the target. All three cases at t = 3.</div>
    <div class="l9-legend"><span style="color:#8854c0">▥ Empirical histogram</span><span style="color:#007f82">━ Exact current density</span><span style="color:#587083">┄ Target N(0, 1)</span></div>
    <div class="stationary-body"><div class="stationary-cases"><div v-for="item in cases" :key="item.mode"><div class="l9-heading">{{ item.mode }} · <L9Math :formula="formulas[item.mode]" /></div><StationaryPlot :mode="item.mode" :step="item.step" :plot-id="`stationary-${item.mode.replaceAll(' ','-')}-${isPrintMode?'print':'live'}`" /><div v-if="isPrintMode" class="l9-stats">Exact variance: {{ stationaryVariance(item.mode,3).toFixed(3) }}</div></div></div>
      <div v-if="!isPrintMode" class="stationary-readouts"><div><span>Exact variance</span><b>{{ stationaryVariance(state.mode,state.step*.025).toFixed(3) }}</b></div><div><span>Empirical variance</span><b>{{ empiricalVariance.toFixed(3) }}</b></div><div class="explanation">{{ state.mode==='Both'?'Drift pulls inward; diffusion spreads outward. Their density changes cancel.':state.mode==='Drift only'?'Particles approach the mode. The distribution becomes too narrow.':'Noise spreads the particles. The distribution becomes too wide.' }}</div><div class="marked">Orange: one moving particle.</div></div>
    </div>
    <div class="demo-takeaway">Stationary density does not mean stationary particles.</div>
    <div class="demo-note">768 samples; finite-sample fluctuations remain. Exact Gaussian transitions isolate stationarity from discretization error.</div>
  </DemoPanel>
</template>
<style scoped>
.stationary-body{display:grid;grid-template-columns:1.45fr 1fr;gap:60px}.stationary-cases :deep(svg){height:255px}.stationary-readouts{padding-top:40px;display:flex;flex-direction:column;gap:20px}.stationary-readouts>div:not(.explanation):not(.marked){display:flex;justify-content:space-between;gap:20px}.stationary-readouts b{color:#007f82;font-variant-numeric:tabular-nums}.explanation{line-height:1.6;color:#587083}.marked{font-size:18px;color:#b65b20}.print-demo .stationary-body{display:block}.print-demo .stationary-cases{display:grid;grid-template-columns:repeat(3,1fr);gap:20px}.print-demo .l9-heading{font-size:18px}.print-demo .stationary-cases :deep(svg){height:235px}.l9-controls input{width:130px}.l9-controls{gap:8px}
</style>
