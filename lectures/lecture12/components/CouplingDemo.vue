<script setup lang="ts">
import { computed } from 'vue'
import { useNav } from '@slidev/client'
import { initialPairing, paired, otPairing, shuffledPairing } from '../lib/demos.mjs'
import { couplingState as state } from '../lib/demo-state'
import PairingPlot from './PairingPlot.vue'
const props = defineProps<{ stage: number }>()
const { isPrintMode, go, currentSlideNo } = useNav()
const labels = ['Independent', 'Paired data', 'Minibatch OT']
const mode = computed(() => Math.min(Math.max(0, props.stage - 1), state.mode < 0 ? Math.max(0, props.stage - 1) : state.mode))
const pairings = computed(() => [state.shuffle ? shuffledPairing(937 + state.shuffle) : initialPairing, paired, otPairing])
const visible = (n: number) => isPrintMode.value || props.stage >= n
function reset() { state.mode = -1; state.shuffle = 0 }
async function selectMode(index: number) {
  state.mode = index
  if (props.stage < index + 1) await go(currentSlideNo.value, index + 1)
}
</script>
<template>
<DemoPanel data-demo="coupling" :data-mode="mode" :data-stage="stage">
  <div v-if="!isPrintMode" class="live">
    <div class="descriptions">
      <p :style="{visibility:visible(1)?'visible':'hidden'}"><b>Independent:</b> sample endpoints independently.<br/>Here: random minibatch pairing.</p>
      <p :style="{visibility:visible(2)?'visible':'hidden'}"><b>Paired data:</b> use observed correspondences.<br/>Here: fixed illustrative pairs.</p>
      <p :style="{visibility:visible(3)?'visible':'hidden'}"><b>Minibatch OT:</b> minimize squared distance.<br/>Both empirical marginals stay fixed.</p>
    </div>
    <div :style="{visibility:visible(1)?'visible':'hidden'}"><PairingPlot :pairing="pairings[mode]" :label="labels[mode]"/></div>
  </div>
  <div v-else class="print-plots"><PairingPlot v-for="(label,i) in labels" :key="label" :pairing="[initialPairing,paired,otPairing][i]" :label="label"/></div>
  <div class="demo-controls" v-if="!isPrintMode" :style="{visibility:visible(1)?'visible':'hidden'}">
    <button v-for="(label,i) in labels" :key="label" :aria-pressed="mode===i" @click="selectMode(i)">{{label}}</button>
    <button :disabled="mode!==0" @click="state.shuffle++">Reshuffle</button><span class="demo-note">Six scalar endpoints per batch.</span><button class="demo-reset" @click="reset">Reset</button>
  </div>
  <div v-else class="print-context">Six scalar endpoints per batch · paired data: illustrative correspondences · only the pairing changes.</div>
</DemoPanel>
</template>
<style scoped>
.live{display:grid;grid-template-columns:1.2fr 1fr;gap:35px}.descriptions p{margin:14px 0 23px;font-size:22px}.descriptions b{color:#007f82}.print-plots{display:grid;grid-template-columns:repeat(3,1fr);gap:25px}.demo-controls{margin:8px 0 0}.print-context{height:52px;padding-top:12px;color:#587083;font-size:18px}
</style>
