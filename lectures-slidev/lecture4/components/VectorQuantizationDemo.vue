<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { useNav, useDrawings } from '@slidev/client'
import { codebook, vqInitialPoint, vqBounds, nearestCode, voronoiCells, vqCollapsePoints, vqRestartIndex, vqRestartCodebook, codeUsage } from '../lib/vq-demo.mjs'
import { vqState as state } from '../lib/vq-state'

const props = withDefaults(defineProps<{ stage?: number }>(), { stage: 0 })
const { isPrintMode } = useNav()
const { drawingEnabled } = useDrawings()
const point = computed(() => isPrintMode.value ? vqInitialPoint : state)
const selected = computed(() => nearestCode(point.value))
const codes = computed(() => props.stage >= 2 ? vqRestartCodebook : codebook)
const cells = computed(() => voronoiCells(codes.value))
const usage = computed(() => codeUsage(vqCollapsePoints, codes.value))
const used = computed(() => usage.value.filter(Boolean).length)
const beforeUsed = codeUsage(vqCollapsePoints).filter(Boolean).length
const manual = computed(() => props.stage === 0)
const active = (k: number) => manual.value ? k === selected.value.index : usage.value[k] > 0
const codeColor = (k: number) => active(k) ? '#007f82' : manual.value ? '#8854c0' : '#a9bac7'
const px = (x: number) => 60 + (x + 2) * 100
const py = (y: number) => 15 + (1.5 - y) * 100
const points = (cell: { x: number; y: number }[]) => cell.map(p => `${px(p.x)},${py(p.y)}`).join(' ')
const subscript = ['₁', '₂', '₃', '₄', '₅', '₆', '₇', '₈']
const fmt = (n: number) => (Math.abs(n) < .005 ? 0 : n).toFixed(2)
const dragging = ref<number | null>(null)
let captureElement: SVGCircleElement | null = null

function moveTo(x: number, y: number) {
  state.x = Math.max(vqBounds.xmin + .1, Math.min(vqBounds.xmax - .1, x))
  state.y = Math.max(vqBounds.ymin + .1, Math.min(vqBounds.ymax - .1, y))
}
function endDrag(event?: PointerEvent) {
  if (event && event.pointerId !== dragging.value) return
  const element = captureElement
  const pointerId = dragging.value
  dragging.value = null
  captureElement = null
  if (pointerId !== null && element?.hasPointerCapture(pointerId)) element.releasePointerCapture(pointerId)
}
function startDrag(event: PointerEvent) {
  if (!manual.value || drawingEnabled.value || isPrintMode.value || event.button !== 0 || dragging.value !== null) return
  event.preventDefault()
  event.stopPropagation()
  dragging.value = event.pointerId
  captureElement = event.currentTarget as SVGCircleElement
  captureElement.setPointerCapture(event.pointerId)
}
function moveDrag(event: PointerEvent) {
  if (!manual.value || drawingEnabled.value || dragging.value !== event.pointerId || !captureElement) return
  const svg = captureElement.ownerSVGElement
  const transform = svg?.getScreenCTM()
  if (!svg || !transform) return
  event.preventDefault()
  const cursor = svg.createSVGPoint()
  cursor.x = event.clientX
  cursor.y = event.clientY
  const local = cursor.matrixTransform(transform.inverse())
  moveTo((local.x - 60) / 100 - 2, 1.5 - (local.y - 15) / 100)
}
function moveKey(event: KeyboardEvent) {
  const directions: Record<string, [number, number]> = { ArrowLeft: [-.05, 0], ArrowRight: [.05, 0], ArrowUp: [0, .05], ArrowDown: [0, -.05] }
  if (!(event.key in directions) && event.key !== 'Home') return
  event.preventDefault()
  if (!manual.value || drawingEnabled.value || isPrintMode.value) return
  if (event.key === 'Home') moveTo(vqInitialPoint.x, vqInitialPoint.y)
  else {
    const [dx, dy] = directions[event.key]
    moveTo(state.x + dx, state.y + dy)
  }
}
watch(drawingEnabled, enabled => { if (enabled) endDrag() })
watch(isPrintMode, printing => { if (printing) endDrag() })
watch(manual, enabled => { if (!enabled) endDrag() })
onBeforeUnmount(() => endDrag())
</script>

