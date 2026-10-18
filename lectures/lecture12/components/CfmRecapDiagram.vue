<script setup lang="ts">
import ConditionalPathDiagram from '../../lecture11/components/ConditionalPathDiagram.vue'
import EndpointPathDemo from '../../lecture11/components/EndpointPathDemo.vue'
import FlowPathsDemo from '../../lecture11/components/FlowPathsDemo.vue'
defineProps<{kind:'construction'|'cones'|'comparison'}>()
</script>
<template>
 <ConditionalPathDiagram v-if="kind==='construction'" :stage="2" />
 <EndpointPathDemo v-else-if="kind==='cones'" static-view class="recap-visual" />
 <FlowPathsDemo v-else compare static-view class="recap-visual" />
</template>
<style scoped>
.recap-visual{margin-top:32px}
</style>
