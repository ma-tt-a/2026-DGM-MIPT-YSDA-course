<script setup lang="ts">
import { sources, targets, pairingCost } from '../lib/demos.mjs'
defineProps<{ pairing: number[], label: string }>()
const y = (x: number) => 130 - 34 * x
const colors = ['#007f82','#8854c0','#e17838','#3377aa','#936c36','#b34967']
</script>
<template>
<svg viewBox="0 0 320 260" role="img" :aria-label="label" :data-cost="pairingCost(pairing)" :data-pairing="pairing.join(',')">
  <text x="160" y="22" text-anchor="middle">{{label}}</text>
  <line x1="55" y1="35" x2="55" y2="215" stroke="#bbced8"/><line x1="265" y1="35" x2="265" y2="215" stroke="#bbced8"/>
  <line v-for="(j,i) in pairing" :key="i" x1="55" :y1="y(sources[i])" x2="265" :y2="y(targets[j])" :stroke="colors[i]" stroke-width="2" opacity=".7"/>
  <circle v-for="(x,i) in sources" :key="`s${i}`" cx="55" :cy="y(x)" r="5" :fill="colors[i]"/>
  <circle v-for="(x,j) in targets" :key="`t${j}`" cx="265" :cy="y(x)" r="5" fill="#17324d"/>
  <text x="55" y="233" text-anchor="middle">x₀</text><text x="265" y="233" text-anchor="middle">x₁</text>
  <text x="160" y="255" text-anchor="middle">Σ squared distances = {{pairingCost(pairing).toFixed(2)}}</text>
</svg>
</template>
<style scoped>svg{display:block;width:100%;height:260px}text{font:18px Arial;fill:#587083}</style>
