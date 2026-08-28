import { useState } from 'react'
import StatusBadge from './StatusBadge'

function FacultyDetailsDrawer({ member, onClose, onStatusChange, onDocumentUpload }) {
  const [uploadingDoc, setUploadingDoc] = useState(null)

  if (!member) return null

  const activeBatchCount = member.assignedBatches.filter((b) => b.status === 'Active').length
  const submittedDocs = member.documents.filter((d) => d.submitted).length
  const totalDocs = member.documents.length

  let nextAction = 'No batch assigned yet.'
  if (member.assignedCourses.length === 0) {
    nextAction = 'Course assignment required.'
  } else if (activeBatchCount >= 3) {
    nextAction = 'Faculty workload is high.'
  } else if (activeBatchCount > 0) {
    nextAction = `${activeBatchCount} active batch${activeBatchCount === 1 ? '' : 'es'} assigned.`
  }

  function handleFileSelect(docName, e) {
    if (e.target.files.length > 0) {
      onDocumentUpload(member.id, docName)
      setUploadingDoc(null)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white w-full max-w-sm h-full shadow-lg overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200">
          <h3 className="text-lg font-semibold text-neutral-800">Faculty Details</h3>
          <button type="button" onClick={onClose} className="text-neutral-400 hover:text-neutral-600" aria-label="Close">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="px-6 py-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 font-semibold text-lg">
              {member.name.split(' ').filter((n) => /^[A-Z]/.test(n)).map((n) => n[0]).join('').slice(0, 2)}
            </div>
            <div>
              <h4 className="text-base font-semibold text-neutral-800">{member.name}</h4>
              <p className="text-sm text-neutral-500">{member.subject}</p>
            </div>
          </div>

          {/* Faculty Information */}
          <div className="mt-6 space-y-3 border-t border-neutral-100 pt-4">
            <p className="text-xs font-semibold text-neutral-400 uppercase mb-1">Faculty Information</p>
            <div className="flex justify-between text-sm">
              <span className="text-neutral-500">Experience</span>
              <span className="text-neutral-800 font-medium">{member.experience}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-neutral-500">Contact</span>
              <span className="text-neutral-800 font-medium">{member.contact}</span>
            </div>
            <div>
              <label className="block text-sm text-neutral-500 mb-1.5 mt-2">Status</label>
              <select
                value={member.status}
                onChange={(e) => onStatusChange(member.id, e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm border border-neutral-300 rounded-lg outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 bg-white"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>

          {/* Academic Assignments */}
          <div className="mt-6 border-t border-neutral-100 pt-4">
            <p className="text-xs font-semibold text-neutral-400 uppercase mb-3">Academic Assignments</p>
            <div className="mb-3">
              <p className="text-sm text-neutral-500 mb-1.5">Courses</p>
              {member.assignedCourses.length === 0 ? (
                <p className="text-sm text-neutral-400">None assigned.</p>
              ) : (
                <div className="flex flex-wrap gap-1.5">
                  {member.assignedCourses.map((c) => (
                    <span key={c} className="px-2.5 py-1 rounded-full text-xs font-medium bg-neutral-100 text-neutral-700">{c}</span>
                  ))}
                </div>
              )}
            </div>
            <div className="mb-3">
              <p className="text-sm text-neutral-500 mb-1.5">Batches</p>
              {member.assignedBatches.length === 0 ? (
                <p className="text-sm text-neutral-400">No batch assigned yet.</p>
              ) : (
                <ul className="space-y-1">
                  {member.assignedBatches.map((b) => (
                    <li key={b.id} className="text-sm text-neutral-700 flex justify-between">
                      <span>{b.name}</span>
                      <StatusBadge status={b.status} />
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-neutral-500">Students taught</span>
              <span className="text-neutral-800 font-medium">{member.studentCount}</span>
            </div>
          </div>

          {/* Schedule / Workload */}
          <div className="mt-6 border-t border-neutral-100 pt-4">
            <p className="text-xs font-semibold text-neutral-400 uppercase mb-3">Schedule / Workload</p>
            {member.assignedBatches.length === 0 ? (
              <p className="text-sm text-neutral-400">No schedule yet.</p>
            ) : (
              <ul className="space-y-1.5 mb-3">
                {member.assignedBatches.map((b) => (
                  <li key={b.id} className="text-sm text-neutral-700">{b.timing}</li>
                ))}
              </ul>
            )}
            <div className="flex justify-between text-sm mb-2">
              <span className="text-neutral-500">Active batches</span>
              <span className="text-neutral-800 font-medium">{activeBatchCount}</span>
            </div>
            <div className="h-2 bg-neutral-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${activeBatchCount >= 3 ? 'bg-red-500' : activeBatchCount >= 2 ? 'bg-yellow-500' : 'bg-green-500'}`}
                style={{ width: `${Math.min((activeBatchCount / 3) * 100, 100)}%` }}
              />
            </div>
          </div>

          {/* Documents */}
          <div className="mt-6 border-t border-neutral-100 pt-4">
            <p className="text-xs font-semibold text-neutral-400 uppercase mb-3">Documents</p>
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-neutral-500">Completion</span>
              <span className="text-neutral-800 font-medium">{submittedDocs} / {totalDocs}</span>
            </div>
            <div className="h-2 bg-neutral-100 rounded-full overflow-hidden mb-3">
              <div
                className="h-full bg-brand-500 rounded-full"
                style={{ width: `${(submittedDocs / totalDocs) * 100}%` }}
              />
            </div>
            <ul className="space-y-2">
              {member.documents.map((doc) => (
                <li key={doc.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    {doc.submitted ? (
                      <svg className="w-4 h-4 text-green-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4 text-yellow-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    )}
                    <span className={doc.submitted ? 'text-neutral-700' : 'text-neutral-500'}>{doc.name}</span>
                  </div>
                  {doc.submitted ? (
                    <span className="text-xs text-green-600 font-medium">Submitted</span>
                  ) : (
                    <label className="text-xs font-medium text-brand-600 hover:text-brand-700 cursor-pointer">
                      Upload
                      <input
                        type="file"
                        className="hidden"
                        onChange={(e) => handleFileSelect(doc.name, e)}
                      />
                    </label>
                  )}
                </li>
              ))}
            </ul>
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

export default FacultyDetailsDrawer