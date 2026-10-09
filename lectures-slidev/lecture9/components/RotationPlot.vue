<script setup lang="ts">
import { computed } from 'vue'
import { colors as c, path, rotation, solveRotation } from '../lib/dynamics-demos.mjs'
const props = defineProps<{ steps: number, count: number }>()
const solution = computed(() => solveRotation(props.steps, props.count))
const px = (x: number) => 48 + (x + 1.7) * 100, py = (y: number) => 280 - (y + .4) * 100
const exact = Array.from({ length: 101 }, (_, i) => rotation([-1, 0], -3 * i / 100))
const grid = Array.from({length: 35}, (_,i) => [-1.5 + i % 7 * .6, Math.floor(i / 7) * .5])
</script>
<template>
  <svg viewBox="0 0 560 330" role="img" aria-label="Exact rotation trajectory with Euler and Heun approximations">
    <g v-for="([x,y], i) in grid" :key="i" :stroke="c.grid" stroke-width="1.5"><line :x1="px(x)" :y1="py(y)" :x2="px(x+.075*y)" :y2="py(y-.075*x)" /><circle :cx="px(x+.075*y)" :cy="py(y-.075*x)" r="1.7" :fill="c.grid" /></g>
    <line :x1="px(-1.6)" :x2="px(2.7)" :y1="py(0)" :y2="py(0)" stroke="#bbced8" />
    <line :x1="px(0)" :x2="px(0)" :y1="py(-.3)" :y2="py(2.2)" stroke="#bbced8" />
    <text :x="px(2.65)" :y="py(0)+24">x₁</text><text :x="px(0)+10" :y="py(2.2)">x₂</text>
    <path :d="path(exact,px,py)" fill="none" :stroke="c.ink" stroke-width="2.5" stroke-dasharray="6 4" />
    <path :d="path(solution.euler,px,py)" fill="none" :stroke="c.purple" stroke-width="3" />
    <path :d="path(solution.heun,px,py)" fill="none" :stroke="c.teal" stroke-width="3" />
    <g v-for="(points,k) in [solution.euler,solution.heun]" :key="k"><circle v-for="([x,y],i) in points" :key="i" :cx="px(x)" :cy="py(y)" r="3.5" :fill="k ? c.teal : c.purple" /></g>
    <circle :cx="px(solution.exact[0])" :cy="py(solution.exact[1])" r="5" fill="white" :stroke="c.ink" stroke-width="2" />
    <text :x="px(-1)-40" :y="py(0)+23">Start</text>
  </svg>
</template>
