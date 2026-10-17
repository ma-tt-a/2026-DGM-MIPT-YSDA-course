<script setup lang="ts">
import { computed, ref, watch, onBeforeUnmount, useId } from 'vue'
import { useNav, useDrawings } from '@slidev/client'
import { conditionalVelocities, cloudCenters, cloudSigma, posteriorWeight, averageVelocity } from '../lib/cfm-demos.mjs'
import { posteriorState as state } from '../lib/demo-state'
const { isPrintMode } = useNav()
const { drawingEnabled } = useDrawings()
const point = computed(() => isPrintMode.value ? [0,0] : [state.x,state.y])
const weight = computed(() => posteriorWeight(point.value))
const velocity = computed(() => averageVelocity(weight.value))
const colors = ['#8854c0','#b58a25']
const id = `velocity-${useId().replace(/[^a-z0-9-]/gi, '')}`
const px = (x: number) => 240 + 65*x
const py = (y: number) => 145 - 65*y
const handle = ref<SVGCircleElement|null>(null)
let pointer: number|null = null
function setPoint(x: number,y=0) { state.x=Math.max(-2.3,Math.min(2.3,x));state.y=Math.max(-.6,Math.min(.6,y)) }
function end() { const h=handle.value,p=pointer;handle.value=null;pointer=null;if(p!==null&&h?.hasPointerCapture(p))h.releasePointerCapture(p) }
function start(e: PointerEvent) { if(drawingEnabled.value||isPrintMode.value||e.button!==0)return;e.preventDefault();handle.value=e.currentTarget as SVGCircleElement;pointer=e.pointerId;handle.value.setPointerCapture(pointer) }
function move(e: PointerEvent) { if(drawingEnabled.value||pointer!==e.pointerId||!handle.value)return;const svg=handle.value.ownerSVGElement,ctm=svg?.getScreenCTM();if(!svg||!ctm)return;const p=svg.createSVGPoint();p.x=e.clientX;p.y=e.clientY;const q=p.matrixTransform(ctm.inverse());setPoint((q.x-240)/65,(145-q.y)/65) }
function key(e: KeyboardEvent) { if(drawingEnabled.value||isPrintMode.value)return;const delta:Record<string,number[]>={ArrowLeft:[-.1,0],ArrowRight:[.1,0],ArrowUp:[0,.1],ArrowDown:[0,-.1]};if(e.key==='Home'){e.preventDefault();setPoint(0)}else if(delta[e.key]){e.preventDefault();setPoint(state.x+delta[e.key][0],state.y+delta[e.key][1])} }
watch(drawingEnabled,end)
onBeforeUnmount(end)
</script>

