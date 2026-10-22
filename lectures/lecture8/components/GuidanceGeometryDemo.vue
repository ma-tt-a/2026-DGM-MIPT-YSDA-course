<script setup lang="ts">
import { computed, onBeforeUnmount, ref, useId, watch } from 'vue'
import { useNav, useDrawings } from '@slidev/client'
import L8Math from './L8Math.vue'
import { bounds, colors, gammaPresets, guidanceAt, guidanceScaleAt, initialPoint, mixtureAt, modes } from '../lib/guidance-demos.mjs'
import { geometryState as state } from '../lib/demo-state'
const { isPrintMode } = useNav(), { drawingEnabled } = useDrawings()
const current = computed(() => isPrintMode.value ? { ...initialPoint, label: 1, gamma: 3 } : state)
const scores = computed(() => guidanceAt(current.value, current.value.label, current.value.gamma))
const contribution = computed(() => scores.value.classifier.map((v: number) => current.value.gamma * v))
const scale = computed(() => guidanceScaleAt(current.value))
const classes = [{ name: 'A', color: '#264c70' }, { name: 'B', color: '#697a89' }]
const arrows = computed(() => [
  { name: 'Unconditional score', formula: '\\bs_t(\\bx_t)', color: colors.unconditional, vector: scores.value.unconditional },
  { name: 'Classifier contribution', formula: '\\gamma\\nabla_{\\bx_t}\\log p(\\by|\\bx_t)', color: colors.classifier, vector: contribution.value },
  { name: 'Guided score', formula: '\\bs_t^\\gamma(\\bx_t,\\by)', color: colors.guided, vector: scores.value.guided },
])
const id = `guidance-${useId().replace(/[^a-z0-9-]/gi, '')}`
const px = (x: number) => 302 + x * 76, py = (y: number) => 158 - y * 70
const end = (vector: number[]) => ({ x: px(current.value.x + scale.value * vector[0]), y: py(current.value.y + scale.value * vector[1]) })
const cells = Array.from({ length: 35 * 22 }, (_, i) => {
  const x = -3.35 + (i % 35) * 6.7 / 35, y = -1.95 + Math.floor(i / 35) * 3.9 / 22
  return { x, y, opacity: Math.min(.88, Math.sqrt(mixtureAt({ x, y }).density) * 1.4) }
})
const fmt = (v: number) => (Math.abs(v) < .005 ? 0 : v).toFixed(2)
const dragging = ref<number | null>(null)
let handle: SVGCircleElement | null = null
function reset() { Object.assign(state, initialPoint, { label: 1, gamma: 1 }) }
function moveTo(x: number, y: number) {
  state.x = Math.max(bounds.xmin, Math.min(bounds.xmax, x)); state.y = Math.max(bounds.ymin, Math.min(bounds.ymax, y))
}
function endDrag() {
  const pointer = dragging.value, element = handle
  dragging.value = null; handle = null
  if (pointer !== null && element?.hasPointerCapture(pointer)) element.releasePointerCapture(pointer)
}
function startDrag(event: PointerEvent) {
  if (drawingEnabled.value || isPrintMode.value || event.button !== 0 || dragging.value !== null) return
  event.preventDefault(); event.stopPropagation(); dragging.value = event.pointerId
  handle = event.currentTarget as SVGCircleElement; handle.setPointerCapture(event.pointerId)
}
function moveDrag(event: PointerEvent) {
  if (drawingEnabled.value || dragging.value !== event.pointerId || !handle) return
  const svg = handle.ownerSVGElement, transform = svg?.getScreenCTM()
  if (!svg || !transform) return
  const cursor = svg.createSVGPoint(); cursor.x = event.clientX; cursor.y = event.clientY
  const local = cursor.matrixTransform(transform.inverse()); moveTo((local.x - 302) / 76, (158 - local.y) / 70)
}
function moveKey(event: KeyboardEvent) {
  const directions: Record<string, number[]> = { ArrowLeft: [-.05, 0], ArrowRight: [.05, 0], ArrowUp: [0, .05], ArrowDown: [0, -.05] }
  if (!(event.key in directions) && event.key !== 'Home') return
  event.preventDefault()
  if (drawingEnabled.value || isPrintMode.value) return
  if (event.key === 'Home') Object.assign(state, initialPoint)
  else { const [dx, dy] = directions[event.key]; moveTo(state.x + dx, state.y + dy) }
}
watch(drawingEnabled, enabled => { if (enabled) endDrag() }); watch(isPrintMode, printing => { if (printing) endDrag() })
onBeforeUnmount(endDrag)
</script>
<template>
  <DemoPanel data-demo="guidance-geometry" :data-x="current.x" :data-y="current.y" :data-label="current.label" :data-gamma="current.gamma" :data-probability="scores.probability" :data-guided="scores.guided.join(',')">
    <div class="control-space">
      <div v-if="!isPrintMode" class="demo-controls">
        <span>Target class</span><button v-for="label in [0,1]" :key="label" :aria-pressed="state.label===label" @click="state.label=label">{{ label===0 ? 'A' : 'B' }}</button>
        <label><L8Math formula="\gamma" /><input v-model.number="state.gamma" aria-label="Geometry guidance scale" type="range" min="0" max="7" step=".1" /><output>{{ state.gamma.toFixed(1) }}</output></label>
        <button v-for="gamma in gammaPresets" :key="gamma" @click="state.gamma=gamma" :aria-pressed="state.gamma===gamma">{{ gamma }}</button>
        <button class="demo-reset" @click="reset">Reset</button>
      </div>
      <div v-else class="print-context">Fixed observation · target class B · γ = 3.</div>
    </div>
    <div class="geometry-grid">
      <div>
        <svg viewBox="0 0 600 320" class="geometry-plane" role="group" aria-label="Gaussian mixture density and three score vectors from a movable noisy observation" @pointermove="moveDrag" @pointerup="endDrag" @pointercancel="endDrag">
          <defs><marker v-for="(arrow,i) in arrows" :key="i" :id="`${id}-${i}`" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0L10 5L0 10z" :fill="arrow.color" /></marker></defs>
          <rect x="47" y="21" width="510" height="274" fill="white" stroke="#bbced8" />
          <rect v-for="(cell,i) in cells" :key="i" :x="px(cell.x)" :y="py(cell.y+3.9/22)" :width="6.7/35*76+.2" :height="3.9/22*70+.2" fill="#9bbdbd" :opacity="cell.opacity" />
          <line x1="47" :y1="py(0)" x2="557" :y2="py(0)" stroke="#dce5eb" /><line :x1="px(0)" y1="21" :x2="px(0)" y2="295" stroke="#dce5eb" />
          <g v-for="x in [-3,-2,-1,0,1,2,3]" :key="x"><text :x="px(x)" y="316" text-anchor="middle">{{ x }}</text></g>
          <g v-for="y in [-1,0,1]" :key="y"><text x="35" :y="py(y)+6" text-anchor="end">{{ y }}</text></g>
          <g v-for="(mode,i) in modes" :key="i" :fill="classes[mode.label].color" stroke="white" stroke-width="2">
            <rect v-if="mode.label===0" :x="px(mode.mean[0])-6" :y="py(mode.mean[1])-6" width="12" height="12" />
            <path v-else :d="`M${px(mode.mean[0])} ${py(mode.mean[1])-8}l8 8-8 8-8-8z`" />
          </g>
          <line :x1="end(scores.unconditional).x" :y1="end(scores.unconditional).y" :x2="end(scores.guided).x" :y2="end(scores.guided).y" :stroke="colors.classifier" stroke-dasharray="5 4" stroke-width="2" />
          <line v-for="(arrow,i) in arrows" :key="i" :data-score-arrow="['unconditional','classifier','guided'][i]" :x1="px(current.x)" :y1="py(current.y)" :x2="end(arrow.vector).x" :y2="end(arrow.vector).y" :stroke="arrow.color" :stroke-width="i===2 ? 4 : 2.8" :marker-end="Math.hypot(...arrow.vector)>.01 ? `url(#${id}-${i})` : undefined" />
          <circle data-observation-handle class="observation-handle" :cx="px(current.x)" :cy="py(current.y)" r="19" fill="transparent" :tabindex="isPrintMode ? -1 : 0" role="button" aria-label="Noisy observation. Drag or use arrow keys; Home resets." :aria-disabled="drawingEnabled || isPrintMode" :style="{pointerEvents:drawingEnabled || isPrintMode ? 'none' : 'all'}" @pointerdown="startDrag" @lostpointercapture="endDrag" @keydown.stop="moveKey" @keyup.stop />
          <circle :cx="px(current.x)" :cy="py(current.y)" r="6" fill="#e17838" stroke="white" stroke-width="2" pointer-events="none" />
          <foreignObject :x="px(current.x)+12" :y="py(current.y)+4" width="55" height="35" pointer-events="none"><L8Math formula="\bx_t" /></foreignObject>
        </svg>
        <div class="plot-key">
          <span v-for="(label,i) in classes" :key="label.name" class="class-key"><svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true" :fill="label.color"><rect v-if="i===0" x="2" y="2" width="12" height="12" /><path v-else d="M8 0l8 8-8 8-8-8z" /></svg>Class {{ label.name }} centers</span>
          <span class="orange">● Observation</span>
        </div>
        <div class="demo-note plot-note">{{ isPrintMode ? 'Gaussian component centers and the marginal density.' : 'Drag the orange point. Shading shows the marginal density.' }}</div>
      </div>
      <div class="explanation">
        <div v-for="arrow in arrows" :key="arrow.name" class="vector-readout" :style="{color:arrow.color}"><b>{{ arrow.name }}</b><L8Math :formula="arrow.formula" /><output>({{ arrow.vector.map(fmt).join(', ') }})</output></div>
        <div class="probability"><L8Math formula="p(\by|\bx_t)" /> = {{ scores.probability.toFixed(3) }}</div>
        <div class="demo-note">Exact toy scores at a fixed noise level. At this point, the common scale is fixed across γ and classes.</div>
      </div>
    </div>
    <div class="demo-takeaway">Guidance adds a class-directed correction to the unconditional score.</div>
  </DemoPanel>
