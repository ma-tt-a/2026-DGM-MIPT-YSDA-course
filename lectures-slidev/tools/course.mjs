import { existsSync, readFileSync } from 'node:fs'
import { parseSync } from '@slidev/parser'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { spawnSync } from 'node:child_process'

export const root = fileURLToPath(new URL('../', import.meta.url))

export function lecturePaths(value = '1') {
  if (!/^[1-9]\d?$/.test(String(value))) throw new Error('Expected a lecture number, e.g. npm run dev -- 1')
  const number = Number(value)
  const name = `lecture${number}`
  const dir = resolve(root, name)
  const entry = resolve(dir, 'slides.md')
  if (!existsSync(entry)) throw new Error(`${name}/slides.md does not exist`)
  return { number, name, dir, entry, port: 3030 + number }
}

export function runNode(args, cwd = root) {
  const result = spawnSync(process.execPath, args, { cwd, stdio: 'inherit' })
  if (result.error) throw result.error
  if (result.status !== 0) throw new Error(`Command failed (${result.signal || result.status}): ${args.join(' ')}`)
}

export function runSlidev(lecture, args) {
  runNode([resolve(root, 'node_modules/@slidev/cli/bin/slidev.mjs'), ...args], lecture.dir)
}

export function parseSlides(markdown) {
  return parseSync(markdown).slides.map((slide, i) => {
    const { id, clicks, section } = slide.frontmatter
    if (!Number.isInteger(clicks) || clicks < 0) throw new Error(`Invalid clicks on slide ${i + 1}`)
    return { slide: i + 1, id, title: slide.title, clicks, section, content: slide.content,
      frontmatter: slide.frontmatter }
  })
}

export function readSlides(lecture) {
  return parseSlides(readFileSync(lecture.entry, 'utf8'))
}

export function checkSectionSchedule(slides, readme) {
  for (const { section } of slides.filter(s => s.section))
    if (!readme?.includes(`<li>${section}`)) throw new Error(`README section mismatch ${section}`)
}

if (process.argv[1] === fileURLToPath(import.meta.url))
  console.log(JSON.stringify(readSlides(lecturePaths(process.argv[2]))))
