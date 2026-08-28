import { useState } from 'react'
import Modal from './Modal'
import { courses } from '../data/coursesData'
import { batches } from '../data/batchesData'

const emptyForm = { name: '', subject: '', experience: '', contact: '', courseNames: [], batchIds: [] }

function AddFacultyModal({ open, onClose, onAdd }) {
  const [form, setForm] = useState(emptyForm)

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  function toggleCourse(name) {
    setForm((prev) => ({
      ...prev,
      courseNames: prev.courseNames.includes(name)
        ? prev.courseNames.filter((c) => c !== name)
        : [...prev.courseNames, name],
    }))
  }

  function toggleBatch(id) {
    setForm((prev) => ({
      ...prev,
      batchIds: prev.batchIds.includes(id)
        ? prev.batchIds.filter((b) => b !== id)
        : [...prev.batchIds, id],
    }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    onAdd(form)
    setForm(emptyForm)
    onClose()
  }

  return (
    <Modal open={open} onClose={onClose} title="Add Faculty">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1.5">Full name</label>
          <input
            name="name"
            required
            value={form.name}
            onChange={handleChange}
            placeholder="e.g. Dr. Meera Kulkarni"
            className="w-full px-3.5 py-2.5 text-sm border border-neutral-300 rounded-lg outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1.5">Subject / specialization</label>
          <input
            name="subject"
            required
            value={form.subject}
            onChange={handleChange}
            placeholder="e.g. Physics"
            className="w-full px-3.5 py-2.5 text-sm border border-neutral-300 rounded-lg outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1.5">Experience</label>
          <input
            name="experience"
            required
            value={form.experience}
            onChange={handleChange}
            placeholder="e.g. 5 years"
            className="w-full px-3.5 py-2.5 text-sm border border-neutral-300 rounded-lg outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1.5">Contact number</label>
          <input
            name="contact"
            required
            value={form.contact}
            onChange={handleChange}
            placeholder="+91 90000 00000"
            className="w-full px-3.5 py-2.5 text-sm border border-neutral-300 rounded-lg outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1.5">Qualified to teach (courses)</label>
          <div className="flex flex-wrap gap-2">
            {courses.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => toggleCourse(c.name)}
                className={`px-3 py-1.5 rounded-lg text-sm border transition-colors ${
                  form.courseNames.includes(c.name)
                    ? 'bg-brand-50 border-brand-300 text-brand-700'
                    : 'border-neutral-300 text-neutral-600 hover:bg-neutral-50'
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1.5">Assign to existing batches (optional)</label>
          <div className="max-h-32 overflow-y-auto border border-neutral-200 rounded-lg p-2 space-y-1">
            {batches.map((b) => (
              <label key={b.id} className="flex items-center gap-2 text-sm px-2 py-1.5 rounded hover:bg-neutral-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.batchIds.includes(b.id)}
                  onChange={() => toggleBatch(b.id)}
                  className="accent-brand-600"
                />
                <span className="text-neutral-700">{b.name}</span>
                {b.facultyId && <span className="text-xs text-neutral-400 ml-auto">Currently: {b.facultyName}</span>}
              </label>
            ))}
          </div>
          <p className="text-xs text-neutral-400 mt-1">Assigning a batch here reflects on this faculty's profile only, for this session.</p>
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
            Add Faculty
          </button>
        </div>
      </form>
    </Modal>
  )
}

export default AddFacultyModal