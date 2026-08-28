import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import PageHeader from '../PageHeader'
import StatusBadge from '../StatusBadge'
import { students } from '../../data/studentsData'
import { batches } from '../../data/batchesData'
import { attendanceRecords } from '../../data/attendanceData'
import { feeRecords } from '../../data/feesData'
import { clearIdentity } from '../../utils/identity'

const TODAY = '2026-08-22'

function StudentDashboard({ studentId }) {
  const navigate = useNavigate()

  // Resolve the student record from the prop.
  // studentId comes from currentUserId in localStorage, parsed as an integer.
  const student = students.find((s) => s.id === studentId)

  // If no matching student is found (missing or invalid ID), do not silently
  // display another student's information. Clear the identity and return to login.
  useEffect(() => {
    if (!student) {
      clearIdentity()
      navigate('/login', { replace: true })
    }
  }, [student, navigate])

  // Render nothing during the redirect — avoids a flash of broken content.
  if (!student) return null

  const batch = batches.find((b) => b.name === student.batch)

  const studentAttendance = attendanceRecords.filter((r) => r.studentId === student.id)
  const presentCount = studentAttendance.filter((r) => r.status === 'Present').length
  const attendancePercent = studentAttendance.length > 0
    ? Math.round((presentCount / studentAttendance.length) * 100)
    : null

  const fee = feeRecords.find((f) => f.studentId === student.id)
  let feeStatus = null
  let feeRemaining = null
  if (fee) {
    const paid = fee.paymentHistory.reduce((sum, p) => sum + p.amount, 0)
    feeRemaining = fee.totalFee - paid
    if (paid >= fee.totalFee) feeStatus = 'Paid'
    else if (paid === 0 && new Date(fee.dueDate) < new Date(TODAY)) feeStatus = 'Overdue'
    else if (paid > 0 && new Date(fee.dueDate) < new Date(TODAY)) feeStatus = 'Overdue'
    else if (paid > 0) feeStatus = 'Partially Paid'
    else feeStatus = 'Pending'
  }

  return (
    <div>
      <PageHeader
        title={`Welcome, ${student.name}`}
        subtitle={`${student.course} · ${student.batch}`}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white border border-neutral-200 rounded-xl shadow-sm p-5">
          <h3 className="text-base font-semibold text-neutral-800 mb-4">Course &amp; Batch</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-neutral-500">Course</span>
              <span className="font-medium text-neutral-800">{student.course}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-500">Batch</span>
              <span className="font-medium text-neutral-800">{student.batch}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-500">Faculty</span>
              <span className="font-medium text-neutral-800">{batch ? batch.facultyName : 'Not available'}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-neutral-500">Status</span>
              <StatusBadge status={student.status} />
            </div>
          </div>
        </div>

        <div className="bg-white border border-neutral-200 rounded-xl shadow-sm p-5">
          <h3 className="text-base font-semibold text-neutral-800 mb-4">Attendance &amp; Fees</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-neutral-500">Attendance</span>
              <span className="font-medium text-neutral-800">
                {attendancePercent !== null ? `${attendancePercent}%` : 'Not available'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-neutral-500">Fee status</span>
              {feeStatus ? <StatusBadge status={feeStatus} /> : <span className="text-neutral-400">Not available</span>}
            </div>
            {feeRemaining !== null && (
              <div className="flex justify-between">
                <span className="text-neutral-500">Balance due</span>
                <span className={`font-medium ${feeRemaining > 0 ? 'text-red-600' : 'text-green-600'}`}>
                  ₹{feeRemaining.toLocaleString('en-IN')}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <Link to="/students/profiles" className="border border-neutral-300 text-neutral-700 text-sm font-medium px-4 py-2 rounded-lg hover:bg-neutral-50 transition-colors">My Profile</Link>
        <Link to="/attendance" className="border border-neutral-300 text-neutral-700 text-sm font-medium px-4 py-2 rounded-lg hover:bg-neutral-50 transition-colors">Attendance</Link>
        <Link to="/fees" className="border border-neutral-300 text-neutral-700 text-sm font-medium px-4 py-2 rounded-lg hover:bg-neutral-50 transition-colors">Fees &amp; Payments</Link>
        <Link to="/ai-assistant" className="bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">AI Assistant</Link>
      </div>
    </div>
  )
}

export default StudentDashboard