import { reactive } from 'vue'
import { initialLangevin } from './geometry-demos.mjs'

// Retain exploration across Slidev's unmount/remount on navigation.
export const supportState = reactive({ theta: 1.5 })
export const langevinState = reactive({ noise: false, simulation: initialLangevin() })
