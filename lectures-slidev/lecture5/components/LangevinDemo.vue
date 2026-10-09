<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { useNav } from '@slidev/client'
import LangevinPlot from './LangevinPlot.vue'
import { langevinState as state } from '../lib/geometry-state'
import { advanceLangevin, initialLangevin, langevinConfig, langevinSnapshot } from '../lib/geometry-demos.mjs'
const { isPrintMode, currentSlideNo } = useNav()
const running = ref(false)
let timer: ReturnType<typeof setInterval> | undefined
const finished = computed(() => state.simulation.step >= langevinConfig.maxSteps)
const printed = [false, true].map(noise => ({ noise, simulation: langevinSnapshot(noise) }))
const cases = computed(() => isPrintMode.value ? printed : [{ noise: state.noise, simulation: state.simulation }])
function pause() { clearInterval(timer); timer = undefined; running.value = false }
function advance(steps = 1) {
  advanceLangevin(state.simulation, state.noise, steps)
  if (finished.value) pause()
}
function toggleRun() {
  if (running.value) return pause()
  if (finished.value || isPrintMode.value) return
  running.value = true
  timer = setInterval(() => advance(4), 60)
}
function reset() { pause(); state.simulation = initialLangevin() }
function choose(noise: boolean) { if (state.noise !== noise) { state.noise = noise; reset() } }
watch(currentSlideNo, pause)
onBeforeUnmount(pause)
</script>

<template>
  <DemoPanel data-demo="langevin" :class="{ 'print-demo': isPrintMode }" :data-noise="state.noise" :data-step="state.simulation.step" :data-running="running" :data-x="state.simulation.points[0].x" :data-y="state.simulation.points[0].y">
    <div v-if="!isPrintMode" class="demo-controls">
      <button @click="choose(false)" :aria-pressed="!state.noise">Noise off</button>
      <button @click="choose(true)" :aria-pressed="state.noise">Noise on</button>
      <button class="primary" @click="toggleRun" :disabled="finished">{{ running ? 'Pause' : 'Run' }}</button>
      <button @click="advance()" :disabled="running || finished">Step</button>
      <span class="step-counter" aria-live="off">Step {{ state.simulation.step }} / {{ langevinConfig.maxSteps }}</span>
      <button class="demo-reset" @click="reset">Reset</button>
    </div>
    <div class="cases">
      <div v-for="example in cases" :key="String(example.noise)" class="case">
        <div v-if="isPrintMode" class="case-title"><b>{{ example.noise ? 'Noise on: explore the density' : 'Noise off: approach the modes' }}</b><span>Step {{ example.simulation.step }}</span></div>
        <LangevinPlot :simulation="example.simulation" :compact="isPrintMode" :plot-id="`langevin-${isPrintMode ? 'print' : 'live'}-${example.noise}`" />
      </div>
    </div>
    <div v-if="!isPrintMode" class="demo-takeaway">{{ isPrintMode ? 'Without noise, particles approach the modes. With noise, they keep exploring the density.' : state.noise ? 'Noise keeps particles moving and spread around the modes.' : 'Following the score alone finds modes; it does not sample the density.' }}</div>
    <div class="demo-note bottom-note">{{ !isPrintMode ? 'Switching noise restarts the same particles. ' : '' }}Finite step size and finite simulation time give approximate sampling.</div>
  </DemoPanel>
</template>

<style scoped>
.demo-controls { margin-bottom: 4px; }
.step-counter { color: #587083; font-size: 18px; margin-left: 16px; min-width: 160px; font-variant-numeric: tabular-nums; }
.demo-takeaway { margin-top: 10px; }
.bottom-note { margin-top: 4px; }
.print-demo .cases { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; }
.case-title { display: flex; justify-content: space-between; align-items: center; color: #007f82; margin-bottom: 4px; }
.case-title span { color: #587083; font-size: 18px; }
.print-demo .demo-takeaway { margin-top: 12px; }
</style>
