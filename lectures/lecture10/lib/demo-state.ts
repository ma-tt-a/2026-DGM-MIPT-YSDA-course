import { reactive } from 'vue'
export const forwardState = reactive({ step: 30, seed: 42, mode: 'sde' })
export const reverseState = reactive({ step: 30, seed: 42, mode: 'sde' })
export const denoiserState = reactive({ x: [0, 2.4], sigma: 2.5, ratio: .5, history: [[0, 2.4]], n: 0 })
export const pathState = reactive({ t: .5 })
