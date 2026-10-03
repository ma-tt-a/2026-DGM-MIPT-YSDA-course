<script setup lang="ts">
import { colors as c, patchPoint, patchVelocity, path } from '../lib/dynamics-demos.mjs'
defineProps<{ t: number, mode: string, compact?: boolean }>()
const px = (x: number) => 190+70*x, py = (y: number) => 140-70*y
const corners=[[-.5,-.5],[.5,-.5],[.5,.5],[-.5,.5],[-.5,-.5]]
const grid=Array.from({length:49},(_,i)=>[-1.5+i%7*.5,-1.5+Math.floor(i/7)*.5])
</script>
<template>
  <svg :viewBox="compact ? '40 30 300 220' : '0 0 380 280'" role="img" :aria-label="`${mode}: material patch, initial square, and velocity field`">
    <g v-for="(p,i) in grid" :key="i" :stroke="c.grid" stroke-width="1.4"><line :x1="px(p[0])" :y1="py(p[1])" :x2="px(p[0]+.22*patchVelocity(p,mode)[0])" :y2="py(p[1]+.22*patchVelocity(p,mode)[1])" /><circle :cx="px(p[0]+.22*patchVelocity(p,mode)[0])" :cy="py(p[1]+.22*patchVelocity(p,mode)[1])" r="2" :fill="c.grid" /></g>
    <path :d="path(corners,px,py)" fill="none" :stroke="c.muted" stroke-width="1.5" stroke-dasharray="5 4" />
    <path :d="path(corners.map(p=>patchPoint(p,t,mode)),px,py)" fill="#007f8220" :stroke="c.teal" stroke-width="3" />
    <template v-for="a in [-.3,-.1,.1,.3]" :key="a"><path :d="path([[-.5,a],[.5,a]].map(p=>patchPoint(p,t,mode)),px,py)" :stroke="c.teal" opacity=".4" /><path :d="path([[a,-.5],[a,.5]].map(p=>patchPoint(p,t,mode)),px,py)" :stroke="c.teal" opacity=".4" /></template>
    <circle v-for="(p,i) in corners.slice(0,4)" :key="i" :cx="px(patchPoint(p,t,mode)[0])" :cy="py(patchPoint(p,t,mode)[1])" r="4" :fill="c.teal" />
    <text v-if="!compact" x="190" y="269" text-anchor="middle">Same probability mass = 1</text>
  </svg>
</template>
