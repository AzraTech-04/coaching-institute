function BatchDetailsDrawer({ batch, onClose, onStatusChange }) {
  if (!batch) return null

  const remainingSeats = batch.capacity - batch.students
  const occupancyPercent = Math.round((batch.students / batch.capacity) * 100)

  let capacityColor = 'bg-green-500'
  let nextAction = `${remainingSeats} seat${remainingSeats === 1 ? '' : 's'} remaining.`
  if (occupancyPercent >= 100) {
    capacityColor = 'bg-red-500'
    nextAction = 'Batch is full.'
  } else if (occupancyPercent >= 85) {
    capacityColor = 'bg-yellow-500'
    nextAction = `Nearly full — only ${remainingSeats} seat${remainingSeats === 1 ? '' : 's'} left.`
  }
  if (!batch.facultyId) {
    nextAction = 'Faculty assignment required.'
  } else if (new Date(batch.startDate) > new Date('2026-08-21')) {
    nextAction = 'Batch starts soon.'
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white w-full max-w-sm h-full shadow-lg overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200">
          <h3 className="text-lg font-semibold text-neutral-800">Batch Details</h3>
          <button type="button" onClick={onClose} className="text-neutral-400 hover:text-neutral-600" aria-label="Close">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="px-6 py-6">
          {/* Batch Information */}
          <div>
            <h4 className="text-lg font-semibold text-neutral-800">{batch.name}</h4>
            <p className="text-sm text-neutral-500">{batch.course}</p>
          </div>

          <div className="mt-6 space-y-3 border-t border-neutral-100 pt-4">
            <p className="text-xs font-semibold text-neutral-400 uppercase mb-1">Batch Information</p>
            <div className="flex justify-between text-sm">
              <span className="text-neutral-500">Classroom</span>
              <span className="text-neutral-800 font-medium">{batch.room}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-neutral-500">Schedule</span>
              <span className="text-neutral-800 font-medium">{batch.timing}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-neutral-500">Start date</span>
              <span className="text-neutral-800 font-medium">{batch.startDate}</span>
            </div>
            <div>
              <label className="block text-sm text-neutral-500 mb-1.5 mt-2">Status</label>
              <select
                value={batch.status}
                onChange={(e) => onStatusChange(batch.id, e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm border border-neutral-300 rounded-lg outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 bg-white"
              >
                <option value="Active">Active</option>
                <option value="Upcoming">Upcoming</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>

          {/* Faculty */}
          <div className="mt-6 border-t border-neutral-100 pt-4">
            <p className="text-xs font-semibold text-neutral-400 uppercase mb-3">Faculty</p>
            {batch.facultyId ? (
              <div className="flex justify-between text-sm">
                <span className="text-neutral-500">{batch.facultyName}</span>
                <span className="text-neutral-800 font-medium">{batch.facultySubject}</span>
              </div>
            ) : (
              <p className="text-sm text-neutral-400">No faculty assigned yet.</p>
            )}
          </div>

          {/* Students */}
          <div className="mt-6 border-t border-neutral-100 pt-4">
            <p className="text-xs font-semibold text-neutral-400 uppercase mb-3">Students</p>
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-neutral-500">Enrolled</span>
              <span className="text-neutral-800 font-medium">{batch.students} / {batch.capacity}</span>
            </div>
            <div className="h-2 bg-neutral-100 rounded-full overflow-hidden">
              <div className={`h-full rounded-full ${capacityColor}`} style={{ width: `${Math.min(occupancyPercent, 100)}%` }} />
            </div>

            {batch.studentList.length > 0 && (
              <ul className="mt-3 space-y-1.5">
                {batch.studentList.map((s) => (
                  <li key={s.id} className="text-sm text-neutral-700">{s.name}</li>
                ))}
              </ul>
            )}
          </div>

          <div className="mt-6 bg-brand-50 border border-brand-100 rounded-lg p-4">
            <p className="text-xs font-medium text-brand-700 uppercase mb-1">Next action</p>
            <p className="text-sm text-neutral-700">{nextAction}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BatchDetailsDrawer