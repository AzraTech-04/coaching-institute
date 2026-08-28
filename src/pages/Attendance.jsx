import { useState } from 'react'
import { attendanceRecords as initialRecords, attendanceStatusOptions } from '../data/attendanceData'
import { batches } from '../data/batchesData'
import { students } from '../data/studentsData'
import StatusBadge from '../components/StatusBadge'
import PageHeader from '../components/PageHeader'
import EmptyState from '../components/EmptyState'
import StatCard from '../components/StatCard'
import MarkAttendanceModal from '../components/MarkAttendanceModal'
import AttendanceDetailsDrawer from '../components/AttendanceDetailsDrawer'

const TODAY = '2026-08-19'

function getTier(percentage) {
  if (percentage >= 85) return { label: 'Healthy', text: 'text-green-700', bg: 'bg-green-50', bar: 'bg-green-500' }
  if (percentage >= 65) return { label: 'Needs Attention', text: 'text-yellow-700', bg: 'bg-yellow-50', bar: 'bg-yellow-500' }
  return { label: 'Critical', text: 'text-red-700', bg: 'bg-red-50', bar: 'bg-red-500' }
}

function computeStudentStats(studentId, records) {
  const history = records.filter((r) => r.studentId === studentId)
  const present = history.filter((r) => r.status === 'Present').length
  const absent = history.filter((r) => r.status === 'Absent').length
  const late = history.filter((r) => r.status === 'Late').length
  const leave = history.filter((r) => r.status === 'Leave').length
  const total = history.length
  const percentage = total > 0 ? Math.round((present / total) * 100) : 0
  return { present, absent, late, leave, total, percentage, tier: getTier(percentage), history }
}

function enrichRecord(record) {
  const student = students.find((s) => s.id === record.studentId)
  const batch = batches.find((b) => b.id === record.batchId)
  return {
    ...record,
    studentName: student ? student.name : 'Unknown',
    batchName: batch ? batch.name : 'Unknown',
    facultyName: batch ? batch.facultyName : 'Unassigned',
  }
}

