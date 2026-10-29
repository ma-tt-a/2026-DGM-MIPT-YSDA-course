<script setup lang="ts">
import { computed } from 'vue'
import { useNav } from '@slidev/client'
import { pathMoments, quantiles } from '../lib/demos.mjs'
import { pathState as state } from '../lib/demo-state'
const props = withDefaults(defineProps<{ compare?: boolean }>(), { compare: false })
const { isPrintMode } = useNav()
const t = computed(() => isPrintMode.value ? .5 : state.t)
const sigma = computed(() => isPrintMode.value ? .35 : state.sigma)
const panels = computed(() => props.compare
  ? [{ x0: -1.5, x1: 1.5, one: true, label: 'One-sided · width = 1 − t' }, { x0: -1.5, x1: 1.5, one: false, label: 'Two-sided · width = σ' }]
  : [{ x0: -1.5, x1: 1.5, one: false, label: '−1.5 → 1.5' }, { x0: 1.5, x1: -1.5, one: false, label: '1.5 → −1.5' }, { x0: .8, x1: .8, one: false, label: '0.8 → 0.8' }])
const width = computed(() => props.compare ? 530 : 350)
const px = (s: number) => 45 + (width.value - 115) * s
const py = (x: number) => 97 - 22 * x
const moments = (p: any, s: number) => pathMoments(s, sigma.value, p.x0, p.x1, p.one)
const point = (p: any, s: number, z = 0) => { const m = moments(p, s); return `${px(s)},${py(m.mean + z * m.scale)}` }
const band = (p: any, n: number) => [point(p, 0, -n), point(p, 0, n), point(p, 1, n), point(p, 1, -n)].join(' ')
function reset() { state.t = .5; state.sigma = .35 }
</script>
<template>
<DemoPanel data-demo="conditioning" :data-t="t" :data-sigma="sigma" :data-compare="compare">
  <div class="demo-controls" v-if="!isPrintMode">
    <label>Time <input aria-label="Path time" type="range" min="0" max="1" step=".01" v-model.number="state.t"/><output>{{t.toFixed(2)}}</output></label>
    <button v-for="v in [0,.5,1]" :key="v" @click="state.t=v">{{v}}</button>
    <label>σ <input aria-label="Smoothing scale" type="range" min="0" max=".7" step=".05" v-model.number="state.sigma"/><output>{{sigma.toFixed(2)}}</output></label>
    <button class="demo-reset" @click="reset">Reset</button>
  </div>
  <div v-else class="print-context">t = 0.5 · σ = 0.35 · bands: mean ± σₜ / ± 2σₜ; center line: mean path.</div>
  <div class="plots">
    <svg v-for="(p,i) in panels" :key="i" :viewBox="`0 0 ${width} 185`" role="img" :aria-label="p.label" :data-scale="moments(p,t).scale" :data-mean="moments(p,t).mean">
      <text :x="width/2" y="20" text-anchor="middle">{{p.label}}</text>
      <line :x1="px(0)" y1="155" :x2="px(1)" y2="155" stroke="#bbced8"/>
      <text x="12" y="100">x</text>
      <polygon :points="band(p,2)" fill="#e0eeee" stroke="#82b9ba"/>
      <polygon :points="band(p,1)" fill="#abd3d4"/>
      <line :x1="px(0)" :y1="py(moments(p,0).mean)" :x2="px(1)" :y2="py(moments(p,1).mean)" stroke="#007f82" stroke-width="2"/>
      <path v-for="z in quantiles" :key="z" :d="`M${point(p,0,z)} L${point(p,1,z)}`" stroke="#007f82" opacity=".35" fill="none"/>
      <line :x1="px(t)" y1="35" :x2="px(t)" y2="155" stroke="#e17838" stroke-dasharray="4 4" stroke-width="2"/>
      <circle v-for="z in quantiles" :key="`p${z}`" :cx="px(t)" :cy="py(moments(p,t).mean+z*moments(p,t).scale)" r="4" fill="#8854c0"/>
      <circle v-for="s in [0,1]" :key="`end${s}`" :cx="px(s)" :cy="py(moments(p,s).mean)" r="4" fill="#e17838"/>
      <text :x="px(0)" y="180">0</text><text :x="px(.5)" y="180" text-anchor="middle">t</text><text :x="px(1)" y="180" text-anchor="end">1</text>
    </svg>
  </div>
  <div class="demo-note">{{sigma===0 ? 'σ = 0: the two-sided conditional path is a point mass at its moving mean.' : 'Bands: mean ± σₜ / ± 2σₜ. Fixed Gaussian quantiles; two-sided endpoints retain width σ.'}}</div>
</DemoPanel>
</template>
<style scoped>
.plots{display:flex;gap:20px}.plots svg{width:0;flex:1;height:185px;overflow:visible}.plots text{font:18px Arial;fill:#587083}.demo-controls{margin:0 0 5px;gap:12px}.demo-controls label{display:flex;align-items:center;gap:10px}.demo-controls input{width:160px}.demo-controls output{width:45px;font-variant-numeric:tabular-nums}.print-context{height:49px;font-size:18px;color:#587083;padding-top:10px}.demo-note{margin-top:5px}
</style>
