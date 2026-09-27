<script setup lang="ts">
import { realPoints, generatedPoints, knnRadii, membership } from '../lib/geometry-demos.mjs'
const generated = generatedPoints('missing')
const panels = ['precision', 'recall'].map(mode => {
  const reference = mode === 'precision' ? realPoints : generated
  const queries = mode === 'precision' ? generated : realPoints
  const inside = membership(queries, reference)
  return { mode, reference, queries, radii: knnRadii(reference), inside, count: inside.filter(Boolean).length }
})
const px = (x: number) => 264 + x * 80
const py = (y: number) => 65 - y * 80
const diamond = (p: { x: number; y: number }, size: number) => `${px(p.x)},${py(p.y)-size} ${px(p.x)+size},${py(p.y)} ${px(p.x)},${py(p.y)+size} ${px(p.x)-size},${py(p.y)}`
</script>

<template>
  <div class="pr-inline" data-demo="precision-recall" :data-precision="panels[0].count / panels[0].queries.length" :data-recall="panels[1].count / panels[1].queries.length">
    <div v-for="panel in panels" :key="panel.mode" class="panel">
      <div class="caption"><b>{{ panel.mode === 'precision' ? 'Precision' : 'Recall' }}</b><span>{{ panel.mode === 'precision' ? 'Test generated ◆ in real balls' : 'Test real ● in generated balls' }}</span><span class="count">{{ panel.count }} / {{ panel.queries.length }}</span></div>
      <svg viewBox="0 0 528 132" role="img" :aria-label="panel.mode === 'precision' ? 'All 18 generated points fall in real neighborhoods.' : 'Only 9 of 18 real points fall in generated neighborhoods: the right mode is missing.'">
        <circle v-for="(p,i) in panel.reference" :key="`ball-${i}`" :cx="px(p.x)" :cy="py(p.y)" :r="panel.radii[i]*80" :fill="panel.mode === 'precision' ? '#17324d' : '#8854c0'" style="fill-opacity: .04" :stroke="panel.mode === 'precision' ? '#8299ac' : '#b295cc'" stroke-width="1.2" />
        <template v-for="(p,i) in panel.reference" :key="`reference-${i}`">
          <circle v-if="panel.mode === 'precision'" :cx="px(p.x)" :cy="py(p.y)" r="3.5" fill="#17324d" />
          <polygon v-else :points="diamond(p,4)" fill="#8854c0" />
        </template>
        <template v-for="(p,i) in panel.queries" :key="`query-${i}`">
          <polygon v-if="panel.mode === 'precision'" :points="diamond(p,6)" :fill="panel.inside[i] ? '#007f82' : '#e17838'" stroke="white" stroke-width="1.2" />
          <circle v-else :cx="px(p.x)" :cy="py(p.y)" r="5" :fill="panel.inside[i] ? '#007f82' : '#e17838'" stroke="white" stroke-width="1.2" />
        </template>
      </svg>
    </div>
  </div>
</template>

<style scoped>
.pr-inline { display: grid; grid-template-columns: 1fr 1fr; gap: 36px; height: 166px; margin: 0 auto; }
.caption { display: flex; align-items: center; justify-content: space-between; gap: 8px; height: 34px; font-size: 17px; }
.caption b { color: #007f82; font-size: 20px; }
.caption span { color: #587083; }
.caption .count { font-size: 20px; color: #007f82; white-space: nowrap; }
svg { display: block; width: 100%; height: 132px; }
</style>
