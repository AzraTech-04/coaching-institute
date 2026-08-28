import StatusBadge from './StatusBadge'

function CourseDetailsDrawer({ course, onClose, onStatusChange }) {
  if (!course) return null

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white w-full max-w-sm h-full shadow-lg overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200">
          <h3 className="text-lg font-semibold text-neutral-800">Course Details</h3>
          <button type="button" onClick={onClose} className="text-neutral-400 hover:text-neutral-600" aria-label="Close">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="px-6 py-6">
          <div>
            <h4 className="text-lg font-semibold text-neutral-800">{course.name}</h4>
            <p className="text-sm text-neutral-500">{course.category} · {course.level}</p>
          </div>

          <div className="mt-6 space-y-3 border-t border-neutral-100 pt-4">
            <div className="flex justify-between text-sm">
              <span className="text-neutral-500">Duration</span>
              <span className="text-neutral-800 font-medium">{course.duration}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-neutral-500">Active batches</span>
              <span className="text-neutral-800 font-medium">{course.activeBatches}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-neutral-500">Enrolled students</span>
              <span className="text-neutral-800 font-medium">{course.enrolledStudents}</span>
            </div>
          </div>

          <div className="mt-6 border-t border-neutral-100 pt-4">
            <p className="text-sm text-neutral-500 mb-2">Subjects</p>
            <div className="flex flex-wrap gap-1.5">
              {course.subjects.map((subject) => (
                <span key={subject} className="px-2.5 py-1 rounded-full text-xs font-medium bg-neutral-100 text-neutral-700">
                  {subject}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-6 border-t border-neutral-100 pt-4">
            <p className="text-sm text-neutral-500 mb-2">Faculty</p>
            {course.facultyNames.length === 0 ? (
              <p className="text-sm text-neutral-400">No faculty assigned yet.</p>
            ) : (
              <p className="text-sm text-neutral-700">{course.facultyNames.join(', ')}</p>
            )}
          </div>

          <div className="mt-6 border-t border-neutral-100 pt-4">
            <label className="block text-sm text-neutral-500 mb-1.5">Status</label>
            <select
              value={course.status}
              onChange={(e) => onStatusChange(course.id, e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm border border-neutral-300 rounded-lg outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 bg-white"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          <div className="mt-6 bg-brand-50 border border-brand-100 rounded-lg p-4">
            <p className="text-xs font-medium text-brand-700 uppercase mb-1">Next action</p>
            <p className="text-sm text-neutral-700">
              {course.activeBatches === 0
                ? 'No batches yet — create a batch for this course to start enrolling students.'
                : 'Manage batches and faculty assignments for this course under Academics → Batches.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CourseDetailsDrawer