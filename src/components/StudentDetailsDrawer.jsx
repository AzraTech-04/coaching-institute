import StatusBadge from './StatusBadge'
import ProgressBar from './ProgressBar'

function StudentDetailsDrawer({ student, onClose }) {
  if (!student) return null

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
              <p className="text-sm text-neutral-500">{student.course}</p>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between">
            <span className="text-sm text-neutral-500">Status</span>
            <StatusBadge status={student.status} />
          </div>

          <div className="mt-6 space-y-4 border-t border-neutral-100 pt-4">
            <div className="flex justify-between text-sm">
              <span className="text-neutral-500">Email</span>
              <span className="text-neutral-800 font-medium">{student.email}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-neutral-500">Contact</span>
              <span className="text-neutral-800 font-medium">{student.contact}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-neutral-500">Batch</span>
              <span className="text-neutral-800 font-medium">{student.batch}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-neutral-500">Joined</span>
              <span className="text-neutral-800 font-medium">{student.joinDate}</span>
            </div>
          </div>

          <div className="mt-6 border-t border-neutral-100 pt-4">
            <p className="text-sm text-neutral-500 mb-2">Attendance</p>
            <ProgressBar percentage={student.attendance} />
          </div>

          <div className="mt-4">
            <p className="text-sm text-neutral-500 mb-2">Average test score</p>
            <ProgressBar percentage={student.avgScore} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default StudentDetailsDrawer