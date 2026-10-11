<script setup lang="ts">
import L4Math from './L4Math.vue'
// Schematic code indices: equal colors denote equal codebook vectors.
const indices = [1, 1, 4, 4, 1, 2, 4, 3, 2, 2, 3, 3]
const colors = ['#dbe9f0', '#b8d9d6', '#ddcff1', '#f4d7b9']
</script>

<template>
  <div class="vq-spatial-path" data-spatial-vq>
    <svg viewBox="0 0 1160 230" role="img" aria-label="An encoder tensor with W by H vectors of L channels is quantized to a W by H index map. A shared codebook lookup restores W by H vectors of L channels for the decoder.">
      <defs><marker id="vq-spatial-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M 0 0 L 10 5 L 0 10 z" fill="#587083" /></marker></defs>
      <text x="180" y="28" text-anchor="middle">Encoder outputs</text>
      <text x="580" y="28" text-anchor="middle">Code map</text>
      <text x="980" y="28" text-anchor="middle">Decoder inputs</text>
      <g v-for="layer in [2, 1, 0]" :key="`encoder-${layer}`">
        <rect v-for="i in 12" :key="i" :x="106 + ((i - 1) % 4) * 30 + layer * 12" :y="80 + Math.floor((i - 1) / 4) * 26 - layer * 10" width="30" height="26" :fill="i === 3 ? '#e17838' : ['#dbe9f0', '#c6dbe7', '#aecbdc'][layer]" stroke="#587083" stroke-width="1.2" />
      </g>
      <g v-for="(code, i) in indices" :key="`index-${i}`">
        <rect :x="508 + (i % 4) * 36" :y="61 + Math.floor(i / 4) * 33" width="36" height="33" :fill="colors[code - 1]" :stroke="i === 2 ? '#e17838' : '#587083'" :stroke-width="i === 2 ? 3 : 1.2" />
        <text :x="526 + (i % 4) * 36" :y="85 + Math.floor(i / 4) * 33" text-anchor="middle">{{ code }}</text>
      </g>
      <g v-for="layer in [2, 1, 0]" :key="`decoder-${layer}`">
        <rect v-for="(code, i) in indices" :key="i" :x="906 + (i % 4) * 30 + layer * 12" :y="80 + Math.floor(i / 4) * 26 - layer * 10" width="30" height="26" :fill="colors[code - 1]" :stroke="i === 2 ? '#e17838' : '#587083'" :stroke-width="i === 2 ? 2.5 : 1.2" />
      </g>
      <g stroke="#587083" stroke-width="2.5" marker-end="url(#vq-spatial-arrow)">
        <line x1="310" y1="118" x2="453" y2="118" />
        <line x1="707" y1="118" x2="850" y2="118" />
      </g>
      <text x="381" y="94" text-anchor="middle">Nearest code</text>
      <text x="780" y="94" text-anchor="middle">Lookup</text>
      <foreignObject x="725" y="136" width="120" height="42"><div class="math-node"><L4Math formula="\be_{c_{ij}}" /></div></foreignObject>
      <foreignObject x="15" y="183" width="330" height="44"><div class="math-node"><L4Math formula="\bz_e\in\bbR^{W\times H\times L}" /></div></foreignObject>
      <foreignObject x="415" y="183" width="330" height="44"><div class="math-node"><L4Math formula="\bc\in\{1,\dots,K\}^{W\times H}" /></div></foreignObject>
      <foreignObject x="815" y="183" width="330" height="44"><div class="math-node"><L4Math formula="\bz_q\in\bbR^{W\times H\times L}" /></div></foreignObject>
    </svg>
  </div>
</template>

<style scoped>
.vq-spatial-path { width: 100%; margin: 12px auto; }
svg { display: block; width: 100%; height: 230px; }
svg text { fill: #17324d; font: 22px Arial, sans-serif; }
.math-node { color: #17324d; font-size: 24px; text-align: center; }
</style>
