import { useState } from 'react'
import Modal from './Modal'
import { courses } from '../data/coursesData'
import { faculty } from '../data/facultyData'
import { timingOptions } from '../data/batchesData'

const emptyForm = { name: '', course: courses[0]?.name || '', facultyId: '', room: '', timing: timingOptions[0], startDate: '', capacity: '' }

function AddBatchModal({ open, onClose, onAdd }) {
  const [form, setForm] = useState(emptyForm)

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  function handleSubmit(e) {
    e.preventDefault()
    onAdd({ ...form, facultyId: form.facultyId ? Number(form.facultyId) : null, capacity: Number(form.capacity) })
    setForm(emptyForm)
    onClose()
  }

  return (
    <Modal open={open} onClose={onClose} title="Add Batch">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1.5">Course</label>
          <select
            name="course"
            value={form.course}
            onChange={handleChange}
            className="w-full px-3.5 py-2.5 text-sm border border-neutral-300 rounded-lg outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 bg-white"
          >
            {courses.map((c) => (
              <option key={c.id} value={c.name}>{c.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1.5">Batch name</label>
          <input
            name="name"
            required
            value={form.name}
            onChange={handleChange}
            placeholder="e.g. NEET Batch C"
            className="w-full px-3.5 py-2.5 text-sm border border-neutral-300 rounded-lg outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1.5">Assign faculty (optional)</label>
          <select
            name="facultyId"
            value={form.facultyId}
            onChange={handleChange}
            className="w-full px-3.5 py-2.5 text-sm border border-neutral-300 rounded-lg outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 bg-white"
          >
            <option value="">Unassigned</option>
            {faculty.map((f) => (
              <option key={f.id} value={f.id}>{f.name} — {f.subject}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1.5">Room / classroom</label>
          <input
            name="room"
            required
            value={form.room}
            onChange={handleChange}
            placeholder="e.g. Room 103"
            className="w-full px-3.5 py-2.5 text-sm border border-neutral-300 rounded-lg outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1.5">Timing</label>
          <select
            name="timing"
            value={form.timing}
            onChange={handleChange}
            className="w-full px-3.5 py-2.5 text-sm border border-neutral-300 rounded-lg outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 bg-white"
          >
            {timingOptions.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1.5">Start date</label>
            <input
              type="date"
              name="startDate"
              required
              value={form.startDate}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 text-sm border border-neutral-300 rounded-lg outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1.5">Capacity</label>
            <input
              type="number"
              name="capacity"
              required
              min="1"
              value={form.capacity}
              onChange={handleChange}
              placeholder="e.g. 40"
              className="w-full px-3.5 py-2.5 text-sm border border-neutral-300 rounded-lg outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
            />
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
            Add Batch
          </button>
        </div>
      </form>
    </Modal>
  )
}

export default AddBatchModal