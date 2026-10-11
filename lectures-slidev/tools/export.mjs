import { existsSync, mkdirSync, readFileSync, copyFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { PDFDocument } from 'pdf-lib'
import { lecturePaths, root, runSlidev, readSlides } from './course.mjs'
const lecture = lecturePaths(process.argv[2])
const map = readSlides(lecture)
const browser = [process.env.SLIDEV_BROWSER_PATH, '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', '/Applications/Yandex.app/Contents/MacOS/Yandex'].filter(Boolean).find(existsSync)
const staging = resolve(root, 'output/pdf', lecture.name)
mkdirSync(staging, { recursive: true })
const temporary = resolve(staging, 'slides.pdf')
const args = ['export', lecture.entry, '--output', temporary, '--timeout', '120000']
if (browser) args.push('--executable-path', browser)
runSlidev(lecture, args)
const pdf = await PDFDocument.load(readFileSync(temporary))
if (pdf.getPageCount() !== map.length)
  throw new Error(`Expected ${map.length} pages, got ${pdf.getPageCount()}`)
// Publish only after the export succeeds and its page count matches the source.
const target = resolve(lecture.dir, `Lecture${lecture.number}.pdf`)
copyFileSync(temporary, target)
console.log(`Saved ${target}`)
