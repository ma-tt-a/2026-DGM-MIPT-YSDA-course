<script setup lang="ts">
import { computed } from 'vue'
import { useNav } from '@slidev/client'
import { diffusionAt, diffusionTimes } from '../lib/score-demos.mjs'
import { diffusionState as state } from '../lib/demo-state'
const { isPrintMode } = useNav()
const current = computed(() => diffusionAt(state.t))
</script>
<template>
  <DemoPanel class="diffusion-demo" data-demo="forward-diffusion" :data-t="state.t" :data-alpha-bar="current.alphaBar" :data-signal="current.signal" :data-noise="current.noise">
    <div class="diffusion-description"><L6Math formula="\pd(x_0)=\tfrac12\cN(-2,0.35^2)+\tfrac12\cN(2,0.35^2),\qquad\beta_t=0.01" /></div>
    <div v-if="!isPrintMode" class="demo-controls">
      <label>Time <L6Math formula="t" /><input aria-label="Diffusion timestep" type="range" min="0" max="1000" step="1" v-model.number="state.t" /><output>{{ state.t }}</output></label>
      <button v-for="t in diffusionTimes" :key="t" :aria-pressed="state.t === t" @click="state.t=t">{{ t }}</button>
      <button class="demo-reset" @click="state.t=0">Reset</button>
    </div>
    <div v-if="!isPrintMode" class="density-pair">
      <div><div class="plot-title initial"><L6Math formula="\pd(x_0)" /><span>Original data</span></div><DiffusionDensity :t="0" initial /></div>
      <div><div class="plot-title current"><L6Math formula="q(x_t)" /><span>t = {{ state.t }}</span></div><DiffusionDensity :t="state.t" /></div>
    </div>
    <div v-else class="print-densities">
      <div v-for="t in diffusionTimes" :key="t"><div class="plot-title" :class="t===0 ? 'initial' : 'current'">t = {{ t }}</div><DiffusionDensity :t="t" :initial="t===0" compact /><div class="print-coefficients">Signal {{ diffusionAt(t).signal.toFixed(3) }} · Noise {{ diffusionAt(t).noise.toFixed(3) }}</div></div>
    </div>
    <div v-if="!isPrintMode" class="coefficients">
      <span>Signal coefficient <L6Math formula="\sqrt{\bar\alpha_t}" /> = <output>{{ current.signal.toFixed(3) }}</output></span>
      <span>Noise std. <L6Math formula="\sqrt{1-\bar\alpha_t}" /> = <output>{{ current.noise.toFixed(3) }}</output></span>
    </div>
    <div class="density-note"><span class="dashed-key" /> Standard Gaussian reference <L6Math formula="\cN(0,1)" />.<span>The plots show marginal densities; the kernels above are conditional.</span></div>
  </DemoPanel>
</template>
<style scoped>
.diffusion-description { margin: 10px 0 12px; text-align: center; font-size: 20px; }
.demo-controls { margin-bottom: 10px; }
label { display: flex; align-items: center; gap: 12px; }
input { width: 310px; min-height: 44px; accent-color: #007f82; }
output { display: inline-block; width: 54px; font-variant-numeric: tabular-nums; }
.density-pair { display: grid; grid-template-columns: 1fr 1fr; gap: 48px; }
.plot-title { display: flex; justify-content: space-between; align-items: center; padding: 0 24px 0 38px; font-size: 21px; }
.initial { color: #8854c0; } .current { color: #007f82; }
.coefficients { display: flex; justify-content: center; gap: 60px; margin-top: 2px; font-size: 21px; }
.density-note { display: flex; align-items: center; justify-content: center; gap: 8px; flex-wrap: wrap; margin-top: 10px; color: #587083; font-size: 18px; }
.density-note > span:last-child { flex-basis: 100%; text-align: center; }
.dashed-key { width: 30px; border-top: 2px dashed #587083; }
.print-densities { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; margin-top: 30px; }
.print-densities .plot-title { justify-content: center; padding: 0; margin-bottom: 8px; }
.print-coefficients { text-align: center; color: #587083; font-size: 17px; margin-top: 8px; }
</style>
