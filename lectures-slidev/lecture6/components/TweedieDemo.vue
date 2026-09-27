<script setup lang="ts">
import { computed, onBeforeUnmount, ref, useId, watch } from 'vue'
import { useNav, useDrawings } from '@slidev/client'
import { cleanPoints, observationPresets, observationBounds, posteriorAt } from '../lib/score-demos.mjs'
import { tweedieState as state } from '../lib/demo-state'

const props = withDefaults(defineProps<{ stage?: number }>(), { stage: 0 })
const { isPrintMode } = useNav()
const { drawingEnabled } = useDrawings()
const point = computed(() => isPrintMode.value ? observationPresets[0] : state)
const posterior = computed(() => posteriorAt(point.value))
const id = `tweedie-${useId().replace(/[^a-z0-9-]/gi, '')}`
const colors = ['#8854c0', '#b58a25', '#487faa']
const px = (x: number) => 290 + x * 93
const py = (y: number) => 160 - y * 93
const fmt = (v: number) => (Math.abs(v) < .005 ? 0 : v).toFixed(2)
function choose(p: { x: number; y: number }) { state.x = p.x; state.y = p.y }
function moveTo(x: number, y: number) {
  state.x = Math.max(observationBounds.xmin, Math.min(observationBounds.xmax, x))
  state.y = Math.max(observationBounds.ymin, Math.min(observationBounds.ymax, y))
}
const dragging = ref<number | null>(null)
let handle: SVGCircleElement | null = null
function endDrag() {
  const pointer = dragging.value, element = handle
  dragging.value = null; handle = null
  if (pointer !== null && element?.hasPointerCapture(pointer)) element.releasePointerCapture(pointer)
}
function startDrag(event: PointerEvent) {
  if (drawingEnabled.value || isPrintMode.value || event.button !== 0 || dragging.value !== null) return
  event.preventDefault(); event.stopPropagation()
  dragging.value = event.pointerId; handle = event.currentTarget as SVGCircleElement
  handle.setPointerCapture(event.pointerId)
}
function moveDrag(event: PointerEvent) {
  if (drawingEnabled.value || dragging.value !== event.pointerId || !handle) return
  const svg = handle.ownerSVGElement, transform = svg?.getScreenCTM()
  if (!svg || !transform) return
  event.preventDefault()
  const cursor = svg.createSVGPoint(); cursor.x = event.clientX; cursor.y = event.clientY
  const local = cursor.matrixTransform(transform.inverse())
  moveTo((local.x - 290) / 93, (160 - local.y) / 93)
}
function moveKey(event: KeyboardEvent) {
  const directions: Record<string, [number, number]> = { ArrowLeft: [-.05, 0], ArrowRight: [.05, 0], ArrowUp: [0, .05], ArrowDown: [0, -.05] }
  if (!(event.key in directions) && event.key !== 'Home') return
  event.preventDefault()
  if (drawingEnabled.value || isPrintMode.value) return
  if (event.key === 'Home') choose(observationPresets[0])
  else { const [dx, dy] = directions[event.key]; moveTo(state.x + dx, state.y + dy) }
}
watch(drawingEnabled, enabled => { if (enabled) endDrag() })
watch(isPrintMode, printing => { if (printing) endDrag() })
onBeforeUnmount(endDrag)
</script>

