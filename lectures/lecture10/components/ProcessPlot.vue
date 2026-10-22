<script setup lang="ts">
import { computed } from 'vue'
import { density, histogram, steps, T } from '../lib/process-demos.mjs'
const props=defineProps<{ trajectories:number[][], step:number, reverse?:boolean, wrong?:boolean }>()
const px=(x:number)=>35+(x+9)/18*350, py=(j:number)=>28+j/steps*68
const line=computed(()=>Array.from({length:181},(_,i)=>{const x=-9+i*.1,t=props.reverse?T*(1-props.step/steps):T*props.step/steps;return `${i?'L':'M'}${px(x)},${205-density(x,t)*150}`}).join(' '))
const bars=computed(()=>histogram(props.trajectories[props.step]))
const paths=computed(()=>Array.from({length:8},(_,i)=>props.trajectories.slice(0,props.step+1).map((row,j)=>`${j?'L':'M'}${px(row[i])},${py(j)}`).join(' ')))
</script>
<template>
<svg viewBox="0 0 420 230" role="img" :aria-label="`${reverse?'Reverse':'Forward'} trajectories and current density`">
<text x="5" y="17">t</text><text x="5" y="34">{{ reverse?2:0 }}</text><text x="5" y="100">{{ reverse?0:2 }}</text>
<text x="35" y="17">Trajectories</text><text x="365" y="17">x →</text>
<line x1="35" y1="28" x2="385" y2="28" stroke="#dbe4e9"/><line x1="35" y1="96" x2="385" y2="96" stroke="#dbe4e9"/>
<path v-for="(d,i) in paths" :key="i" :d="d" fill="none" :stroke="i===0?'#b65b20':'#8854c0'" :stroke-width="i===0?2.5:1.1" :opacity="i===0?1:.65"/>
<line x1="35" :y1="py(step)" x2="385" :y2="py(step)" stroke="#587083" stroke-dasharray="3 4"/>
<text x="35" y="125">Density at t = {{ (reverse?T*(1-step/steps):T*step/steps).toFixed(2) }}</text>
<rect v-for="(b,i) in bars" :key="i" :x="px(b.x)" :y="205-b.y*150" :width="350/48-1" :height="b.y*150" fill="#8854c0" opacity=".4"/>
<path :d="line" fill="none" stroke="#007f82" stroke-width="2.8"/><line x1="35" y1="205" x2="385" y2="205" stroke="#bbced8"/>
<text v-for="x in [-8,-4,0,4,8]" :key="x" :x="px(x)" y="228" text-anchor="middle">{{ x }}</text>
</svg>
</template>
