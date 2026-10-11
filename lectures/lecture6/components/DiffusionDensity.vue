<script setup lang="ts">
import { computed } from 'vue'
import { densityPath, diffusionDensity, normalDensity } from '../lib/score-demos.mjs'
const props = withDefaults(defineProps<{ t: number; compact?: boolean; initial?: boolean }>(), { compact: false, initial: false })
const width = computed(() => props.compact ? 230 : 470)
const height = computed(() => props.compact ? 180 : 150)
const density = computed(() => densityPath(x => diffusionDensity(x, props.t), width.value, height.value))
const target = computed(() => densityPath(x => normalDensity(x), width.value, height.value))
</script>
<template>
  <svg :viewBox="`0 0 ${width+55} ${height+50}`" role="img" :aria-label="`Exact marginal density at timestep ${t}, with a standard Gaussian reference`">
    <g transform="translate(35 10)">
      <line x1="0" :y1="height" :x2="width" :y2="height" stroke="#bbced8" />
      <line x1="0" y1="0" x2="0" :y2="height" stroke="#bbced8" />
      <g v-for="tick in compact ? [-4,0,4] : [-4,-2,0,2,4]" :key="tick"><line :x1="(tick+4.5)/9*width" :y1="height" :x2="(tick+4.5)/9*width" :y2="height+6" stroke="#587083" /><text :x="(tick+4.5)/9*width" :y="height+26" text-anchor="middle">{{ tick }}</text></g>
      <g v-for="tick in [0,.3,.6]" :key="tick"><text x="-8" :y="height*(1-tick/.65)+6" text-anchor="end">{{ tick }}</text></g>
      <path :d="target" fill="none" stroke="#587083" stroke-width="2" stroke-dasharray="5 5" />
      <path :d="density" fill="none" :stroke="initial ? '#8854c0' : '#007f82'" stroke-width="3" />
    </g>
  </svg>
</template>
<style scoped>
svg { width: 100%; display: block; }
text { font: 18px Arial, sans-serif; fill: #587083; }
</style>
