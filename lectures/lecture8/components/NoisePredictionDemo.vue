<script setup lang="ts">
import { computed, useId } from 'vue'
import { useNav } from '@slidev/client'
import { predictionState as state } from '../lib/demo-state'
import { predictionBounds, predictionFrom } from '../lib/prediction-demos.mjs'
import L8Math from './L8Math.vue'

type Output = 'clean' | 'noise' | 'mean'
const { isPrintMode } = useNav()
const output = computed<Output>(() => isPrintMode.value ? 'noise' : state.output)
const current = computed(() => predictionFrom('noise', isPrintMode.value ? .5 : state.noise))
const id = 'parameterization-' + useId().replace(/[^a-z0-9-]/gi, '')
const quantities: { key: Output; name: string; formula: string; color: string; tint: string }[] = [
  { key: 'clean', name: 'Clean data', formula: '\\hat x_0', color: '#007f82', tint: '#eaf4f3' },
  { key: 'noise', name: 'Noise', formula: '\\hat\\epsilon', color: '#8854c0', tint: '#f4eef9' },
  { key: 'mean', name: 'Reverse mean', formula: '\\mu_{\\btheta,t}', color: '#e17838', tint: '#fff3e9' },
]
const fmt = (value: number) => (Math.abs(value) < .0005 ? 0 : value).toFixed(3)
function change(key: Output, event: Event) {
  state.output = key
  state.noise = predictionFrom(key, +(event.target as HTMLInputElement).value).noise
}
function reset() { state.noise = .5; state.output = 'noise' }
</script>

<template>
  <DemoPanel data-demo="noise-prediction" :data-output="output" :data-noise="current.noise" :data-clean="current.clean" :data-mean="current.mean">
    <div class="fixed-input">
      <span>Linked predictions, one coordinate:</span>
      <L8Math formula="x_t=1,\quad\alpha_t=0.6,\quad\bar\alpha_t=0.39" />
      <div v-if="!isPrintMode" class="demo-controls reset-control"><button class="demo-reset" @click="reset">Reset</button></div>
    </div>

    <div class="quantities">
      <template v-for="(q,i) in quantities" :key="q.key">
        <div class="quantity" :class="{selected:output===q.key}" :style="{'--quantity-color':q.color,'--quantity-tint':q.tint}" :data-quantity="q.key" @click="state.output=q.key" @focusin="state.output=q.key">
          <div class="quantity-heading">
            <span class="quantity-name">{{ q.name }}</span>
            <span class="quantity-role">{{ output===q.key ? 'Network output' : 'Computed' }}</span>
          </div>
          <div class="quantity-control">
            <div class="quantity-value"><L8Math :formula="q.formula" /><span>=</span><output :for="id+'-'+q.key">{{ fmt(current[q.key]) }}</output></div>
            <div v-if="!isPrintMode" class="slider-control"><input :id="id+'-'+q.key" type="range" :min="predictionBounds[q.key][0]" :max="predictionBounds[q.key][1]" step="any" :value="current[q.key]" :aria-label="q.name+' prediction'" :aria-valuetext="fmt(current[q.key])" @input="change(q.key,$event)" /></div>
            <div v-else class="print-scale"><div class="print-track" /><div class="print-thumb" :style="{left:100*(current[q.key]-predictionBounds[q.key][0])/(predictionBounds[q.key][1]-predictionBounds[q.key][0])+'%'}" /></div>
          </div>
        </div>
        <svg v-if="i<2" class="conversion-arrow" viewBox="0 0 52 96" role="img" :aria-label="i===0 ? (output==='clean'?'Convert clean data to noise':'Convert noise to clean data') : (output==='mean'?'Convert reverse mean to noise':'Convert noise to reverse mean')">
          <defs><marker :id="id+'-arrow-'+i" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="#587083" /></marker></defs>
          <line :x1="(i===0 ? output==='clean' : output!=='mean')?8:44" y1="48" :x2="(i===0 ? output==='clean' : output!=='mean')?44:8" y2="48" stroke="#587083" stroke-width="2" :marker-end="'url(#'+id+'-arrow-'+i+')'" />
        </svg>
      </template>
    </div>

    <table class="loss-table">
      <thead><tr><th>Network output at <L8Math formula="\bx_t" /></th><th>Training target</th><th>Squared error</th></tr></thead>
      <tbody>
        <tr :class="{active:output==='clean'}" style="--row-tint:#eaf4f3">
          <td><span>Clean data</span> <L8Math formula="\hat{\bx}_{\btheta,t}" /></td>
          <td><L8Math formula="\bx_0" /></td>
          <td><L8Math formula="\ell_{x_0}=\|\hat{\bx}_{\btheta,t}-\bx_0\|^2" /></td>
        </tr>
        <tr :class="{active:output==='noise'}" style="--row-tint:#f4eef9">
          <td><span>Noise</span> <L8Math formula="\bepsilon_{\btheta,t}" /></td>
          <td><L8Math formula="\bepsilon" /></td>
          <td><L8Math formula="\ell_\epsilon=\|\bepsilon_{\btheta,t}-\bepsilon\|^2" /></td>
        </tr>
        <tr :class="{active:output==='mean'}" style="--row-tint:#fff3e9">
          <td><span>Reverse mean</span> <L8Math formula="\bmu_{\btheta,t}" /></td>
          <td><L8Math formula="\tilde{\bmu}_t(\bx_t,\bx_0)" /></td>
          <td><L8Math formula="\ell_\mu=\|\bmu_{\btheta,t}-\tilde{\bmu}_t\|^2" /></td>
        </tr>
      </tbody>
    </table>
    <div class="loss-caption">For linked predictions, the same noise MSE, with <L8Math formula="q=q(\bx_t|\bx_0)" />:</div>
    <div class="loss-identity">
      <L8Math formula="\displaystyle \cL_t^{(\epsilon)}=\bbE_q[\ell_\epsilon]=\bbE_q\!\left[{\color{#007f82}\frac{\bar\alpha_t}{1-\bar\alpha_t}}\ell_{x_0}\right]=\bbE_q\!\left[{\color{#e17838}\frac{\alpha_t(1-\bar\alpha_t)}{(1-\alpha_t)^2}}\ell_\mu\right]" />
    </div>
    <div class="demo-takeaway"><strong>Equivalent with these weights.</strong> Plain MSE in each parameterization weights timesteps differently.</div>
  </DemoPanel>
