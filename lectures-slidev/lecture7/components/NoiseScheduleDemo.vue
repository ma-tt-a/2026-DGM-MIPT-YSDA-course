<script setup lang="ts">
import { computed } from 'vue'
import { useNav } from '@slidev/client'
import { scheduleState as state } from '../lib/demo-state'
import { schedules, scheduleAt, noisyImage } from '../lib/diffusion-demos.mjs'
const { isPrintMode } = useNav()
const t = computed(()=>isPrintMode.value?500:state.t)
const colors=['#007f82','#8854c0'], names=['Linear β','Cosine']
const px=(t:number)=>45+t/1000*450, py=(v:number)=>18+(10-Math.max(-12,Math.min(10,v)))/22*128
const paths=schedules.map(kind=>Array.from({length:1000},(_,i)=>`${i?'L':'M'}${px(i+1).toFixed(2)},${py(scheduleAt(kind,i+1).logSnr).toFixed(2)}`).join(' '))
const images=computed(()=>schedules.map(kind=>noisyImage(kind,t.value).map(v=>{const g=Math.round(255*Math.max(0,Math.min(1,(v+2.5)/5)));return `rgb(${g},${g},${g})`})))
</script>
<template>
  <DemoPanel class="schedule-demo" data-demo="noise-schedule" :data-t="t">
    <div v-if="!isPrintMode" class="demo-controls"><label>t <input v-model.number="state.t" type="range" min="1" max="1000" step="1" aria-label="Schedule timestep" /><output>{{ t }}</output></label><button class="demo-reset" @click="state.t=500">Reset</button></div>
    <div v-else class="print-label">Same timestep: t = 500 / 1000</div>
    <svg class="schedule-chart" viewBox="0 0 540 180" role="img" aria-label="Log-SNR against timestep for linear beta and cosine schedules">
      <g v-for="v in [10,0,-10]" :key="v"><line x1="45" :y1="py(v)" x2="495" :y2="py(v)" stroke="#e1e8ed" /><text x="35" :y="py(v)+6" text-anchor="end">{{ v }}</text></g>
      <text x="48" y="13">log-SNR</text><text x="505" y="171">t</text>
      <g v-for="step in [0,500,1000]" :key="step"><text :x="px(step)" y="171" text-anchor="middle">{{ step }}</text></g>
      <path v-for="(path,i) in paths" :key="i" :d="path" fill="none" :stroke="colors[i]" stroke-width="2.7" />
      <line :x1="px(t)" y1="18" :x2="px(t)" y2="146" stroke="#587083" stroke-dasharray="4 4" />
      <circle v-for="(kind,i) in schedules" :key="kind" :cx="px(t)" :cy="py(scheduleAt(kind,t).logSnr)" r="5" :fill="colors[i]" stroke="white" stroke-width="1.5" />
    </svg>
    <div class="image-pair">
      <div v-for="(kind,i) in schedules" :key="kind" class="image-case">
        <svg viewBox="0 0 32 32" role="img" :aria-label="`${names[i]} noisy digit at step ${t}`" shape-rendering="crispEdges"><rect v-for="(fill,j) in images[i]" :key="j" :x="j%32" :y="Math.floor(j/32)" width="1" height="1" :fill="fill" /></svg>
        <div><b :style="{color:colors[i]}">{{ names[i] }}</b><br><span>λ = {{ scheduleAt(kind,t).logSnr.toFixed(2) }}</span></div>
      </div>
    </div>
    <div class="demo-note">Same clean image and Gaussian noise.<br>Fixed display scale; log-SNR axis clipped to [−12, 10].</div>
  </DemoPanel>
</template>
<style scoped>
.demo-controls{margin-bottom:0;gap:8px}label{display:flex;align-items:center;gap:12px}input{width:250px;min-height:44px;accent-color:#007f82}output{width:45px;font-variant-numeric:tabular-nums}.schedule-chart{width:100%;height:172px}svg text{font:17px Arial;fill:#587083}.image-pair{display:grid;grid-template-columns:1fr 1fr;gap:15px;margin:5px 0 10px}.image-case{display:flex;align-items:center;gap:12px}.image-case svg{width:100px;height:100px}.image-case b{font-size:19px}.image-case span{font-size:18px}.demo-note{text-align:center;font-size:16px}.print-label{text-align:center;height:44px;padding-top:8px}
</style>