<template>
  <DemoPanel class="tweedie-demo" data-demo="tweedie" :data-stage="stage" :data-x="point.x" :data-y="point.y" :data-weights="posterior.weights.join(',')" :data-mean-x="posterior.mean.x" :data-mean-y="posterior.mean.y" :data-score-x="posterior.score.x" :data-score-y="posterior.score.y">
    <div class="control-space">
      <div v-if="!isPrintMode" class="demo-controls">
        <button v-for="p in observationPresets" :key="p.label" :aria-pressed="Math.abs(point.x-p.x)<1e-8 && Math.abs(point.y-p.y)<1e-8" @click="choose(p)">{{ p.label }}</button>
        <span class="demo-note">Drag the orange observation.</span>
        <button class="demo-reset" @click="choose(observationPresets[0])">Reset</button>
      </div>
      <div v-else class="print-context">Fixed noisy observation between the clean-data modes.</div>
    </div>
    <div class="tweedie-grid">
      <div>
        <svg class="tweedie-plane" viewBox="0 0 580 325" role="group" aria-label="Conditional scores from a noisy observation to three clean points, their posterior-weighted average, and the posterior mean" @pointermove="moveDrag" @pointerup="endDrag" @pointercancel="endDrag">
          <defs>
            <marker v-for="(color, i) in [...colors, '#007f82']" :key="i" :id="`${id}-${i}`" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" :fill="color" /></marker>
          </defs>
          <rect x="48" y="10" width="484" height="290" fill="white" stroke="#bbced8" />
          <line x1="48" :y1="py(0)" x2="532" :y2="py(0)" stroke="#e1e8ed" />
          <line :x1="px(0)" y1="10" :x2="px(0)" y2="300" stroke="#e1e8ed" />
          <g v-for="x in [-2,-1,0,1,2]" :key="`x${x}`"><text :x="px(x)" y="322" text-anchor="middle">{{ x }}</text></g>
          <g v-for="y in [-1,0,1]" :key="`y${y}`"><text x="35" :y="py(y)+6" text-anchor="end">{{ y }}</text></g>
          <g v-for="(p, i) in cleanPoints" :key="i">
            <line :x1="px(point.x)" :y1="py(point.y)" :x2="px(p.x)" :y2="py(p.y)" :stroke="colors[i]" stroke-width="2.5" :opacity="stage >= 1 ? .2 + .8*posterior.weights[i] : .8" :marker-end="`url(#${id}-${i})`" />
            <circle :cx="px(p.x)" :cy="py(p.y)" r="7" :fill="colors[i]" stroke="white" stroke-width="1.5" />
            <foreignObject :x="px(p.x)+12" :y="py(p.y)-35" width="55" height="35"><div class="point-label" :style="{ color: colors[i] }"><L6Math :formula="`\\bx_${i+1}`" /></div></foreignObject>
          </g>
          <g :style="{ visibility: stage >= 2 ? 'visible' : 'hidden' }" data-marginal-arrow>
            <line :x1="px(point.x)" :y1="py(point.y)" :x2="px(posterior.mean.x)" :y2="py(posterior.mean.y)" stroke="#007f82" stroke-width="4" :marker-end="`url(#${id}-3)`" />
          </g>
          <g :style="{ visibility: stage >= 3 ? 'visible' : 'hidden' }" data-posterior-mean>
            <rect :x="px(posterior.mean.x)-7" :y="py(posterior.mean.y)-7" width="14" height="14" fill="#007f82" stroke="white" stroke-width="2" />
          </g>
          <circle class="observation-handle" data-observation-handle :cx="px(point.x)" :cy="py(point.y)" r="19" fill="transparent" :tabindex="isPrintMode ? -1 : 0" role="button" aria-label="Noisy observation. Arrow keys move; Home resets." :aria-disabled="drawingEnabled || isPrintMode" :style="{ pointerEvents: drawingEnabled || isPrintMode ? 'none' : 'all' }" @pointerdown="startDrag" @lostpointercapture="endDrag" @keydown.stop="moveKey" @keyup.stop />
          <circle :cx="px(point.x)" :cy="py(point.y)" r="7" fill="#e17838" stroke="white" stroke-width="2" pointer-events="none" />
          <foreignObject :x="px(point.x)+(point.x>1.9 ? -46 : 12)" :y="py(point.y)+(point.y<-.9 ? -35 : 5)" width="55" height="35" pointer-events="none"><div class="point-label orange"><L6Math formula="\bx_\sigma" /></div></foreignObject>
        </svg>
        <div class="plot-key"><span class="orange">●</span> Noisy observation <span :style="{ visibility: stage >= 3 ? 'visible' : 'hidden' }"><span class="teal">■</span> Posterior mean</span></div>
      </div>
      <div class="explanation">
        <div class="explanation-step">
          <b>Conditional scores</b>
          <L6Math formula="\nabla_{\bx_\sigma}\log q(\bx_\sigma|\bx_i)=(\bx_i-\bx_\sigma)/\sigma^2" />
        </div>
        <div class="explanation-step" :style="{ visibility: stage >= 1 ? 'visible' : 'hidden' }" data-posterior-weights>
          <b>Posterior weights</b>
          <div class="weights"><div v-for="(w,i) in posterior.weights" :key="i" :style="{ '--point-color': colors[i] }"><L6Math :formula="`q(\\bx_${i+1}|\\bx_\\sigma)`" /><div class="weight-track"><div :style="{ width: `${100*w}%` }" /></div><output>{{ (100*w).toFixed(1) }}%</output></div></div>
        </div>
        <div class="explanation-step" :style="{ visibility: stage >= 2 ? 'visible' : 'hidden' }" data-marginal-formula>
          <b>Marginal score = posterior-weighted average</b>
          <L6Math formula="\nabla_{\bx_\sigma}\log q(\bx_\sigma)=\sum_i q(\bx_i|\bx_\sigma)\frac{\bx_i-\bx_\sigma}{\sigma^2}" />
        </div>
        <div class="explanation-step" :style="{ visibility: stage >= 3 ? 'visible' : 'hidden' }" data-tweedie-formula>
          <b>Tweedie: from the score to the clean-data mean</b>
          <L6Math formula="\bbE[\bx|\bx_\sigma]=\bx_\sigma+\sigma^2\nabla_{\bx_\sigma}\log q(\bx_\sigma)" />
          <div class="mean-readout">Posterior mean: ({{ fmt(posterior.mean.x) }}, {{ fmt(posterior.mean.y) }})</div>
        </div>
      </div>
    </div>
    <div class="demo-takeaway" :style="{ visibility: stage >= 3 ? 'visible' : 'hidden' }">The MSE-optimal denoised prediction can lie between the clean-data modes.</div>
  </DemoPanel>
