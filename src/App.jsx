import { useState } from 'react'
import GeneratorUI from './components/GeneratorUI.jsx'
import MarksheetPage from './components/MarksheetPage.jsx'
import { todayString } from './utils/grading.js'
import { normKey } from './utils/sampleCsv.js'

const DEFAULT_SUBJECTS = `Hindi
English
Maths
Science
S.Science
Computer
General Knowledge`

export default function App() {
  // ── Exam details ─────────────────────────────
  const [examType,    setExamType]    = useState('ANNUAL EXAMINATION')
  const [session,     setSession]     = useState('2025-2026')
  const [signDate,    setSignDate]    = useState(todayString)
  const [subjectsRaw, setSubjectsRaw] = useState(DEFAULT_SUBJECTS)

  // ── Data ─────────────────────────────────────
  const [students,  setStudents]  = useState([])
  const [imageMap,  setImageMap]  = useState({})
  const [generated, setGenerated] = useState(false)

  // ── UI status ────────────────────────────────
  const [dataStatus,    setDataStatus]    = useState(null)
  const [photoStatus,   setPhotoStatus]   = useState(null)
  const [subjectPreview, setSubjectPreview] = useState(null)

  // ── Parse subject list ────────────────────────
  const subjects = subjectsRaw.trim().split('\n')
    .map((s) => s.trim()).filter(Boolean)
    .map((name) => ({ name, key: normKey(name) }))

  // ── Handlers ─────────────────────────────────
  const handleGenerate = () => {
    if (!students.length || !subjects.length) return
    setGenerated(true)
  }

  const handlePrint = () => window.print()

  const handleClear = () => {
    setStudents([])
    setImageMap({})
    setGenerated(false)
    setDataStatus(null)
    setPhotoStatus(null)
    setSubjectPreview(null)
  }

  const resolvePhoto = (student) =>
    imageMap[student.roll] || imageMap[student.name] || null

  return (
    <div className="bg-slate-100 min-h-screen">

      {/* Generator UI — hidden on print */}
      <GeneratorUI
        examType={examType}         setExamType={setExamType}
        session={session}           setSession={setSession}
        signDate={signDate}         setSignDate={setSignDate}
        subjectsRaw={subjectsRaw}   setSubjectsRaw={setSubjectsRaw}
        setStudents={setStudents}
        setImageMap={setImageMap}
        onGenerate={handleGenerate}
        onPrint={handlePrint}
        onClear={handleClear}
        cardsCount={generated ? students.length : 0}
        canGenerate={students.length > 0}
        canPrint={generated && students.length > 0}
        dataStatus={dataStatus}       setDataStatus={setDataStatus}
        photoStatus={photoStatus}     setPhotoStatus={setPhotoStatus}
        subjectPreview={subjectPreview} setSubjectPreview={setSubjectPreview}
      />

      {/* Printable marksheets */}
      <div id="cards-container">
        {!generated && (
          <div className="no-print w-[210mm] mx-auto my-8 text-center text-slate-400 text-sm p-10 border-2 border-dashed border-slate-200 rounded-xl bg-white">
            <div className="text-5xl mb-2">📋</div>
            <p>Upload a student data file above to generate marksheets.</p>
          </div>
        )}

        {generated && students.map((student) => (
          <MarksheetPage
            key={student.roll || student.name}
            student={student}
            subjects={subjects}
            examType={examType}
            session={session}
            signDate={signDate}
            photoSrc={resolvePhoto(student)}
          />
        ))}
      </div>

    </div>
  )
}
