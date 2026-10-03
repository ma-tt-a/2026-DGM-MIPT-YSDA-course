<script setup lang="ts">
import { computed, useId } from 'vue'
import { useNav } from '@slidev/client'
import L8Math from './L8Math.vue'
import { cfgAt, colors } from '../lib/guidance-demos.mjs'
import { cfgState as state } from '../lib/demo-state'
const { isPrintMode } = useNav()
const gamma = computed(() => isPrintMode.value ? 3 : state.gamma)
const scores = computed(() => cfgAt(gamma.value))
const examples = [0, 1, 3].map(g => cfgAt(g))
const id = `cfg-${useId().replace(/[^a-z0-9-]/gi, '')}`
// One fixed scale for every vector and gamma, so extrapolation remains literal.
const px = (x: number) => 110 + x * 48, py = (y: number) => 218 - y * 48
const start = cfgAt(0).guided, finish = cfgAt(5).guided
const vectorColor = (g: number) => g === 0 ? colors.unconditional : g === 1 ? colors.classifier : colors.guided
const regime = computed(() => gamma.value === 0 ? 'Unconditional' : gamma.value === 1 ? 'Conditional' : gamma.value < 1 ? 'Interpolation' : 'Extrapolation')
</script>
<template>
  <DemoPanel data-demo="cfg-extrapolation" :data-gamma="gamma" :data-guided="scores.guided.join(',')" :data-regime="regime">
    <div class="control-space">
      <div v-if="!isPrintMode" class="demo-controls"><label><L8Math formula="\gamma" /><input v-model.number="state.gamma" aria-label="CFG guidance scale" type="range" min="0" max="5" step=".1" /><output>{{ state.gamma.toFixed(1) }}</output></label><button v-for="g in [0,.5,1,3]" :key="g" :aria-label="`Guidance scale ${g}`" :aria-pressed="state.gamma===g" @click="state.gamma=g"><L8Math :formula="`\\gamma=${g}`" /></button><button class="demo-reset" @click="state.gamma=1">Reset</button></div>
      <div v-else class="print-context">Same two scores: <L8Math formula="\gamma=0" />, <L8Math formula="\gamma=1" /> and <L8Math formula="\gamma=3" />.</div>
    </div>
    <div class="cfg-grid">
      <div>
        <svg viewBox="0 0 620 340" class="cfg-plane" role="img" aria-label="Score-space geometry: guided score endpoints lie on the line through unconditional and conditional endpoints; gamma greater than one extrapolates">
          <defs><marker v-for="(color,i) in [colors.unconditional,colors.classifier,colors.guided]" :key="i" :id="`${id}-${i}`" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0L10 5L0 10z" :fill="color" /></marker></defs>
          <rect x="26" y="14" width="570" height="294" fill="white" stroke="#bbced8" />
          <line x1="26" :y1="py(0)" x2="596" :y2="py(0)" stroke="#e1e8ed" /><line :x1="px(0)" y1="14" :x2="px(0)" y2="308" stroke="#e1e8ed" />
          <line :x1="px(start[0])" :y1="py(start[1])" :x2="px(finish[0])" :y2="py(finish[1])" stroke="#a7bdc6" stroke-width="2" stroke-dasharray="6 5" />
          <line :x1="px(start[0])" :y1="py(start[1])" :x2="px(examples[1].guided[0])" :y2="py(examples[1].guided[1])" stroke="#007f82" stroke-width="4" opacity=".3" />
          <g v-for="(example,i) in examples.slice(0,isPrintMode ? 3 : 2)" :key="i"><line :x1="px(0)" :y1="py(0)" :x2="px(example.guided[0])" :y2="py(example.guided[1])" :stroke="vectorColor(example.gamma)" stroke-width="3" :marker-end="`url(#${id}-${i})`" /><circle :cx="px(example.guided[0])" :cy="py(example.guided[1])" r="5" :fill="vectorColor(example.gamma)" /></g>
          <line v-if="!isPrintMode" :x1="px(0)" :y1="py(0)" :x2="px(scores.guided[0])" :y2="py(scores.guided[1])" :stroke="colors.guided" stroke-width="4" :marker-end="`url(#${id}-2)`" />
          <circle :cx="px(scores.guided[0])" :cy="py(scores.guided[1])" r="7" :fill="colors.guided" stroke="white" stroke-width="2" />
          <circle :cx="px(0)" :cy="py(0)" r="5" fill="#17324d" /><text :x="px(0)-14" :y="py(0)+24" text-anchor="end">0</text>
          <foreignObject v-for="example in examples.slice(0,isPrintMode ? 3 : 2)" :key="example.gamma" :x="px(example.guided[0])+10" :y="py(example.guided[1])+(example.gamma===0 ? -36 : 5)" width="95" height="34"><div :style="{color:vectorColor(example.gamma)}"><L8Math :formula="`\\gamma=${example.gamma}`" /></div></foreignObject>
          <text x="596" y="334" text-anchor="end">Score space · endpoints of vectors</text>
        </svg>
        <div class="demo-note plot-note">The two base scores are fixed; <L8Math formula="\gamma" /> moves the guided endpoint along their line.</div>
      </div>
      <div class="explanation">
        <div class="regime" :style="{color:colors.guided}"><L8Math :formula="`\\gamma=${gamma.toFixed(1)}`" /> · {{ regime }}</div>
        <div :style="{color:colors.unconditional}"><b><L8Math formula="\gamma=0" /></b><L8Math formula="\bs_t^0=\bs_t(\bx_t,\varnothing)" /></div>
        <div :style="{color:colors.classifier}"><b><L8Math formula="\gamma=1" /></b><L8Math formula="\bs_t^1=\bs_t(\bx_t,\by)" /></div>
        <div :style="{color:colors.guided}"><b><L8Math formula="\gamma>1" /></b><span>Continue beyond the conditional endpoint.</span></div>
        <div class="demo-note condition-note"><L8Math formula="\varnothing" /> denotes no condition. Analytic toy scores at one fixed observation and noise level.</div>
      </div>
    </div>
    <div class="demo-takeaway">For <L8Math formula="\gamma>1" />, CFG extrapolates beyond the conditional score.</div>
  </DemoPanel>
</template>
<style scoped>
.control-space{height:50px}
label{display:flex;align-items:center;gap:12px}
input{width:270px;min-height:44px;accent-color:#007f82}
output{width:38px;font-variant-numeric:tabular-nums}
.print-context{text-align:center;padding-top:11px;color:#587083}
.cfg-grid{display:grid;grid-template-columns:620px 1fr;gap:35px}
.cfg-plane{display:block;width:620px;height:340px}
.cfg-plane text{font:18px Arial;fill:#587083}
.cfg-plane foreignObject{font-size:20px}
.plot-note{text-align:center;margin-top:7px}
.explanation{padding-top:16px;font-size:21px}
.regime{font-size:24px;margin-bottom:23px}
.explanation>div:not(.regime):not(.condition-note){margin-bottom:21px}
.explanation b,.explanation>div:not(.regime):not(.condition-note)>span{display:block}
.explanation b{margin-bottom:6px}
.condition-note{margin-top:14px;line-height:1.4}
.demo-takeaway{margin-top:10px}

</style>
