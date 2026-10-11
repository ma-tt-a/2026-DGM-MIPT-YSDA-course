<script setup lang="ts">
import { computed } from 'vue'
import { langevinDensity, langevinScore, langevinMarginal, langevinConfig, xHistogram } from '../lib/geometry-demos.mjs'
type Point = { x: number; y: number }
const props = defineProps<{ simulation: { step: number; points: Point[]; trails: Point[][] }; compact?: boolean; plotId: string }>()
const px = (x: number) => 290 + 55 * x
const py = (y: number) => 155 - 55 * y
const path = (points: Point[]) => points.map((p, i) => `${i ? 'L' : 'M'}${px(p.x).toFixed(2)},${py(p.y).toFixed(2)}`).join(' ')
const contours: string[] = []
for (const level of [.015, .04, .09, .14]) {
  let segment: Point[] = []
  const flush = () => {
    if (segment.length > 1) contours.push(path([...segment, ...segment.toReversed().map(p => ({ x: p.x, y: -p.y }))]) + ' Z')
    segment = []
  }
  for (let i = 0; i <= 360; i++) {
    const x = -4.5 + i * .025, density = langevinDensity(x, 0)
    if (density >= level) segment.push({ x, y: langevinConfig.sigma * Math.sqrt(2 * Math.log(density / level)) })
    else flush()
  }
  flush()
}
const arrows = [-3.6, -2.7, -1.8, -.9, 0, .9, 1.8, 2.7, 3.6].flatMap(x => [-1.8, -.9, 0, .9, 1.8].map(y => {
  const score = langevinScore({ x, y }), norm = Math.hypot(score.x, score.y)
  if (norm < .01) return null
  const scale = Math.min(17 / norm, 12)
  return { x: px(x), y: py(y), dx: score.x * scale, dy: -score.y * scale }
})).filter(Boolean)
const histogram = computed(() => xHistogram(props.simulation.points))
const maxDensity = computed(() => Math.max(.4, ...histogram.value.bins.map(b => b.density * 1.08)))
const hx = (x: number) => 40 + (x + 4.5) / 9 * 480
const hy = (density: number) => 133 - density / maxDensity.value * 102
const targetPath = computed(() => Array.from({ length: 241 }, (_, i) => {
  const x = -4.5 + i * 9 / 240
  return `${i ? 'L' : 'M'}${hx(x).toFixed(2)},${hy(langevinMarginal(x)).toFixed(2)}`
}).join(' '))
const outside = computed(() => props.simulation.points.filter(p => Math.abs(p.x) > 4.5 || Math.abs(p.y) > 2.5).length)
</script>

<template>
  <div class="langevin-plot" :class="{ compact }">
    <div class="cloud">
      <svg viewBox="0 0 580 322" role="img" aria-label="Particles move in the exact score vector field of a two-Gaussian mixture">
        <defs>
          <clipPath :id="`${plotId}-clip`"><rect x="42.5" y="17.5" width="495" height="275" /></clipPath>
          <marker :id="`${plotId}-arrow`" viewBox="0 0 8 8" refX="6" refY="4" markerWidth="4" markerHeight="4" orient="auto"><path d="M 0 0 L 7 4 L 0 8" fill="none" stroke="#9aaeb9" stroke-width="1.4" /></marker>
        </defs>
        <rect x="42.5" y="17.5" width="495" height="275" fill="#fbfcfd" stroke="#dce5eb" />
        <g :clip-path="`url(#${plotId}-clip)`">
          <path v-for="(contour, i) in contours" :key="i" :d="contour" fill="#007f82" style="fill-opacity: .045" stroke="#a7c7c6" stroke-width="1.2" />
          <line v-for="(arrow, i) in arrows" :key="i" :x1="arrow.x-arrow.dx/2" :y1="arrow.y-arrow.dy/2" :x2="arrow.x+arrow.dx/2" :y2="arrow.y+arrow.dy/2" stroke="#9aaeb9" stroke-width="1.2" :marker-end="`url(#${plotId}-arrow)`" />
          <path v-for="(trail, i) in simulation.trails" :key="i" :d="path(trail)" fill="none" stroke="#e17838" stroke-width="1.5" style="stroke-opacity: .75" />
          <circle v-for="(point, i) in simulation.points" :key="i" :cx="px(point.x)" :cy="py(point.y)" r="2.6" :fill="i < 4 ? '#e17838' : '#8854c0'" style="fill-opacity: .75" />
        </g>
        <text v-for="x in [-4, -2, 0, 2, 4]" :key="x" :x="px(x)" y="315" text-anchor="middle">{{ x }}</text>
        <text x="550" y="315">x₁</text><text x="11" y="29">x₂</text>
        <text v-for="y in [-2, 0, 2]" :key="y" x="33" :y="py(y)+6" text-anchor="end">{{ y }}</text>
      </svg>
      <div class="plot-note">{{ outside ? `${outside} / ${simulation.points.length} particles outside this view.` : `${simulation.points.length} particles · trails of four particles` }}</div>
    </div>
    <div class="histogram">
      <div class="hist-title">Distribution of the first coordinate</div>
      <svg viewBox="0 0 550 166" role="img" aria-label="Empirical particle histogram and exact target marginal density; the vertical scale is labeled">
        <text x="40" y="20">density</text>
        <line x1="40" y1="28" x2="40" y2="133" class="axis" /><line x1="40" y1="133" x2="525" y2="133" class="axis" />
        <text x="33" y="139" text-anchor="end">0</text><text x="33" y="38" text-anchor="end">{{ maxDensity.toFixed(1) }}</text>
        <rect v-for="(bin,i) in histogram.bins" :key="i" :x="hx(bin.x)+.5" :y="hy(bin.density)" :width="bin.width/9*480-1" :height="133-hy(bin.density)" fill="#8854c0" style="fill-opacity: .45" />
        <path :d="targetPath" stroke="#007f82" stroke-width="3" fill="none" />
        <text v-for="x in [-4, -2, 0, 2, 4]" :key="x" :x="hx(x)" y="159" text-anchor="middle">{{ x }}</text><text x="529" y="159">x₁</text>
      </svg>
      <div class="hist-legend"><span class="target">━ Target density</span><span class="samples">▰ Particles</span></div>
      <div v-if="!compact" class="hist-explanation">The same initial particles and step size.<br />Only the Gaussian noise is switched.</div>
      <div class="plot-note">{{ histogram.outside ? `${histogram.outside} particles outside the histogram range. ` : '' }}Density axis adapts to the histogram.</div>
    </div>
  </div>
</template>

<style scoped>
.langevin-plot { display: grid; grid-template-columns: 660px 1fr; gap: 20px; align-items: center; }
svg { display: block; width: 100%; }
.cloud svg { height: 322px; }
.histogram svg { height: 166px; }
svg text { font: 17px Arial, sans-serif; fill: #587083; }
.axis { stroke: #bbced8; stroke-width: 1.2; }
.plot-note { color: #587083; font-size: 17px; text-align: center; }
.hist-title { color: #17324d; font-size: 20px; margin: 0 0 6px; }
.hist-legend { display: flex; gap: 22px; justify-content: center; font-size: 18px; }
.target { color: #007f82; }.samples { color: #8854c0; }
.hist-explanation { font-size: 18px; line-height: 1.45; margin: 18px 0 10px; }
.compact { display: block; }
.compact .cloud svg { height: 250px; }
.compact .cloud .plot-note { display: none; }
.compact .hist-title { display: none; }
.compact .histogram svg { height: 118px; }
.compact .histogram .plot-note { font-size: 16px; }
</style>
