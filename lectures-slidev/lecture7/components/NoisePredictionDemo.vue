<script setup lang="ts">
import { computed, useId } from 'vue'
import { useNav } from '@slidev/client'
import { predictionState as state } from '../lib/demo-state'
import { predictionBounds, predictionFrom } from '../lib/diffusion-demos.mjs'

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
      <span>One coordinate. Keep the input and timestep fixed:</span>
      <L7Math formula="x_t=1,\quad\alpha_t=0.6,\quad\bar\alpha_t=0.39" />
    </div>
    <div v-if="!isPrintMode" class="demo-controls">
      <span>Network output</span>
      <button v-for="q in quantities" :key="q.key" :aria-pressed="output===q.key" @click="state.output=q.key">{{ q.name }}</button>
      <button class="demo-reset" @click="reset">Reset</button>
    </div>
    <div v-else class="print-choice">Choose one network output; compute the other two. Example: predict noise.</div>

    <div class="quantities">
      <template v-for="(q,i) in quantities" :key="q.key">
        <div class="quantity" :class="{selected:output===q.key}" :style="{'--quantity-color':q.color,'--quantity-tint':q.tint}" :data-quantity="q.key">
          <div class="quantity-name">{{ q.name }}</div>
          <div class="quantity-value"><L7Math :formula="q.formula" /><span>=</span><output :for="id+'-'+q.key">{{ fmt(current[q.key]) }}</output></div>
          <div v-if="!isPrintMode" class="slider-control"><input :id="id+'-'+q.key" type="range" :min="predictionBounds[q.key][0]" :max="predictionBounds[q.key][1]" step="any" :value="current[q.key]" :aria-label="q.name+' prediction'" :aria-valuetext="fmt(current[q.key])" @input="change(q.key,$event)" /></div>
          <div v-else class="print-scale"><div class="print-track" /><div class="print-thumb" :style="{left:100*(current[q.key]-predictionBounds[q.key][0])/(predictionBounds[q.key][1]-predictionBounds[q.key][0])+'%'}" /></div>
          <div class="quantity-role">{{ output===q.key ? 'Network output' : 'Computed' }}</div>
        </div>
        <svg v-if="i<2" class="conversion-arrow" viewBox="0 0 52 186" role="img" :aria-label="i===0 ? (output==='clean'?'Convert clean data to noise':'Convert noise to clean data') : (output==='mean'?'Convert reverse mean to noise':'Convert noise to reverse mean')">
          <defs><marker :id="id+'-arrow-'+i" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="#587083" /></marker></defs>
          <line :x1="(i===0 ? output==='clean' : output!=='mean')?8:44" y1="93" :x2="(i===0 ? output==='clean' : output!=='mean')?44:8" y2="93" stroke="#587083" stroke-width="2" :marker-end="'url(#'+id+'-arrow-'+i+')'" />
        </svg>
      </template>
    </div>

    <div class="conversion-formulas">
      <div><L7Math formula="\displaystyle x_t=\sqrt{\bar\alpha_t}{\color{#007f82}\hat x_0}+\sqrt{1-\bar\alpha_t}{\color{#8854c0}\hat\epsilon}" /></div>
      <div><L7Math formula="\displaystyle {\color{#e17838}\mu_{\btheta,t}}=\frac{x_t}{\sqrt{\alpha_t}}-\frac{1-\alpha_t}{\sqrt{\alpha_t(1-\bar\alpha_t)}}{\color{#8854c0}\hat\epsilon}" /></div>
    </div>
    <div class="demo-takeaway">Switch the network output: the values stay the same; only the parameterization changes.</div>
    <div class="demo-note">{{ isPrintMode ? 'All three are predicted quantities, linked by known conversions.' : 'Drag any value to use it as the network output; the other two follow.' }}</div>
  </DemoPanel>
</template>

<style scoped>
.fixed-input{display:flex;align-items:center;justify-content:space-between;gap:20px;margin-bottom:22px}.demo-controls{margin-bottom:26px}.demo-controls>span{margin-right:12px}.print-choice{height:44px;display:flex;align-items:center;margin-bottom:26px}.quantities{display:grid;grid-template-columns:1fr 52px 1fr 52px 1fr;align-items:center}.quantity{padding:17px 20px 15px;border:2px solid #dbe4eb;border-radius:8px;min-width:0;background:white}.quantity.selected{border-color:var(--quantity-color);background:var(--quantity-tint)}.quantity-name{text-align:center;font-weight:600}.quantity-value{display:flex;justify-content:center;align-items:baseline;gap:13px;margin-top:16px;font-size:28px;color:var(--quantity-color)}.quantity-value output{font-variant-numeric:tabular-nums;min-width:85px;text-align:right}.slider-control{position:relative;z-index:1;height:44px;margin-top:8px}input{width:100%;height:44px;accent-color:var(--quantity-color);margin:0}.quantity-role{font-size:18px;text-align:center;color:#587083;margin-top:3px}.selected .quantity-role{color:var(--quantity-color);font-weight:600}.conversion-arrow{width:52px;height:186px}.conversion-formulas{display:grid;grid-template-columns:1fr 1fr;gap:26px;margin:28px 0 24px;align-items:center;font-size:24px}.conversion-formulas>div{text-align:center}.demo-takeaway{margin-top:0}.demo-note{text-align:center;margin-top:14px}.print-scale{position:relative;height:44px;margin-top:8px}.print-track{position:absolute;left:0;right:0;top:20px;height:4px;background:#dbe4eb;border-radius:2px}.print-thumb{position:absolute;top:14px;width:16px;height:16px;border-radius:50%;background:var(--quantity-color);transform:translateX(-50%)}
</style>
