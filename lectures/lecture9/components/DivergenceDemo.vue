<script setup lang="ts">
import { computed } from 'vue'
import { useNav } from '@slidev/client'
import L9Math from './L9Math.vue'
import PatchPlot from './PatchPlot.vue'
import { patchState as state } from '../lib/demo-state'
import { patchStats, patchModes } from '../lib/dynamics-demos.mjs'
import '../lib/demos.css'
const { isPrintMode }=useNav()
const cases=computed(()=> (isPrintMode.value ? patchModes : [state.mode]).map(mode=>({mode,t:isPrintMode.value?1.5:state.t,...patchStats(isPrintMode.value?1.5:state.t,mode)})))
const formula=(mode: string)=>mode==='Shear' ? '\\bv=(0.8x_2,0)' : mode==='Expansion' ? '\\bv=0.45\\bx' : '\\bv=-0.45\\bx'
function reset(){state.t=0;state.mode='Expansion'}
</script>
<template>
  <DemoPanel class="l9-demo patch-demo" data-demo="divergence" :data-t="state.t" :data-mode="state.mode" :class="{'print-demo':isPrintMode}">
    <div class="density-bridge">
      <div><b>Lecture 2: area change</b><L9Math formula="\displaystyle\frac{A_t}{A_0}=|\det\bJ_{\bpsi_t}|,\qquad\bJ_{\bpsi_t}=\frac{\partial\bpsi_t}{\partial\bx_0}" /></div>
      <div><b>CNF: log-area rate</b><L9Math formula="\displaystyle\frac{d}{dt}\log|\det\bJ_{\bpsi_t}|=\diver\bv=\tr\!\left(\frac{\partial\bv}{\partial\bx}\right)" /></div>
    </div>
    <div v-if="!isPrintMode" class="demo-controls l9-controls"><button v-for="mode in patchModes" :key="mode" @click="state.mode=mode" :aria-pressed="state.mode===mode">{{ mode }}</button><label>Time <input type="range" min="0" max="1.5" step=".01" aria-label="Patch time" v-model.number="state.t" /><output>{{ state.t.toFixed(2) }}</output></label><button class="demo-reset" @click="reset">Reset</button></div>
    <div class="patch-cases"><div v-for="item in cases" :key="item.mode" class="patch-case"><div class="l9-heading">{{ item.mode }} · <L9Math :formula="formula(item.mode)" /></div><div class="patch-body"><PatchPlot :t="item.t" :mode="item.mode" :compact="isPrintMode" /><div class="readouts">
      <div><span>Divergence</span><b>{{ item.divergence.toFixed(2) }}</b></div><div><span>Area</span><b>{{ item.area.toFixed(3) }}</b></div><div><span>Density inside the patch</span><b>{{ item.density.toFixed(3) }}</b></div><div class="conserved"><span>Area × density</span><b>{{ (item.area*item.density).toFixed(3) }}</b></div>
    </div></div></div></div>
    <div class="demo-takeaway">Mass is conserved: <L9Math formula="\displaystyle\frac{d\log p_t(\bx(t))}{dt}=-\frac{d\log A_t}{dt}=-\diver\bv." /></div>
    <div class="demo-note"><span v-if="isPrintMode">t = 1.5. </span>Dashed: initial unit square; solid: moving patch. Area scaling is local in general; exact here (linear flows).</div>
  </DemoPanel>
</template>
<style scoped>
.density-bridge{display:grid;gap:6px;margin-bottom:8px}.density-bridge>div{display:grid;grid-template-columns:280px 1fr;align-items:center;gap:15px;min-height:42px}.density-bridge b{color:#17324d;font-size:21px}.patch-body{display:grid;grid-template-columns:1.3fr 1fr;gap:45px}.patch-body :deep(svg){height:210px}.readouts{display:flex;flex-direction:column;justify-content:center;gap:15px;padding:0 40px}.readouts>div{display:flex;justify-content:space-between;gap:15px}.readouts b{font-variant-numeric:tabular-nums;color:#007f82}.conserved{border-top:1px solid #bbced8;padding-top:15px}.print-demo .patch-cases{display:grid;grid-template-columns:repeat(3,1fr);gap:25px}.print-demo .patch-body{display:block}.print-demo .patch-body :deep(svg){height:155px}.print-demo .readouts{padding:0 8px;font-size:18px;gap:6px}.print-demo .l9-heading{font-size:18px}.print-demo .conserved{padding-top:8px}.patch-demo .demo-takeaway{display:flex;justify-content:center;align-items:center;gap:14px}
</style>
