import StatusBadge from './StatusBadge'
import { admissionStatusOptions, feeStatusOptions } from '../data/admissionsData'

const nextActionCopy = {
  Pending: 'Confirm fee payment to finalize this admission.',
  Confirmed: 'Admission confirmed. Proceed to create the student profile.',
  Cancelled: 'This admission was cancelled.',
}

function AdmissionDetailsDrawer({ admission, onClose, onStatusChange, onFeeStatusChange }) {
  if (!admission) return null

  const balance = admission.totalFee - admission.paidAmount

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white w-full max-w-sm h-full shadow-lg overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200">
          <h3 className="text-lg font-semibold text-neutral-800">Admission Details</h3>
          <button type="button" onClick={onClose} className="text-neutral-400 hover:text-neutral-600" aria-label="Close">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="px-6 py-6">
          {/* Student information */}
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 font-semibold text-lg">
              {admission.name.split(' ').map((n) => n[0]).join('')}
            </div>
            <div>
              <h4 className="text-base font-semibold text-neutral-800">{admission.name}</h4>
              <p className="text-sm text-neutral-500">{admission.counsellor}</p>
            </div>
          </div>

          {/* Course & batch */}
          <div className="mt-6 border-t border-neutral-100 pt-4">
            <p className="text-xs font-semibold text-neutral-400 uppercase mb-3">Course & Batch</p>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-neutral-500">Course</span>
                <span className="text-neutral-800 font-medium">{admission.course}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-neutral-500">Batch</span>
                <span className="text-neutral-800 font-medium">{admission.batch}</span>
              </div>
            </div>
          </div>

          {/* Admission information */}
          <div className="mt-6 border-t border-neutral-100 pt-4">
            <p className="text-xs font-semibold text-neutral-400 uppercase mb-3">Admission Information</p>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-neutral-500">Admission date</span>
                <span className="text-neutral-800 font-medium">{admission.admissionDate}</span>
              </div>
              <div>
                <label className="block text-sm text-neutral-500 mb-1.5">Admission status</label>
                <select
                  value={admission.status}
                  onChange={(e) => onStatusChange(admission.id, e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm border border-neutral-300 rounded-lg outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 bg-white"
                >
                  {admissionStatusOptions.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Fee/payment summary */}
          <div className="mt-6 border-t border-neutral-100 pt-4">
            <p className="text-xs font-semibold text-neutral-400 uppercase mb-3">Fee Summary</p>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-neutral-500">Total fee</span>
                <span className="text-neutral-800 font-medium">₹{admission.totalFee.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-neutral-500">Paid</span>
                <span className="text-neutral-800 font-medium">₹{admission.paidAmount.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-neutral-500">Balance</span>
                <span className={`font-medium ${balance > 0 ? 'text-red-600' : 'text-green-600'}`}>
                  ₹{balance.toLocaleString('en-IN')}
                </span>
              </div>
              <div>
                <label className="block text-sm text-neutral-500 mb-1.5">Fee status</label>
                <select
                  value={admission.feeStatus}
                  onChange={(e) => onFeeStatusChange(admission.id, e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm border border-neutral-300 rounded-lg outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 bg-white"
                >
                  {feeStatusOptions.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Document status */}
          <div className="mt-6 border-t border-neutral-100 pt-4">
            <p className="text-xs font-semibold text-neutral-400 uppercase mb-3">Documents</p>
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-neutral-500">Submitted</span>
              <span className="text-neutral-800 font-medium">{admission.documentsSubmitted} of {admission.documentsRequired}</span>
            </div>
            <div className="h-2 bg-neutral-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-brand-500 rounded-full"
                style={{ width: `${(admission.documentsSubmitted / admission.documentsRequired) * 100}%` }}
              />
            </div>
          </div>

          {/* Notes / next action */}
          <div className="mt-6 border-t border-neutral-100 pt-4">
            <p className="text-sm text-neutral-500 mb-2">Notes</p>
            <p className="text-sm text-neutral-700">{admission.notes}</p>
          </div>

          <div className="mt-6 bg-brand-50 border border-brand-100 rounded-lg p-4">
            <p className="text-xs font-medium text-brand-700 uppercase mb-1">Next action</p>
            <p className="text-sm text-neutral-700">{nextActionCopy[admission.status]}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdmissionDetailsDrawer