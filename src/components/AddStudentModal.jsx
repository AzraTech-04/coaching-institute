import { useState } from 'react'
import Modal from './Modal'
import { batchOptions } from '../data/studentsData'

const emptyForm = { name: '', email: '', contact: '', batch: batchOptions[0], course: 'JEE Advanced' }

function AddStudentModal({ open, onClose, onAdd }) {
  const [form, setForm] = useState(emptyForm)

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  function handleSubmit(e) {
    e.preventDefault()
    onAdd(form)
    setForm(emptyForm)
    onClose()
  }

  return (
    <Modal open={open} onClose={onClose} title="Add Student">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1.5">Full name</label>
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
          <label className="block text-sm font-medium text-neutral-700 mb-1.5">Email</label>
          <input
            type="email"
            name="email"
            required
            value={form.email}
            onChange={handleChange}
            placeholder="student@example.com"
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
            Add Student
          </button>
        </div>
      </form>
    </Modal>
  )
}

export default AddStudentModal