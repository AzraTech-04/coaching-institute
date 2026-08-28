import { useState } from 'react'
import Modal from './Modal'
import { counsellingRecords } from '../data/counsellingData'
import { batchOptions } from '../data/studentsData'
import { admissionStatusOptions, feeStatusOptions } from '../data/admissionsData'

const eligibleRecords = counsellingRecords.filter((r) => r.status === 'Converted')

const emptyForm = {
  counsellingId: '',
  name: '',
  course: '',
  batch: batchOptions[0],
  admissionDate: '',
  status: 'Pending',
  feeStatus: 'Pending',
  totalFee: '',
}

function NewAdmissionModal({ open, onClose, onAdd }) {
  const [form, setForm] = useState(emptyForm)

  function handleRecordChange(e) {
    const counsellingId = e.target.value
    const record = eligibleRecords.find((r) => r.id === Number(counsellingId))
    setForm({
      ...form,
      counsellingId,
      name: record ? record.name : '',
      course: record ? record.course : '',
    })
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  function handleSubmit(e) {
    e.preventDefault()
    onAdd({ ...form, counsellingId: form.counsellingId ? Number(form.counsellingId) : null })
    setForm(emptyForm)
    onClose()
  }

  return (
    <Modal open={open} onClose={onClose} title="New Admission">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1.5">Converted counselling record</label>
          {eligibleRecords.length === 0 ? (
            <p className="text-sm text-neutral-500 border border-neutral-200 rounded-lg px-3.5 py-2.5 bg-neutral-50">
              No converted counselling records available. Enter details manually below.
            </p>
          ) : (
            <select
              value={form.counsellingId}
              onChange={handleRecordChange}
              className="w-full px-3.5 py-2.5 text-sm border border-neutral-300 rounded-lg outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 bg-white"
            >
              <option value="">Enter manually...</option>
              {eligibleRecords.map((r) => (
                <option key={r.id} value={r.id}>{r.name} — {r.course}</option>
              ))}
            </select>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1.5">Student name</label>
          <input
            name="name"
            required
            value={form.name}
            onChange={handleChange}
            placeholder="e.g. Meera Kulkarni"
            className="w-full px-3.5 py-2.5 text-sm border border-neutral-300 rounded-lg outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1.5">Course</label>
          <input
            name="course"
            required
            value={form.course}
            onChange={handleChange}
            placeholder="e.g. JEE Advanced"
            className="w-full px-3.5 py-2.5 text-sm border border-neutral-300 rounded-lg outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1.5">Batch</label>
          <select
            name="batch"
            value={form.batch}
            onChange={handleChange}
            className="w-full px-3.5 py-2.5 text-sm border border-neutral-300 rounded-lg outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 bg-white"
          >
            {batchOptions.map((b) => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1.5">Admission date</label>
            <input
              type="date"
              name="admissionDate"
              required
              value={form.admissionDate}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 text-sm border border-neutral-300 rounded-lg outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1.5">Total fee (₹)</label>
            <input
              type="number"
              name="totalFee"
              required
              value={form.totalFee}
              onChange={handleChange}
              placeholder="85000"
              className="w-full px-3.5 py-2.5 text-sm border border-neutral-300 rounded-lg outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1.5">Admission status</label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 text-sm border border-neutral-300 rounded-lg outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 bg-white"
            >
              {admissionStatusOptions.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1.5">Fee status</label>
            <select
              name="feeStatus"
              value={form.feeStatus}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 text-sm border border-neutral-300 rounded-lg outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 bg-white"
            >
              {feeStatusOptions.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 border border-neutral-300 text-neutral-700 text-sm font-medium py-2.5 rounded-lg hover:bg-neutral-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium py-2.5 rounded-lg transition-colors"
          >
            Create Admission
          </button>
        </div>
      </form>
    </Modal>
  )
}

export default NewAdmissionModal