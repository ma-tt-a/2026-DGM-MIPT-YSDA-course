import { readFileSync, existsSync } from 'node:fs'
import { createHash } from 'node:crypto'
import { resolve } from 'node:path'
import katex from 'katex'
import { lecturePaths, root, readSlides, checkSectionSchedule } from './course.mjs'
const paths = lecturePaths(process.argv[2])
const md = readFileSync(paths.entry, 'utf8')
const slides = readSlides(paths)
const fail = message => { throw new Error(message) }
const ids = slides.map(s => s.id)
if (ids.some(id => typeof id !== 'string' || !id.trim()) || new Set(ids).size !== ids.length)
  fail('Slide IDs must be nonempty and unique')
for (const slide of slides) {
  if (slide.title === 'Recap of Previous Lecture'
      && (slide.clicks !== 0 || /v-(?:click|after)\b/.test(slide.content)))
    fail(`Recap must be fully visible on slide ${slide.slide}`)
}
const readme = readFileSync(resolve(root, '../README.md'), 'utf8').split('\n').find(l => l.includes(`<b>Lecture ${paths.number}:</b>`))
checkSectionSchedule(slides, readme)
const assets = [...md.matchAll(/<img\b[^>]*\bsrc="([^"]+)"/g)]
const provenancePath = resolve(paths.dir, 'public/figs/sources.json')
const provenance = existsSync(provenancePath) ? JSON.parse(readFileSync(provenancePath, 'utf8')) : {}
for (const [tag] of md.matchAll(/<TaxonomyDiagram\b[^>]*\/>/g))
  assets.push([tag, `../theme/assets/${/\babsorbing-diffusion\b/.test(tag) ? 'taxonomy-absorb.svg' : /\bdiscrete-diffusion\b/.test(tag) ? 'taxonomy-dd.svg' : /\bflow-matching\b/.test(tag) ? 'taxonomy-fm.svg' : /\bsde-based-diffusion\b/.test(tag) ? 'taxonomy-sde.svg' : /\bcontinuous-normalizing-flow\b/.test(tag) ? 'taxonomy-ode.svg' : /\bdenoising-diffusion\b/.test(tag) ? 'taxonomy-ddpm.svg' : /\bscore-matching\b/.test(tag) ? 'taxonomy-sm.svg' : /\bgenerative-adversarial-network\b/.test(tag) ? 'taxonomy-gan.svg' : /\bvariational-autoencoder\b/.test(tag) ? 'taxonomy-vae.svg' : /\bnormalizing-flow\b/.test(tag) ? 'taxonomy-nf.svg' : /\bautoregressive\b/.test(tag) ? 'taxonomy-ar.svg' : 'taxonomy.svg'}`])
for (const [,src] of assets) {
  const local = src.startsWith('/figs/')
  if (!local && !src.startsWith('../theme/assets/')) fail(`Unexpected image location: ${src}`)
  const target = local ? resolve(paths.dir, 'public', src.slice(1)) : resolve(paths.dir, src)
  if (!existsSync(target)) fail(`Missing asset ${src}`)
  if (local) {
    const file = src.slice('/figs/'.length)
    const hash=f=>createHash('sha256').update(readFileSync(f)).digest('hex')
    const credit = provenance[file]
    if (credit) {
      if (!credit?.source?.startsWith('https://') || !credit.description) fail(`Missing provenance for new image: ${file}`)
      if (hash(target) !== credit.sha256) fail(`New image differs from recorded source: ${file}`)
      if (!md.includes(`href="${credit.source}"`)) fail(`Missing source citation for new image: ${file}`)
    }
  }
}
if (/\\(?:mathbf|boldsymbol|mathcal|mathbb)\b/.test(md)) fail('Raw notation in lecture; use shared macros')
if (/<img[^>]+src="https?:/.test(md)) fail('Remote image dependency')
const macros = JSON.parse(readFileSync(resolve(root, 'theme/setup/macros.json'), 'utf8'))
for (const [name, value] of Object.entries(macros)) {
  if (!name.startsWith('\\') || typeof value !== 'string') fail(`Invalid macro ${name}`)
  katex.renderToString(name, { macros, strict: 'error', throwOnError: true })
}
console.log(`${paths.name}: ${slides.length} slides, ${slides.reduce((n, s) => n + s.clicks + 1, 0)} browser states; ${assets.length} image uses and ${Object.keys(macros).length} macros checked.`)
