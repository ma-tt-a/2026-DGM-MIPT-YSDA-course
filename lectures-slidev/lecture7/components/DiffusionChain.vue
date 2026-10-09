<script setup lang="ts">
import { useId } from 'vue'
const props=withDefaults(defineProps<{mode?:'forward'|'reverse'|'elbo';stage?:number}>(),{mode:'forward',stage:0})
const id=`chain-${useId().replace(/[^a-z0-9-]/gi,'')}`
const nodes=[80,320,560,800,1040], labels=['\\bx_0','\\bx_1','\\bx_2','\\cdots','\\bx_T']
const color=(i:number)=>props.mode==='forward'?(props.stage>=2?'#007f82':'#587083'):props.mode==='elbo'?(i===0?(props.stage>=1?'#808000':'#bbced8'):(props.stage>=3?'#007f82':'#bbced8')):i===0?(props.stage>=2?'#007f82':'#587083'):(props.stage>=3?'#8854c0':'#587083')
</script>
<template>
  <svg class="diffusion-chain" viewBox="0 0 1120 175" role="img" :aria-label="mode==='forward'?'Fixed forward encoder from observed data through the latent trajectory':mode==='reverse'?'Reverse chain: decoder from x one to x zero; the remaining reverse transitions and terminal Gaussian form the latent prior':'ELBO: reconstruction at the data end, prior matching at the noise end, denoising between adjacent latent states'" :data-chain="mode" :data-stage="stage">
    <defs><marker v-for="i in [0,1,2,3]" :key="i" :id="`${id}-${i}`" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" :fill="color(i)" /></marker></defs>
    <rect x="247" y="39" width="856" height="99" rx="14" :fill="mode==='reverse' && stage>=3?'#f4eef9':'#f4f7f9'" stroke="#bbced8" stroke-dasharray="6 5" />
    <foreignObject x="252" y="3" width="850" height="34"><div class="latent-label"><L7Math formula="\bz=(\bx_1,\ldots,\bx_T)" /><span>latent trajectory</span></div></foreignObject>
    <g v-for="(x,i) in nodes.slice(0,-1)" :key="i">
      <line :x1="mode==='forward'?x+34:nodes[i+1]-34" y1="86" :x2="mode==='forward'?nodes[i+1]-37:x+37" y2="86" :stroke="color(i)" stroke-width="3" :marker-end="`url(#${id}-${i})`" />
    </g>
    <g v-for="(x,i) in nodes" :key="i">
      <circle v-if="i!==3" :cx="x" cy="86" r="29" :fill="i===0?'#eaf4f3':'white'" :stroke="i===0?'#007f82':'#587083'" stroke-width="2" />
      <foreignObject :x="x-35" y="66" width="70" height="40"><div class="node-label"><L7Math :formula="labels[i]" /></div></foreignObject>
    </g>
    <foreignObject x="6" y="143" width="155" height="30"><div class="node-label">observed data</div></foreignObject>
    <foreignObject v-if="mode==='forward'" x="250" y="143" width="850" height="32"><div class="latent-label" :style="{visibility:stage>=2?'visible':'hidden',color:'#007f82'}"><L7Math formula="q(\bz|\bx_0)" /><span>fixed encoder · add noise</span></div></foreignObject>
    <template v-if="mode==='reverse'">
      <foreignObject x="130" y="100" width="140" height="34"><div class="node-label" :style="{visibility:stage>=2?'visible':'hidden',color:'#007f82'}">decoder</div></foreignObject>
      <foreignObject x="260" y="143" width="835" height="32"><div class="latent-label" :style="{visibility:stage>=3?'visible':'hidden',color:'#8854c0'}"><L7Math formula="\pt(\bz)" /><span>learned reverse transitions + terminal</span><L7Math formula="p(\bx_T)" /></div></foreignObject>
    </template>
    <template v-if="mode==='elbo'">
      <foreignObject x="135" y="100" width="140" height="32"><div class="node-label" :style="{visibility:stage>=1?'visible':'hidden',color:'#808000'}">reconstruction</div></foreignObject>
      <foreignObject x="380" y="143" width="490" height="32"><div class="node-label" :style="{visibility:stage>=3?'visible':'hidden',color:'#007f82'}">denoising between adjacent states</div></foreignObject>
      <foreignObject x="926" y="143" width="185" height="32"><div class="node-label" :style="{visibility:stage>=2?'visible':'hidden',color:'#8854c0'}">prior matching</div></foreignObject>
    </template>
  </svg>
</template>
<style scoped>
.diffusion-chain{width:100%;height:175px;margin:4px 0}.node-label{display:flex;align-items:center;justify-content:center;height:100%;font:20px Arial;color:#17324d}.latent-label{display:flex;align-items:center;justify-content:center;gap:14px;height:100%;font:20px Arial;color:#587083}.node-label :deep(.katex),.latent-label :deep(.katex){font-size:1.12em}
</style>
