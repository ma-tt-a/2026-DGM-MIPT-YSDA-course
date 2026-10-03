import { reactive } from 'vue'
import { initialPoint } from './guidance-demos.mjs'
export const geometryState = reactive({ ...initialPoint, label: 1, gamma: 1 })
export const densityState = reactive({ label: 1, gamma: 1 })
export const cfgState = reactive({ gamma: 1 })