function Attendance() {
  const [records, setRecords] = useState(initialRecords)
  const [search, setSearch] = useState('')
  const [batchFilter, setBatchFilter] = useState('All')
  const [dateFilter, setDateFilter] = useState('')
  const [facultyFilter, setFacultyFilter] = useState('All')
  const [statusFilter, setStatusFilter] = useState('All')
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedStudentId, setSelectedStudentId] = useState(null)

  const enrichedRecords = records.map(enrichRecord)

  const filteredRecords = enrichedRecords.filter((r) => {
    const matchesSearch = r.studentName.toLowerCase().includes(search.toLowerCase())
    const matchesBatch = batchFilter === 'All' || r.batchName === batchFilter
    const matchesDate = !dateFilter || r.date === dateFilter
    const matchesFaculty = facultyFilter === 'All' || r.facultyName === facultyFilter
    const matchesStatus = statusFilter === 'All' || r.status === statusFilter
    return matchesSearch && matchesBatch && matchesDate && matchesFaculty && matchesStatus
  })

  const todayRecords = records.filter((r) => r.date === TODAY)
  const totalPresent = records.filter((r) => r.status === 'Present').length
  const attendanceRate = records.length > 0 ? Math.round((totalPresent / records.length) * 100) : 0

  const stats = [
    { label: "Today's Attendance", value: todayRecords.length, change: 'Marked today', trend: 'up' },
    { label: 'Present', value: todayRecords.filter((r) => r.status === 'Present').length, change: 'Today', trend: 'up' },
    { label: 'Absent', value: todayRecords.filter((r) => r.status === 'Absent').length, change: 'Today', trend: 'down' },
    { label: 'Attendance Rate', value: `${attendanceRate}%`, change: 'Overall', trend: attendanceRate >= 75 ? 'up' : 'down' },
  ]

  function handleMarkAttendance({ batchId, date, session, statuses }) {
    const newRecords = Object.entries(statuses).map(([studentId, status], index) => ({
      id: records.length + index + 1,
      studentId: Number(studentId),
      batchId,
      date,
      session,
      status,
      submitted: true,
      submittedAt: new Date().toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: 'numeric', minute: '2-digit' }),
    }))
    setRecords([...newRecords, ...records])
  }

  const batchNames = [...new Set(batches.map((b) => b.name))]
  const facultyNames = [...new Set(batches.map((b) => b.facultyName))]

  const selectedStudent = selectedStudentId ? students.find((s) => s.id === selectedStudentId) : null
  const selectedStudentBatch = selectedStudent ? batches.find((b) => b.name === selectedStudent.batch) : null
  const selectedStudentStats = selectedStudentId ? computeStudentStats(selectedStudentId, records) : null

  return (
    <div>
      <PageHeader
        title="Attendance"
        subtitle="Monitor student attendance across batches and sessions."
        actionLabel="+ Mark Attendance"
        onAction={() => setModalOpen(true)}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((stat) => (
          <StatCard key={stat.label} label={stat.label} value={stat.value} change={stat.change} trend={stat.trend} />
        ))}
      </div>

      <div className="flex flex-col sm:flex-row flex-wrap gap-3 mb-4">
        <div className="relative flex-1 min-w-[180px]">
          <svg className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 10.5A6.5 6.5 0 114 10.5a6.5 6.5 0 0113 0z" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search student..."
            className="w-full pl-9 pr-3 py-2.5 text-sm border border-neutral-300 rounded-lg outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
          />
        </div>
        <select value={batchFilter} onChange={(e) => setBatchFilter(e.target.value)} className="px-3.5 py-2.5 text-sm border border-neutral-300 rounded-lg outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 bg-white">
          <option value="All">All Batches</option>
          {batchNames.map((b) => <option key={b} value={b}>{b}</option>)}
        </select>
        <input type="date" value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} className="px-3.5 py-2.5 text-sm border border-neutral-300 rounded-lg outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500" />
        <select value={facultyFilter} onChange={(e) => setFacultyFilter(e.target.value)} className="px-3.5 py-2.5 text-sm border border-neutral-300 rounded-lg outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 bg-white">
          <option value="All">All Faculty</option>
          {facultyNames.map((f) => <option key={f} value={f}>{f}</option>)}
        </select>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-3.5 py-2.5 text-sm border border-neutral-300 rounded-lg outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 bg-white">
          <option value="All">All Statuses</option>
          {attendanceStatusOptions.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden shadow-sm">
        {records.length === 0 ? (
          <EmptyState
            title="No attendance records yet"
            message="Mark attendance for a batch to start tracking records."
            actionLabel="+ Mark Attendance"
            onAction={() => setModalOpen(true)}
          />
        ) : filteredRecords.length === 0 ? (
          <EmptyState
            title="No matching attendance records"
            message="Try adjusting your search or filters to find what you're looking for."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-sm text-left">
              <thead className="bg-neutral-50 text-neutral-500 uppercase text-xs">
                <tr>
                  <th className="px-5 py-3">Student</th>
                  <th className="px-5 py-3">Batch</th>
                  <th className="px-5 py-3">Faculty</th>
                  <th className="px-5 py-3">Date</th>
                  <th className="px-5 py-3">Session</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3">Attendance %</th>
                  <th className="px-5 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {filteredRecords.map((record) => {
                  const rowStats = computeStudentStats(record.studentId, records)
                  return (
                    <tr
                      key={record.id}
                      className="hover:bg-neutral-50 cursor-pointer"
                      onClick={() => setSelectedStudentId(record.studentId)}
                    >
                      <td className="px-5 py-3 font-medium text-neutral-800">{record.studentName}</td>
                      <td className="px-5 py-3 text-neutral-600">{record.batchName}</td>
                      <td className="px-5 py-3 text-neutral-600">{record.facultyName}</td>
                      <td className="px-5 py-3 text-neutral-600">{record.date}</td>
                      <td className="px-5 py-3 text-neutral-600">{record.session}</td>
                      <td className="px-5 py-3"><StatusBadge status={record.status} /></td>
                      <td className="px-5 py-3">
                        <span className={`font-medium ${rowStats.tier.text}`}>{rowStats.percentage}%</span>
                      </td>
                      <td className="px-5 py-3 text-right">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation()
                            setSelectedStudentId(record.studentId)
                          }}
                          className="text-brand-600 hover:text-brand-700 font-medium text-sm"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <MarkAttendanceModal open={modalOpen} onClose={() => setModalOpen(false)} onSubmit={handleMarkAttendance} />
      {selectedStudent && (
        <AttendanceDetailsDrawer
          student={selectedStudent}
          batch={selectedStudentBatch}
          stats={selectedStudentStats}
          onClose={() => setSelectedStudentId(null)}
        />
      )}
    </div>
  )
}

export default Attendance