<template>
  <DemoPanel class="posterior-demo" data-demo="posterior-velocity" :data-point="point.join(',')" :data-weight="weight" :data-marginal="velocity.join(',')">
    <div class="posterior-grid">
      <svg viewBox="0 0 480 265" role="group" aria-label="Two overlapping conditional distributions: drag the observation to change its posterior weights and marginal velocity" @pointermove="move" @pointerup="end" @pointercancel="end">
        <defs>
          <marker v-for="(color,i) in colors" :key="i" :id="`${id}-${i}`" viewBox="0 0 10 10" refX="9" refY="5" markerUnits="userSpaceOnUse" markerWidth="11" markerHeight="11" orient="auto"><path d="M0 0L10 5L0 10z" :fill="color"/></marker>
          <marker :id="`${id}-mean`" viewBox="-2 -2 14 14" refX="9" refY="5" markerUnits="userSpaceOnUse" markerWidth="18" markerHeight="18" orient="auto"><path d="M0 0L10 5L0 10z" fill="#007f82" stroke="white" stroke-width="1.2" stroke-linejoin="round"/></marker>
        </defs>
        <g v-for="(c,i) in cloudCenters" :key="`cloud-${i}`">
          <circle v-for="r in [1.6,1,.5]" :key="r" :cx="px(c[0])" :cy="py(c[1])" :r="65*cloudSigma*r" :style="{fill:colors[i],fillOpacity:.09}"/>
          <foreignObject :x="px(c[0])-70" y="8" width="140" height="38"><div class="cloud-label" :style="{color:colors[i]}"><L11Math :formula="`p_t(\\bx|z=${i+1})`"/></div></foreignObject>
        </g>
        <g v-for="(v,i) in conditionalVelocities" :key="i">
          <line :x1="px(cloudCenters[i][0])" :y1="py(0)" :x2="px(cloudCenters[i][0]+v[0])" :y2="py(v[1])" :stroke="colors[i]" stroke-width="3" :marker-end="`url(#${id}-${i})`"/>
          <foreignObject :x="px(cloudCenters[i][0]+v[0])+(i===0?-38:12)" :y="py(v[1])-32" width="42" height="35"><div class="vector-label" :style="{color:colors[i]}"><L11Math :formula="`\\bv_${i+1}`"/></div></foreignObject>
        </g>
        <line :x1="px(point[0])" :y1="py(point[1])" :x2="px(point[0]+velocity[0])" :y2="py(point[1]+velocity[1])" stroke="white" stroke-width="11" stroke-linecap="round"/>
        <line data-marginal-arrow :x1="px(point[0])" :y1="py(point[1])" :x2="px(point[0]+velocity[0])" :y2="py(point[1]+velocity[1])" stroke="#007f82" stroke-width="6" :marker-end="`url(#${id}-mean)`"/>
        <foreignObject :x="px(point[0])+18" :y="py(point[1])-34" width="40" height="36" pointer-events="none"><div class="vector-label marginal"><L11Math formula="\bv"/></div></foreignObject>
        <circle data-handle :cx="px(point[0])" :cy="py(point[1])" r="18" fill="transparent" :tabindex="isPrintMode?-1:0" role="button" aria-label="Move observation with arrow keys; Home resets" :style="{pointerEvents:drawingEnabled||isPrintMode?'none':'auto'}" @pointerdown.stop="start" @lostpointercapture="end" @keydown.stop="key"/>
        <circle :cx="px(point[0])" :cy="py(point[1])" r="6" fill="#17324d" stroke="white" stroke-width="2" pointer-events="none"/>
        <foreignObject :x="px(point[0])-13" :y="py(point[1])+10" width="40" height="32" pointer-events="none"><div class="point-label"><L11Math formula="\bx"/></div></foreignObject>
        <text x="240" y="260" text-anchor="middle" class="plot-note">Each cloud translates with a constant velocity.</text>
      </svg>
      <div class="explanation">
        <div class="definition">Equal priors, fixed time: which cloud is more likely at <L11Math formula="\bx"/>?</div>
        <div class="weights">
          <span :style="{color:colors[0]}"><L11Math formula="p_t(z=1|\bx)"/> = {{Math.round(weight*100)}}%</span>
          <span :style="{color:colors[1]}"><L11Math formula="p_t(z=2|\bx)"/> = {{Math.round((1-weight)*100)}}%</span>
        </div>
        <div class="average"><L11Math :formula="`\\bv=${weight.toFixed(2)}\\,\\bv_1+${(1-weight).toFixed(2)}\\,\\bv_2`"/></div>
        <div v-if="!isPrintMode" class="demo-controls">
          <button @click="setPoint(-1.4)">Near cloud 1</button>
          <button @click="setPoint(1.4)">Near cloud 2</button>
          <button class="demo-reset" @click="setPoint(0)">Reset</button>
        </div>
        <div class="takeaway">Move <L11Math formula="\bx"/> → change the posterior → change the velocity.</div>
      </div>
    </div>
  </DemoPanel>
</template>

<style scoped>
.posterior-grid{display:grid;grid-template-columns:480px 1fr;gap:24px;align-items:center}.posterior-grid svg{width:480px;height:265px}.vector-label{font-size:25px;line-height:1.4}.cloud-label{font-size:21px;text-align:center}.marginal{color:#007f82;text-shadow:0 0 3px white,0 0 3px white}.point-label{font-size:22px}.plot-note{font-size:17px;fill:#587083}.definition{font-size:20px;color:#587083;margin-bottom:16px}.weights{display:flex;gap:28px;font-size:21px}.demo-controls{margin:16px 0 12px;gap:12px}.average{font-size:27px;color:#007f82;margin-top:16px}.takeaway{font-size:20px;color:#007f82;margin-top:12px}[data-handle]{cursor:grab;touch-action:none}[data-handle]:active{cursor:grabbing}[data-handle]:focus-visible{stroke:#e17838;stroke-width:2;outline:none}
</style>