</template>

<style scoped>
.fixed-input{display:flex;align-items:center;justify-content:space-between;gap:20px;min-height:44px;margin-bottom:8px}
.demo-controls.reset-control{margin:0}
.quantities{display:grid;grid-template-columns:1fr 52px 1fr 52px 1fr;align-items:center}
.quantity{padding:10px 12px;border:2px solid #dbe4eb;border-radius:8px;min-width:0;background:white;cursor:pointer}
.quantity.selected{border-color:var(--quantity-color);background:var(--quantity-tint)}
.quantity-heading{display:flex;align-items:baseline;justify-content:space-between;gap:8px}
.quantity-name{font-weight:600}
.quantity-role{font-size:18px;color:#587083}
.selected .quantity-role{color:var(--quantity-color);font-weight:600}
.quantity-control{display:flex;align-items:center;gap:12px;margin-top:4px}
.quantity-value{display:flex;align-items:baseline;gap:8px;font-size:28px;color:var(--quantity-color)}
.quantity-value output{font-variant-numeric:tabular-nums;min-width:85px;text-align:right}
.slider-control,.print-scale{position:relative;flex:1;min-width:0;height:44px}
.slider-control{z-index:1}
input{width:100%;height:44px;accent-color:var(--quantity-color);margin:0}
.conversion-arrow{width:52px;height:96px}
.print-track{position:absolute;left:0;right:0;top:20px;height:4px;background:#dbe4eb;border-radius:2px}
.print-thumb{position:absolute;top:14px;width:16px;height:16px;border-radius:50%;background:var(--quantity-color);transform:translateX(-50%)}
.loss-table{margin:10px 0 0}
.loss-table th,.loss-table td{padding:6px 12px}
.loss-table td:first-child>span:first-child{display:inline-block;min-width:160px}
.loss-table tr.active td{background:var(--row-tint)}
.loss-caption{margin-top:10px}
.loss-identity{text-align:center;font-size:24px;margin:10px 0 12px}
.demo-takeaway{margin-top:0}
</style>
