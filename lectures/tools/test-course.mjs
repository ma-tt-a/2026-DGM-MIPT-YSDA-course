import assert from 'node:assert/strict'
import { test } from 'node:test'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { PDFDocument } from 'pdf-lib'
import { lecturePaths, root, parseSlides, readSlides, checkSectionSchedule } from './course.mjs'

test('slide parsing respects YAML, code fences and notes', () => {
  const slides = parseSlides(`---\nid: first\nclicks: 2\n---\n# First\n\n\`\`\`text\n---\n\`\`\`\n\n<!-- speaker note -->\n\n---\nid: second\nclicks: 0\n---\n# Second\n`)
  assert.equal(slides.length, 2)
  assert.equal(slides[0].clicks, 2)
  assert.equal(slides[1].title, 'Second')
  assert.equal(slides[1].id, 'second')
  assert.throws(() => parseSlides('---\nclicks: -1\n---\n# Bad'), /Invalid clicks/)
})

test('schedule check uses section transitions, not ordinary slide titles', () => {
  const slides = [{ section: 'Normalizing Flows' }, { title: 'A worked example' }]
  assert.doesNotThrow(() => checkSectionSchedule(slides, '<li>Normalizing Flows</li>'))
  assert.throws(() => checkSectionSchedule(slides, '<li>Something else</li>'), /README section mismatch/)
})

test('lecture paths validate input', () => {
  assert.equal(lecturePaths('1').entry, join(root, 'lecture1/slides.md'))
  for (const value of ['../1', '01', '-1', '0', '1;echo'])
    assert.throws(() => lecturePaths(value), /Expected a lecture number/)
})

test('all course PDFs contain one page per logical slide', async () => {
  for (let number = 1; number <= 14; number++) {
    const lecture = lecturePaths(number)
    const slides = readSlides(lecture)
    assert.equal(new Set(slides.map(s => s.id)).size, slides.length)
    const pdf = await PDFDocument.load(readFileSync(join(lecture.dir, `Lecture${number}.pdf`)))
    assert.equal(pdf.getPageCount(), slides.length, lecture.name)
  }
})
