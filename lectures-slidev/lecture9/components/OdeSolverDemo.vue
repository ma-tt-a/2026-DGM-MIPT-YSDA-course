<script setup lang="ts">
import { computed } from 'vue'
import { useNav } from '@slidev/client'
import L9Math from './L9Math.vue'
import RotationPlot from './RotationPlot.vue'
import { solverState as state } from '../lib/demo-state'
import { solveRotation, colors as c } from '../lib/dynamics-demos.mjs'
import '../lib/demos.css'
const { isPrintMode } = useNav()
const steps = computed(() => isPrintMode.value ? 8 : state.steps)
const count = computed(() => isPrintMode.value ? 8 : state.count)
const solution = computed(() => solveRotation(steps.value, count.value))
function choose(n: number) { state.steps = n; state.count = Math.min(state.count,n) }
function reset() { state.steps = 8; state.count = 1 }
</script>
<template>
  <DemoPanel class="l9-demo solver-demo" data-demo="ode-solver" :data-steps="state.steps" :data-count="state.count">
    <div v-if="!isPrintMode" class="demo-controls l9-controls">
      <span>Steps over [0, 3]</span><button v-for="n in [4,8,16,32]" :key="n" :aria-pressed="state.steps===n" @click="choose(n)">{{ n }}</button>
      <button class="primary" @click="state.count++" :disabled="state.count===state.steps">One step</button><button @click="state.count=state.steps">Complete</button>
      <span>h = {{ solution.h.toFixed(3) }}</span><button class="demo-reset" @click="reset">Reset</button>
    </div>
    <div v-else class="print-context">Same initial point and step size: 8 steps on [0, 3], h = 0.375.</div>
    <div class="solver-body">
      <div class="solver-formulas">
        <div class="formula-label" :style="{color:c.purple}">Euler</div>
        <L9Math formula="\displaystyle\bx(t+h)=\bx(t)+h\,\bv_{\btheta}(\bx(t),t)" />
        <div class="formula-label" :style="{color:c.teal}">Heun: predict the endpoint</div>
        <L9Math formula="\displaystyle\bx'(t+h)=\bx(t)+h\,\bv_{\btheta}(\bx(t),t)" />
        <div class="formula-label" :style="{color:c.teal}">Heun: average the two velocities</div>
        <L9Math formula="\displaystyle\begin{aligned}\bx(t+h)=\bx(t)+\frac{h}{2}\bigl(&\bv_{\btheta}(\bx(t),t)\\&+\bv_{\btheta}(\bx'(t+h),t+h)\bigr)\end{aligned}" />
        <div class="solver-insight">Heun averages two velocities.<br />Twice the field evaluations per step.</div>
      </div>
      <div class="solver-plot">
        <div class="l9-legend"><span :style="{color:c.ink}">┄ Exact</span><span :style="{color:c.purple}">━ Euler</span><span :style="{color:c.teal}">━ Heun</span></div>
        <RotationPlot :steps="steps" :count="count" />
        <div class="l9-stats" title="Euclidean distance to the exact solution at the current time"><span :style="{color:c.purple}">Error {{ solution.eulerError.toFixed(3) }}</span><span :style="{color:c.teal}">Error {{ solution.heunError.toFixed(3) }}</span></div>
        <div class="cost">Step {{ count }} / {{ steps }} · Field evaluations: Euler {{ solution.eulerNfe }}, Heun {{ solution.heunNfe }}.</div>
      </div>
    </div>
    <div class="example"><L9Math formula="\text{Example: }\bv(\bx)=(x_2,-x_1),\quad\bx(0)=(-1,0),\quad t\in[0,3]." /></div>
  </DemoPanel>
</template>
<style scoped>
.solver-body{display:grid;grid-template-columns:1.1fr 1fr;gap:28px;margin-top:8px}.solver-formulas{padding-top:14px}.formula-label{font-size:22px;font-weight:650;margin:0 0 14px}.solver-formulas>span{display:block;margin-bottom:30px}.solver-formulas>span:last-of-type{margin-bottom:0}.solver-plot :deep(svg){height:320px}.l9-stats{font-size:18px}.cost{text-align:center;font-size:18px;margin-top:12px;color:#587083}.example{text-align:center;margin-top:8px}.solver-insight{font-size:20px;margin-top:14px;padding:12px 16px;background:#eaf4f3;border-left:4px solid #007f82}.print-context{height:44px;display:flex;align-items:center;justify-content:center;margin:12px 0 14px;color:#587083}
</style>
