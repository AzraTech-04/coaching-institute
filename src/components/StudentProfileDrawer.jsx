import { Link } from 'react-router-dom'
import StatusBadge from './StatusBadge'
import { batches } from '../data/batchesData'
import { attendanceRecords } from '../data/attendanceData'
import { feeRecords } from '../data/feesData'

function computeCompletion(student) {
  const fields = [student.name, student.email, student.contact, student.course, student.batch]
  const filled = fields.filter((f) => f && String(f).trim().length > 0).length
  return Math.round((filled / fields.length) * 100)
}

function computeAttendance(studentId) {
  const records = attendanceRecords.filter((r) => r.studentId === studentId)
  if (records.length === 0) return null
  const present = records.filter((r) => r.status === 'Present').length
  return Math.round((present / records.length) * 100)
}

function computeFees(studentId) {
  const fee = feeRecords.find((f) => f.studentId === studentId)
  if (!fee) return null
  const paid = fee.paymentHistory.reduce((sum, p) => sum + p.amount, 0)
  const remaining = fee.totalFee - paid
  let status = 'Pending'
  if (paid >= fee.totalFee) status = 'Paid'
  else if (paid > 0 && new Date(fee.dueDate) < new Date('2026-08-22')) status = 'Overdue'
  else if (paid === 0 && new Date(fee.dueDate) < new Date('2026-08-22')) status = 'Overdue'
  else if (paid > 0) status = 'Partially Paid'
  return { totalFee: fee.totalFee, paid, remaining, status }
}

function StudentProfileDrawer({ student, onClose }) {
  if (!student) return null

  const completion = computeCompletion(student)
  const batch = batches.find((b) => b.name === student.batch)
  const attendancePercent = computeAttendance(student.id)
  const feeInfo = computeFees(student.id)

  let completionMessage = 'Profile is complete.'
  if (completion < 100) completionMessage = 'Some profile fields are missing or incomplete.'

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white w-full max-w-sm h-full shadow-lg overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200">
          <h3 className="text-lg font-semibold text-neutral-800">Student Profile</h3>
          <button type="button" onClick={onClose} className="text-neutral-400 hover:text-neutral-600" aria-label="Close">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="px-6 py-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 font-semibold text-lg">
              {student.name.split(' ').map((n) => n[0]).join('')}
            </div>
            <div>
              <h4 className="text-base font-semibold text-neutral-800">{student.name}</h4>
              <p className="text-sm text-neutral-500">Student ID: {student.id}</p>
            </div>
          </div>

          {/* Personal Information */}
          <div className="mt-6 space-y-3 border-t border-neutral-100 pt-4">
            <p className="text-xs font-semibold text-neutral-400 uppercase mb-1">Personal Information</p>
            <div className="flex justify-between text-sm"><span className="text-neutral-500">Contact</span><span className="text-neutral-800 font-medium">{student.contact}</span></div>
            <div className="flex justify-between text-sm"><span className="text-neutral-500">Email</span><span className="text-neutral-800 font-medium">{student.email}</span></div>
            <div className="flex justify-between text-sm items-center"><span className="text-neutral-500">Status</span><StatusBadge status={student.status} /></div>
          </div>

          {/* Academic Information */}
          <div className="mt-6 space-y-3 border-t border-neutral-100 pt-4">
            <p className="text-xs font-semibold text-neutral-400 uppercase mb-1">Academic Information</p>
            <div className="flex justify-between text-sm"><span className="text-neutral-500">Course</span><span className="text-neutral-800 font-medium">{student.course}</span></div>
            <div className="flex justify-between text-sm"><span className="text-neutral-500">Batch</span><span className="text-neutral-800 font-medium">{student.batch}</span></div>
            <div className="flex justify-between text-sm"><span className="text-neutral-500">Faculty</span><span className="text-neutral-800 font-medium">{batch ? batch.facultyName : 'Not available'}</span></div>
            <div className="flex justify-between text-sm"><span className="text-neutral-500">Joined</span><span className="text-neutral-800 font-medium">{student.joinDate || 'Not available'}</span></div>
          </div>

          {/* Profile Completion */}
          <div className="mt-6 border-t border-neutral-100 pt-4">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-neutral-500">Profile completion</span>
              <span className="font-medium text-neutral-800">{completion}%</span>
            </div>
            <div className="h-2 bg-neutral-100 rounded-full overflow-hidden">
              <div className={`h-full rounded-full ${completion === 100 ? 'bg-green-500' : 'bg-yellow-500'}`} style={{ width: `${completion}%` }} />
            </div>
            <p className="text-xs text-neutral-500 mt-1.5">{completionMessage}</p>
          </div>

          {/* Academic Snapshot */}
          <div className="mt-6 border-t border-neutral-100 pt-4">
            <p className="text-xs font-semibold text-neutral-400 uppercase mb-3">Academic Snapshot</p>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-neutral-500">Attendance</span>
              <span className="text-neutral-800 font-medium">{attendancePercent !== null ? `${attendancePercent}%` : 'Not available'}</span>
            </div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-neutral-500">Test / Result performance</span>
              <span className="text-neutral-400">Not available</span>
            </div>
            <div className="flex justify-between text-sm items-center">
              <span className="text-neutral-500">Fee status</span>
              {feeInfo ? <StatusBadge status={feeInfo.status} /> : <span className="text-neutral-400">Not available</span>}
            </div>
          </div>

          {/* Profile Actions */}
          <div className="mt-6 border-t border-neutral-100 pt-4 space-y-2">
            <Link to="/attendance" className="block w-full text-center border border-neutral-300 text-neutral-700 text-sm font-medium py-2.5 rounded-lg hover:bg-neutral-50 transition-colors">View Attendance</Link>
            <Link to="/fees" className="block w-full text-center border border-neutral-300 text-neutral-700 text-sm font-medium py-2.5 rounded-lg hover:bg-neutral-50 transition-colors">View Fee Details</Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StudentProfileDrawer