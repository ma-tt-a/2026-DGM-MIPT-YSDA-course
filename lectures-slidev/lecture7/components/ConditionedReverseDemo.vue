<script setup lang="ts">
import { computed } from 'vue'
import { useNav } from '@slidev/client'
import { reverseState as state } from '../lib/demo-state'
import { bridge, cleanValues, gaussian, reverseAt } from '../lib/diffusion-demos.mjs'
const { isPrintMode } = useNav()
const xt = computed(() => isPrintMode.value ? 0 : state.xt)
const posterior = computed(() => reverseAt(xt.value))
const colors = ['#8854c0', '#007f82']
const px = (x: number) => 44 + (x + 4) / 8 * 472
const py = (y: number) => 230 - y * 200
const path = (fn: (x:number)=>number) => Array.from({length:321},(_,i)=>{const x=-4+i/40;return `${i?'L':'M'}${px(x).toFixed(2)},${py(fn(x)).toFixed(2)}`}).join(' ')
function reset() { state.xt=0;state.known=false;state.selected=0 }
</script>
<template>
  <DemoPanel data-demo="conditioned-reverse" :data-xt="xt" :data-known="state.known" :data-selected="state.selected" :data-weights="posterior.weights.join(',')">
    <div class="demo-controls" v-if="!isPrintMode">
      <button :aria-pressed="!state.known" @click="state.known=false">Unknown x₀</button>
      <button :aria-pressed="state.known" @click="state.known=true">Known x₀</button>
      <label>Noisy observation <L7Math formula="x_t" /><input type="range" min="-2" max="2" step=".05" v-model.number="state.xt" aria-label="Noisy observation" /><output>{{ xt.toFixed(2) }}</output></label>
      <button class="demo-reset" @click="reset">Reset</button>
    </div>
    <div v-else class="print-heading">Same observation <L7Math formula="x_t=0" />: unknown clean data versus each known clean value.</div>
    <div class="reverse-grid">
      <div class="information">
        <b>Two possible clean values</b>
        <L7Math formula="\bbP(x_0=-2)=\bbP(x_0=2)=\tfrac12" />
        <div class="clean-options">
          <div v-for="(x,i) in cleanValues" :key="x" class="clean-card" :style="{borderColor:colors[i]}">
            <L7Math :formula="`x_0=${x}`" />
            <div class="weight-track"><div :style="{width:`${100*posterior.weights[i]}%`,background:colors[i]}" /></div>
            <span>Posterior weight {{ (100*posterior.weights[i]).toFixed(1) }}%</span>
            <button v-if="!isPrintMode" :disabled="!state.known" :aria-pressed="state.known && state.selected===i" @click="state.selected=i">Use x₀ = {{ x }}</button>
          </div>
        </div>
        <div class="information-note" v-if="!isPrintMode">
          <template v-if="!state.known">Only <L7Math formula="x_t" /> is observed.<br>Average over the possible clean values.</template>
          <template v-else>Both <L7Math formula="x_t" /> and <L7Math :formula="`x_0=${cleanValues[state.selected]}`" /> are known.<br>The reverse kernel is one Gaussian.</template>
        </div>
        <div class="information-note" v-else>Unknown x₀: posterior-weighted mixture.<br>Known x₀: the corresponding Gaussian.</div>
      </div>
      <div>
        <div class="plot-heading"><L7Math formula="q(x_{t-1}|x_t)" /><span v-if="state.known || isPrintMode"> and <L7Math formula="q(x_{t-1}|x_t,x_0)" /></span></div>
        <svg viewBox="0 0 550 275" role="img" aria-label="Exact reverse mixture and Gaussian reverse kernels conditioned on the clean value">
          <line x1="44" y1="230" x2="516" y2="230" stroke="#bbced8" />
          <g v-for="x in [-4,-2,0,2,4]" :key="x"><text :x="px(x)" y="254" text-anchor="middle">{{ x }}</text></g>
          <path :d="path(posterior.density)" fill="none" stroke="#17324d" stroke-width="3" :stroke-dasharray="state.known || isPrintMode ? '7 5' : undefined" />
          <template v-for="(m,i) in posterior.means" :key="i"><path v-if="isPrintMode || (state.known && state.selected===i)" :d="path(x=>gaussian(x,m,bridge.variance))" fill="none" :stroke="colors[i]" stroke-width="3.5" /></template>
          <foreignObject x="485" y="246" width="65" height="29"><L7Math formula="x_{t-1}" /></foreignObject>
        </svg>
        <div class="legend"><span class="mixture">━ Unknown x₀</span><template v-if="state.known || isPrintMode"><span v-for="(x,i) in cleanValues" v-show="isPrintMode || state.selected===i" :key="x" :style="{color:colors[i]}">━ Known x₀ = {{ x }}</span></template></div>
      </div>
    </div>
    <div class="mixture-identity"><L7Math formula="q(x_{t-1}|x_t)=\sum_{x_0\in\{-2,2\}}q(x_{t-1}|x_t,x_0)\,q(x_0|x_t)" /></div>
    <div class="demo-note">Exact toy example. During training x₀ is available; during generation it is unknown.</div>
  </DemoPanel>
</template>
<style scoped>
label{display:flex;align-items:center;gap:10px;margin-left:16px}input{width:190px;min-height:44px;accent-color:#007f82}output{width:48px;font-variant-numeric:tabular-nums}.reverse-grid{display:grid;grid-template-columns:1fr 1.2fr;gap:40px;margin-top:25px}.information{display:flex;flex-direction:column;gap:12px}.clean-options{display:grid;grid-template-columns:1fr 1fr;gap:16px}.clean-card{border-top:3px solid;padding-top:12px;display:flex;flex-direction:column;gap:10px}.clean-card>span{font-size:18px}.weight-track{height:8px;background:#edf1f4}.weight-track>div{height:100%}.information-note{margin-top:8px;color:#587083;min-height:62px}.plot-heading{text-align:center;height:32px}svg{width:100%;height:275px}svg text{font:18px Arial;fill:#587083}.legend{display:flex;justify-content:center;gap:16px;font-size:18px;height:28px}.mixture{color:#17324d}.mixture-identity{margin:24px 0 12px;text-align:center;font-size:23px}.demo-note{text-align:center}.print-heading{margin:15px 0 25px;text-align:center}
</style>
