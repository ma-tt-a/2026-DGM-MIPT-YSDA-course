<script setup lang="ts">
import { computed } from 'vue'
import { useNav } from '@slidev/client'
import L5Math from './L5Math.vue'
import { supportState as state } from '../lib/geometry-state'
import { supportDistances } from '../lib/geometry-demos.mjs'
const { isPrintMode } = useNav()
const theta = computed(() => isPrintMode.value ? 1.5 : state.theta)
const values = computed(() => supportDistances(theta.value))
const px = (x: number) => 215 + x * 82
</script>

<template>
  <DemoPanel class="support-inline" data-demo="support-distances" :data-theta="theta" :data-w="values.wasserstein" :data-jsd="values.jsd" :data-kl="values.kl" :class="{ 'print-demo': isPrintMode }">
    <div class="legend"><span>━ Data: x = 0</span><span class="model">┄ Model: x = θ</span></div>
    <svg viewBox="0 0 430 132" role="img" aria-label="The model's vertical uniform support moves horizontally toward or away from the fixed data support">
      <line x1="27" y1="101" x2="411" y2="101" class="axis" />
      <text x="418" y="107">x</text>
      <line :x1="px(0)" y1="8" :x2="px(0)" y2="105" class="axis" />
      <text :x="px(0)-19" y="13">y</text>
      <text x="9" y="29">1</text><text x="9" y="106">0</text>
      <line v-for="y in [24, 49, 75]" :key="y" :x1="px(0)" :y1="y" :x2="px(theta)" :y2="y" stroke="#d7e8e8" stroke-width="1.5" />
      <line :x1="px(theta)" y1="24" :x2="px(theta)" y2="101" stroke="#8854c0" stroke-width="7" stroke-dasharray="7 4" />
      <line :x1="px(0)" y1="24" :x2="px(0)" y2="101" stroke="#17324d" stroke-width="3.5" />
      <template v-for="tick in [-2, -1, 0, 1, 2]" :key="tick"><line :x1="px(tick)" y1="101" :x2="px(tick)" y2="106" class="axis" /><text :x="px(tick)" y="127" text-anchor="middle">{{ tick }}</text></template>
    </svg>
    <div v-if="!isPrintMode" class="demo-controls">
      <label><L5Math formula="\theta" /><input aria-label="Support displacement" v-model.number="state.theta" type="range" min="-2" max="2" step=".05" /><output>{{ state.theta.toFixed(2) }}</output></label>
      <button @click="state.theta = 0" :aria-pressed="state.theta === 0">Match</button>
      <button @click="state.theta = 1.5">Reset</button>
    </div>
    <div v-else class="print-caption"><L5Math formula="\theta=1.5" /> · Slide the model toward θ = 0.</div>
  </DemoPanel>
</template>

<style scoped>
.support-inline { height: 205px; }
.legend { display: flex; justify-content: center; gap: 26px; font-size: 17px; line-height: 23px; }
.model { color: #8854c0; }
svg { display: block; width: 100%; height: 132px; }
svg text { font: 17px Arial, sans-serif; fill: #587083; }
.axis { stroke: #bbced8; stroke-width: 1.3; }
.demo-controls { justify-content: center; gap: 8px; margin: 4px 0 0; }
.demo-controls button { padding: 6px 10px; font-size: 17px; }
label { display: flex; align-items: center; gap: 8px; }
input { width: 125px; min-height: 44px; accent-color: #007f82; }
output { width: 42px; font-size: 17px; font-variant-numeric: tabular-nums; }
.print-caption { margin-top: 10px; text-align: center; font-size: 17px; color: #587083; }
</style>
