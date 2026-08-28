import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import PageHeader from '../PageHeader'
import StatCard from '../StatCard'
import StatusBadge from '../StatusBadge'
import { batches } from '../../data/batchesData'
import { faculty } from '../../data/facultyData'
import { attendanceRecords } from '../../data/attendanceData'
import { clearIdentity } from '../../utils/identity'

// Note on imports: FacultyDashboard.jsx imports from both facultyData.js and batchesData.js.
// batchesData.js already imports from facultyData.js — this is not circular because
// FacultyDashboard.jsx is a component (leaf), not a data module. No cycle is introduced.

function FacultyDashboard({ facultyId }) {
  const navigate = useNavigate()

  // Resolve the faculty member from the prop.
  // facultyId comes from currentUserId in localStorage, parsed as an integer.
  const me = faculty.find((f) => f.id === facultyId)

  // If no matching faculty member is found (missing or invalid ID), do not silently
  // display another faculty member's information. Clear identity and return to login.
  useEffect(() => {
    if (!me) {
      clearIdentity()
      navigate('/login', { replace: true })
    }
  }, [me, navigate])

  // Render nothing during the redirect — avoids a flash of broken content.
  if (!me) return null

  // Only the batches assigned to this faculty member.
  const myBatches = batches.filter((b) => b.facultyId === me.id)
  const myBatchIds = new Set(myBatches.map((b) => b.id))

  const myActiveBatches = myBatches.filter((b) => b.status === 'Active').length
  const myStudentCount = myBatches.reduce((sum, b) => sum + b.students, 0)

  // Attendance across only this faculty member's batches.
  const myAttendanceRecords = attendanceRecords.filter((r) => myBatchIds.has(r.batchId))
  const myPresentCount = myAttendanceRecords.filter((r) => r.status === 'Present').length
  const myAttendanceRate = myAttendanceRecords.length > 0
    ? Math.round((myPresentCount / myAttendanceRecords.length) * 100)
    : 0

  const stats = [
    {
      label: 'My Active Batches',
      value: myActiveBatches,
      change: `${myBatches.length} total`,
      trend: 'up',
    },
    {
      label: 'My Students',
      value: myStudentCount,
      change: 'Across my batches',
      trend: 'up',
    },
    {
      label: 'My Attendance Rate',
      value: myAttendanceRecords.length > 0 ? `${myAttendanceRate}%` : '—',
      change: 'Across my sessions',
      trend: myAttendanceRate >= 75 ? 'up' : 'down',
    },
    {
      label: 'Subject',
      value: me.subject,
      change: me.experience,
      trend: 'up',
    },
  ]

  return (
    <div>
      <PageHeader
        title={`Welcome, ${me.name}`}
        subtitle={`${me.subject} · ${myBatches.length} batch${myBatches.length !== 1 ? 'es' : ''}`}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((s) => (
          <StatCard key={s.label} label={s.label} value={s.value} change={s.change} trend={s.trend} />
        ))}
      </div>

      <div className="bg-white border border-neutral-200 rounded-xl shadow-sm overflow-hidden mb-6">
        <div className="px-5 py-4 border-b border-neutral-100">
          <h3 className="text-base font-semibold text-neutral-800">My Batches</h3>
        </div>
        {myBatches.length > 0 ? (
          <table className="w-full text-sm text-left">
            <thead className="bg-neutral-50 text-neutral-500 uppercase text-xs">
              <tr>
                <th className="px-5 py-3">Batch</th>
                <th className="px-5 py-3">Course</th>
                <th className="px-5 py-3">Students</th>
                <th className="px-5 py-3">Timing</th>
                <th className="px-5 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {myBatches.map((b) => (
                <tr key={b.id}>
                  <td className="px-5 py-3 font-medium text-neutral-800">{b.name}</td>
                  <td className="px-5 py-3 text-neutral-600">{b.course}</td>
                  <td className="px-5 py-3 text-neutral-600">{b.students} / {b.capacity}</td>
                  <td className="px-5 py-3 text-neutral-600">{b.timing}</td>
                  <td className="px-5 py-3"><StatusBadge status={b.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="px-5 py-8 text-center text-sm text-neutral-400">
            No batches are currently assigned to you.
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-3">
        <Link to="/batches" className="border border-neutral-300 text-neutral-700 text-sm font-medium px-4 py-2 rounded-lg hover:bg-neutral-50 transition-colors">View Batches</Link>
        <Link to="/attendance" className="border border-neutral-300 text-neutral-700 text-sm font-medium px-4 py-2 rounded-lg hover:bg-neutral-50 transition-colors">View Attendance</Link>
        <Link to="/students" className="border border-neutral-300 text-neutral-700 text-sm font-medium px-4 py-2 rounded-lg hover:bg-neutral-50 transition-colors">View Students</Link>
        <Link to="/ai-assistant" className="bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">AI Assistant</Link>
      </div>
    </div>
  )
}

export default FacultyDashboard