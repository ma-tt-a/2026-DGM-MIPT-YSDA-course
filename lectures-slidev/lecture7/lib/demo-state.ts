import { reactive } from 'vue'
export const reverseState = reactive({ xt: 0, known: false, selected: 0 })
export const scheduleState = reactive({ t: 500 })
export const predictionState = reactive({ output: 'noise' as 'clean' | 'noise' | 'mean', noise: .5 })
