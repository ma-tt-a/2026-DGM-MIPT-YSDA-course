import { reactive } from 'vue'
import { observationPresets } from './score-demos.mjs'

// Keep exploration when the slide is unmounted during navigation.
export const tweedieState = reactive({ x: observationPresets[0].x, y: observationPresets[0].y })
export const diffusionState = reactive({ t: 0 })