</template>
<style scoped>
.control-space{height:58px}
.demo-controls{gap:9px}
.demo-controls>span{font-size:18px}
label{display:flex;align-items:center;gap:10px;margin-left:12px}
input{width:170px;min-height:44px;accent-color:#007f82}
output{font-variant-numeric:tabular-nums}
label output{width:35px}
.print-context{text-align:center;padding-top:11px;color:#587083}
.geometry-grid{display:grid;grid-template-columns:600px 1fr;gap:26px}
.geometry-plane{display:block;width:600px;height:320px}
.geometry-plane text{font:18px Arial;fill:#587083}
.plot-key{display:flex;justify-content:center;gap:30px;font-size:18px;margin-top:4px}
.class-key{display:flex;align-items:center;gap:7px;color:#587083}
.orange{color:#e17838}
.plot-note{text-align:center;margin-top:8px}
.explanation{padding-top:20px}
.vector-readout{display:grid;grid-template-columns:1fr auto;gap:5px;margin-bottom:19px;font-size:20px}
.vector-readout b{grid-column:1/-1;font-size:21px}
.probability{font-size:21px;margin:22px 0 14px}
.explanation>.demo-note{line-height:1.4}
.demo-takeaway{margin-top:13px}
.observation-handle{cursor:grab;touch-action:none}
.observation-handle:active{cursor:grabbing}
.observation-handle:focus-visible{outline:none;stroke:#e17838;stroke-width:2;stroke-dasharray:4 3}

</style>
