import { useState } from 'react'
import Modal from './Modal'
import { leads } from '../data/leadsData'
import { counsellorOptions } from '../data/counsellingData'

const emptyForm = { leadId: '', course: '', counsellor: counsellorOptions[0], date: '', time: '' }

function ScheduleCounsellingModal({ open, onClose, onAdd }) {
  const [form, setForm] = useState(emptyForm)

  function handleLeadChange(e) {
    const leadId = e.target.value
    const selectedLead = leads.find((l) => l.id === Number(leadId))
    setForm({
      ...form,
      leadId,
      course: selectedLead ? selectedLead.course : form.course,
    })
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  function handleSubmit(e) {
    e.preventDefault()
    const selectedLead = leads.find((l) => l.id === Number(form.leadId))
    onAdd({
      ...form,
      leadId: form.leadId ? Number(form.leadId) : null,
      name: selectedLead ? selectedLead.name : 'Walk-in Prospect',
    })
    setForm(emptyForm)
    onClose()
  }

  return (
    <Modal open={open} onClose={onClose} title="Schedule Counselling">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1.5">Select lead</label>
          <select
            value={form.leadId}
            onChange={handleLeadChange}
            required
            className="w-full px-3.5 py-2.5 text-sm border border-neutral-300 rounded-lg outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 bg-white"
          >
            <option value="" disabled>Choose a lead...</option>
            {leads.map((lead) => (
              <option key={lead.id} value={lead.id}>{lead.name} — {lead.course}</option>
            ))}
          </select>
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
          <label className="block text-sm font-medium text-neutral-700 mb-1.5">Counsellor</label>
          <select
            name="counsellor"
            value={form.counsellor}
            onChange={handleChange}
            className="w-full px-3.5 py-2.5 text-sm border border-neutral-300 rounded-lg outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 bg-white"
          >
            {counsellorOptions.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1.5">Date</label>
            <input
              type="date"
              name="date"
              required
              value={form.date}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 text-sm border border-neutral-300 rounded-lg outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1.5">Time</label>
            <input
              type="time"
              name="time"
              required
              value={form.time}
              onChange={handleChange}
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
            Schedule
          </button>
        </div>
      </form>
    </Modal>
  )
}

export default ScheduleCounsellingModal