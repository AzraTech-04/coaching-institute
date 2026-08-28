import { useState } from 'react'
import Modal from './Modal'
import { categoryOptions, levelOptions } from '../data/coursesData'

const emptyForm = { name: '', category: categoryOptions[0], level: levelOptions[0], duration: '', subjects: '' }

function AddCourseModal({ open, onClose, onAdd }) {
  const [form, setForm] = useState(emptyForm)

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  function handleSubmit(e) {
    e.preventDefault()
    onAdd({
      ...form,
      subjects: form.subjects.split(',').map((s) => s.trim()).filter(Boolean),
    })
    setForm(emptyForm)
    onClose()
  }

  return (
    <Modal open={open} onClose={onClose} title="Add Course">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1.5">Course name</label>
          <input
            name="name"
            required
            value={form.name}
            onChange={handleChange}
            placeholder="e.g. NEET Repeaters"
            className="w-full px-3.5 py-2.5 text-sm border border-neutral-300 rounded-lg outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1.5">Category</label>
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className="w-full px-3.5 py-2.5 text-sm border border-neutral-300 rounded-lg outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 bg-white"
          >
            {categoryOptions.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1.5">Level</label>
          <select
            name="level"
            value={form.level}
            onChange={handleChange}
            className="w-full px-3.5 py-2.5 text-sm border border-neutral-300 rounded-lg outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 bg-white"
          >
            {levelOptions.map((l) => (
              <option key={l} value={l}>{l}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1.5">Duration</label>
          <input
            name="duration"
            required
            value={form.duration}
            onChange={handleChange}
            placeholder="e.g. 1 year"
            className="w-full px-3.5 py-2.5 text-sm border border-neutral-300 rounded-lg outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1.5">Subjects (comma-separated)</label>
          <input
            name="subjects"
            required
            value={form.subjects}
            onChange={handleChange}
            placeholder="e.g. Physics, Chemistry, Biology"
            className="w-full px-3.5 py-2.5 text-sm border border-neutral-300 rounded-lg outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
          />
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
            Add Course
          </button>
        </div>
      </form>
    </Modal>
  )
}

export default AddCourseModal