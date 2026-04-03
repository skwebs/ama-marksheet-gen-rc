import * as XLSX from 'xlsx'
import { fmtDate, parseNum } from './grading.js'

/** Normalize a string to lowercase alphanumeric for flexible column matching */
const norm = (s) => String(s).toLowerCase().replace(/[^a-z0-9]/g, '')

/** Find a column header matching any of the provided variant names */
function detectCol(headers, ...variants) {
  const targets = variants.map(norm)
  return headers.find((h) => targets.includes(norm(h))) || null
}

/**
 * Parse an Excel or CSV file buffer into an array of student objects.
 * @param {ArrayBuffer} buffer
 * @param {Array<{name: string, key: string}>} subjects
 * @returns {{ students: Array, error: string|null }}
 */
export function parseStudentFile(buffer, subjects) {
  try {
    const wb = XLSX.read(new Uint8Array(buffer), { type: 'array', cellDates: true })
    const rows = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]], { defval: '' })

    if (!rows.length) return { students: [], error: 'File appears to be empty.' }

    const headers = Object.keys(rows[0])

    const cols = {
      name:       detectCol(headers, 'name', 'studentname', 'student name', 'student'),
      mother:     detectCol(headers, 'mother', 'mothersname', "mother's name", 'mothername'),
      father:     detectCol(headers, 'father', 'fathersname', "father's name", 'fathername'),
      class:      detectCol(headers, 'class', 'grade', 'std', 'classname'),
      section:    detectCol(headers, 'section', 'sec', 'div', 'division'),
      roll:       detectCol(headers, 'roll', 'rollno', 'roll no', 'rollnumber', 'roll number'),
      dob:        detectCol(headers, 'dob', 'dateofbirth', 'date of birth', 'birthdate'),
      address:    detectCol(headers, 'address', 'addr', 'residence'),
      attendance: detectCol(headers, 'attendance', 'attend', 'days', 'presentdays'),
      position:   detectCol(headers, 'position', 'rank', 'pos', 'classposition', 'class position'),
      remarks:    detectCol(headers, 'remarks', 'remark', 'comment', 'note', 'notes'),
    }

    const missing = ['name', 'mother', 'father', 'class', 'roll'].filter((k) => !cols[k])
    if (missing.length) {
      return { students: [], error: `Required columns not found: ${missing.join(', ')}` }
    }

    const students = rows
      .map((r) => {
        // Build subject marks from raw row
        const subjectMarks = {}
        subjects.forEach((s) => {
          const hdr = Object.keys(r)
          const find = (suffix) => hdr.find((h) => norm(h) === s.key + suffix) || null

          const fullCol    = find('full')
          const writtenCol = find('written')
          const oralCol    = find('oral')

          const full    = parseNum(fullCol    ? r[fullCol]    : null) || 100
          const written = parseNum(writtenCol ? r[writtenCol] : 0)
          const oral    = parseNum(oralCol    ? r[oralCol]    : 0)

          subjectMarks[s.key] = { full, written, oral }
        })

        return {
          name:        String(r[cols.name]       || '').trim(),
          mother:      String(r[cols.mother]     || '').trim(),
          father:      String(r[cols.father]     || '').trim(),
          class:       String(r[cols.class]      || '').trim(),
          section:     cols.section    ? String(r[cols.section]    || '').trim() : '',
          roll:        String(r[cols.roll]       || '').trim(),
          dob:         cols.dob        ? fmtDate(r[cols.dob])                   : '',
          address:     cols.address    ? String(r[cols.address]    || '').trim() : '',
          attendance:  cols.attendance ? String(r[cols.attendance] || '').trim() : '',
          position:    cols.position   ? String(r[cols.position]   || '').trim() : '',
          remarks:     cols.remarks    ? String(r[cols.remarks]    || '').trim() : '',
          subjectMarks,
        }
      })
      .filter((s) => s.name)

    return { students, error: null }
  } catch (err) {
    return { students: [], error: `Parse error: ${err.message}` }
  }
}

/**
 * Read a File as ArrayBuffer (Promise).
 */
export function readFileAsBuffer(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload  = (e) => resolve(e.target.result)
    reader.onerror = () => reject(new Error('File read failed'))
    reader.readAsArrayBuffer(file)
  })
}

/**
 * Read an image File as Data URL (Promise).
 */
export function readFileAsDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload  = (e) => resolve(e.target.result)
    reader.onerror = () => reject(new Error('Image read failed'))
    reader.readAsDataURL(file)
  })
}