</template>

<style scoped>
.control-space { height: 54px; }
.demo-controls { margin-bottom: 8px; }
.demo-controls .demo-note { margin-left: 12px; }
.print-context { color: #587083; padding: 10px 0; }
.tweedie-grid { display: grid; grid-template-columns: 560px 1fr; gap: 22px; }
.tweedie-plane { display: block; width: 560px; height: 314px; }
.tweedie-plane text { font: 20px Arial, sans-serif; }
.tweedie-plane text:not([fill]) { fill: #587083; }
.point-label { font-size: 20px; }
.plot-key { display: flex; gap: 24px; justify-content: center; color: #587083; font-size: 18px; margin-top: 4px; }
.plot-key > span:first-child { margin-right: -18px; }
.orange { color: #e17838; } .teal { color: #007f82; }
.explanation { padding-top: 2px; }
.explanation-step { margin-bottom: 11px; }
.explanation-step b { display: block; color: #007f82; font-size: 20px; margin-bottom: 5px; }
.explanation-step > span { display: block; font-size: 19px; }
.weights { display: flex; gap: 16px; }
.weights > div { flex: 1; color: var(--point-color); font-size: 18px; }
.weight-track { height: 5px; background: #edf1f5; margin: 7px 0 3px; }
.weight-track > div { height: 5px; background: var(--point-color); }
.weights output { font-variant-numeric: tabular-nums; }
.mean-readout { color: #587083; font-size: 18px; margin-top: 5px; }
.demo-takeaway { margin-top: 12px; font-size: 22px; }
.observation-handle { cursor: grab; touch-action: none; }
.observation-handle:active { cursor: grabbing; }
.observation-handle:focus-visible { outline: none; stroke: #e17838; stroke-width: 2; stroke-dasharray: 4 3; }
</style>