<template>
  <div class="vq-demo" data-demo="vector-quantization" :data-stage="stage" :data-used="manual ? '' : used" :data-usage="manual ? '' : usage.join(',')" :data-x="point.x" :data-y="point.y" :data-selected="selected.index + 1" data-regions="true" @pointerdown.stop @touchstart.stop @click.stop>
    <svg class="vq-plane" viewBox="0 0 560 345" role="group" :aria-label="manual ? 'Vector quantization: drag the encoder output to its nearest code.' : `Toy dataset: ${used} of eight codes used${stage >= 2 ? ' after restarting the unused code e4' : ''}.`" @pointermove="moveDrag" @pointerup="endDrag" @pointercancel="endDrag">
      <defs><marker id="vq-restart-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M 0 0 L 10 5 L 0 10 z" fill="#8854c0" /></marker></defs>
      <rect x="60" y="15" width="400" height="300" fill="white" stroke="#bbced8" />
      <g data-voronoi-regions>
        <polygon v-for="(cell, k) in cells" :key="k" :points="points(cell)" :fill="active(k) ? '#eaf4f3' : '#f7f9fa'" stroke="#a9bac7" stroke-width="1.3" />
      </g>
      <line x1="60" y1="165" x2="460" y2="165" stroke="#dbe3e9" />
      <line x1="260" y1="15" x2="260" y2="315" stroke="#dbe3e9" />
      <g v-for="tick in [-2, -1, 0, 1, 2]" :key="`x${tick}`"><line :x1="px(tick)" y1="315" :x2="px(tick)" y2="320" stroke="#587083" /><text :x="px(tick)" y="340" text-anchor="middle">{{ tick }}</text></g>
      <g v-for="tick in [-1, 0, 1]" :key="`y${tick}`"><line x1="55" :y1="py(tick)" x2="60" :y2="py(tick)" stroke="#587083" /><text x="45" :y="py(tick) + 6" text-anchor="end">{{ tick }}</text></g>
      <text x="485" y="340">z₁</text><text x="30" y="20">z₂</text>
      <g :style="{ opacity: manual ? 0 : 1 }" :aria-hidden="manual" data-encoder-cloud>
        <circle v-for="(sample, i) in vqCollapsePoints" :key="i" :cx="px(sample.x)" :cy="py(sample.y)" r="4" fill="#e17838" />
      </g>
      <g :style="{ opacity: stage >= 2 ? 1 : 0 }" :aria-hidden="stage < 2" data-restart-path>
        <circle :cx="px(codebook[vqRestartIndex].x)" :cy="py(codebook[vqRestartIndex].y)" r="9" fill="white" stroke="#8854c0" stroke-width="2" stroke-dasharray="3 2" />
        <path :d="`M ${px(codebook[vqRestartIndex].x) - 12} ${py(codebook[vqRestartIndex].y) - 12} Q 340 85 ${px(vqRestartCodebook[vqRestartIndex].x) + 10} ${py(vqRestartCodebook[vqRestartIndex].y) - 12}`" fill="none" stroke="#8854c0" stroke-width="2" stroke-dasharray="6 4" marker-end="url(#vq-restart-arrow)" />
        <text :x="px(codebook[vqRestartIndex].x) + 18" :y="py(codebook[vqRestartIndex].y) - 13" fill="#8854c0">old e₄</text>
      </g>
      <g v-for="(code, k) in codes" :key="k" :data-code="k + 1" :data-count="manual ? '' : usage[k]">
        <circle :style="{ opacity: manual && k === selected.index ? 1 : 0 }" :cx="px(code.x)" :cy="py(code.y)" r="14" fill="none" stroke="#007f82" stroke-width="2.5" />
        <circle :cx="px(code.x)" :cy="py(code.y)" r="7" :fill="codeColor(k)" stroke="white" stroke-width="1.5" />
        <text :x="px(code.x) + (stage >= 2 && k === vqRestartIndex ? -33 : 18)" :y="py(code.y) - 13" :fill="codeColor(k)">e{{ subscript[k] }}</text>
      </g>
      <g :style="{ opacity: manual ? 1 : 0 }" :aria-hidden="!manual">
        <line :x1="px(point.x)" :y1="py(point.y)" :x2="px(selected.code.x)" :y2="py(selected.code.y)" stroke="#007f82" stroke-width="3" />
        <circle class="encoder-handle" data-encoder-handle :cx="px(point.x)" :cy="py(point.y)" r="17" fill="transparent" :tabindex="isPrintMode || !manual ? -1 : 0" role="button" :aria-disabled="drawingEnabled || isPrintMode || !manual" :aria-label="`Point z at (${fmt(point.x)}, ${fmt(point.y)}), nearest code e${selected.index + 1}. Arrow keys move the point; Home resets it.`" aria-keyshortcuts="ArrowLeft ArrowRight ArrowUp ArrowDown Home" :style="{ pointerEvents: isPrintMode || drawingEnabled || !manual ? 'none' : 'all' }" @pointerdown="startDrag" @lostpointercapture="endDrag" @keydown.stop="moveKey" @keyup.stop />
        <circle :cx="px(point.x)" :cy="py(point.y)" r="8" fill="#e17838" stroke="white" stroke-width="2" pointer-events="none" />
        <text :x="px(point.x) + 14" :y="py(point.y) - 14" fill="#ba5a22" pointer-events="none">z</text>
      </g>
    </svg>
    <div class="vq-caption" :style="{ visibility: manual ? 'hidden' : 'visible' }" aria-live="polite">
      <span class="cloud-key">●</span> Encoder outputs (toy dataset)<br />
      {{ beforeUsed }}<template v-if="stage >= 2"> → {{ used }}</template> / 8 codes used
    </div>
  </div>
</template>

<style scoped>
.vq-demo { width: 100%; }
.vq-plane { display: block; width: 100%; height: auto; max-height: 340px; }
.vq-plane text { font: 21px Arial, sans-serif; }
.vq-plane text:not([fill]) { fill: #587083; }
.vq-caption { min-height: 52px; margin-top: 4px; color: #587083; font-size: 21px; line-height: 1.2; text-align: center; }
.cloud-key { color: #e17838; }
.encoder-handle { cursor: grab; touch-action: none; }
.encoder-handle:active { cursor: grabbing; }
.encoder-handle:focus-visible { outline: none; stroke: #e17838; stroke-width: 2; stroke-dasharray: 4 3; }
</style>
