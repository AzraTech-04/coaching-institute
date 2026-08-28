import { useState } from 'react'
import { admissionsRecords as initialAdmissions, admissionStatusOptions, feeStatusOptions } from '../data/admissionsData'
import { batchOptions } from '../data/studentsData'
import { courseOptions } from '../data/leadsData'
import StatusBadge from '../components/StatusBadge'
import PageHeader from '../components/PageHeader'
import EmptyState from '../components/EmptyState'
import StatCard from '../components/StatCard'
import NewAdmissionModal from '../components/NewAdmissionModal'
import AdmissionDetailsDrawer from '../components/AdmissionDetailsDrawer'

const CURRENT_MONTH = '2026-08'

function Admissions() {
  const [admissions, setAdmissions] = useState(initialAdmissions)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [courseFilter, setCourseFilter] = useState('All')
  const [batchFilter, setBatchFilter] = useState('All')
  const [feeFilter, setFeeFilter] = useState('All')
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedAdmission, setSelectedAdmission] = useState(null)

  const filteredAdmissions = admissions.filter((a) => {
    const matchesSearch = a.name.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === 'All' || a.status === statusFilter
    const matchesCourse = courseFilter === 'All' || a.course === courseFilter
    const matchesBatch = batchFilter === 'All' || a.batch === batchFilter
    const matchesFee = feeFilter === 'All' || a.feeStatus === feeFilter
    return matchesSearch && matchesStatus && matchesCourse && matchesBatch && matchesFee
  })

  const stats = [
    { label: 'Total Admissions', value: admissions.length, change: 'All time', trend: 'up' },
    { label: 'This Month', value: admissions.filter((a) => a.admissionDate.startsWith(CURRENT_MONTH)).length, change: 'New enrollments', trend: 'up' },
    { label: 'Pending Documents', value: admissions.filter((a) => a.documentsSubmitted < a.documentsRequired).length, change: 'Need follow-up', trend: 'down' },
    { label: 'Fees Pending', value: admissions.filter((a) => a.feeStatus !== 'Paid').length, change: 'Awaiting payment', trend: 'down' },
  ]

  function handleAddAdmission(form) {
    const newAdmission = {
      id: admissions.length + 1,
      counsellingId: form.counsellingId,
      name: form.name,
      course: form.course,
      batch: form.batch,
      counsellor: 'Unassigned',
      admissionDate: form.admissionDate,
      status: form.status,
      feeStatus: form.feeStatus,
      totalFee: Number(form.totalFee) || 0,
      paidAmount: 0,
      documentsSubmitted: 0,
      documentsRequired: 4,
      notes: 'New admission created from the prototype.',
    }
    setAdmissions([newAdmission, ...admissions])
  }

  function handleStatusChange(id, newStatus) {
    setAdmissions(admissions.map((a) => (a.id === id ? { ...a, status: newStatus } : a)))
    setSelectedAdmission((prev) => (prev && prev.id === id ? { ...prev, status: newStatus } : prev))
  }

  function handleFeeStatusChange(id, newFeeStatus) {
    setAdmissions(admissions.map((a) => (a.id === id ? { ...a, feeStatus: newFeeStatus } : a)))
    setSelectedAdmission((prev) => (prev && prev.id === id ? { ...prev, feeStatus: newFeeStatus } : prev))
  }

  return (
    <div>
      <PageHeader
        title="Admissions"
        subtitle="Where a counselled lead becomes an enrolled student."
        actionLabel="+ New Admission"
        onAction={() => setModalOpen(true)}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((stat) => (
          <StatCard key={stat.label} label={stat.label} value={stat.value} change={stat.change} trend={stat.trend} />
        ))}
      </div>

      <div className="flex flex-col sm:flex-row flex-wrap gap-3 mb-4">
        <div className="relative flex-1 min-w-[180px]">
          <svg className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 10.5A6.5 6.5 0 114 10.5a6.5 6.5 0 0113 0z" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name..."
            className="w-full pl-9 pr-3 py-2.5 text-sm border border-neutral-300 rounded-lg outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3.5 py-2.5 text-sm border border-neutral-300 rounded-lg outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 bg-white"
        >
          <option value="All">All Statuses</option>
          {admissionStatusOptions.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <select
          value={courseFilter}
          onChange={(e) => setCourseFilter(e.target.value)}
          className="px-3.5 py-2.5 text-sm border border-neutral-300 rounded-lg outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 bg-white"
        >
          <option value="All">All Courses</option>
          {courseOptions.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <select
          value={batchFilter}
          onChange={(e) => setBatchFilter(e.target.value)}
          className="px-3.5 py-2.5 text-sm border border-neutral-300 rounded-lg outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 bg-white"
        >
          <option value="All">All Batches</option>
          {batchOptions.map((b) => (
            <option key={b} value={b}>{b}</option>
          ))}
        </select>
        <select
          value={feeFilter}
          onChange={(e) => setFeeFilter(e.target.value)}
          className="px-3.5 py-2.5 text-sm border border-neutral-300 rounded-lg outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 bg-white"
        >
          <option value="All">All Fee Statuses</option>
          {feeStatusOptions.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden shadow-sm">
        {admissions.length === 0 ? (
          <EmptyState
            title="No admissions yet"
            message="Create your first admission to get started."
            actionLabel="+ New Admission"
            onAction={() => setModalOpen(true)}
          />
        ) : filteredAdmissions.length === 0 ? (
          <EmptyState
            title="No matching admissions"
            message="Try adjusting your search or filters to find what you're looking for."
          />
        ) : (
          <table className="w-full text-sm text-left">
            <thead className="bg-neutral-50 text-neutral-500 uppercase text-xs">
              <tr>
                <th className="px-5 py-3">Name</th>
                <th className="px-5 py-3">Course</th>
                <th className="px-5 py-3">Batch</th>
                <th className="px-5 py-3">Admission Date</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Fee Status</th>
                <th className="px-5 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {filteredAdmissions.map((a) => (
                <tr
                  key={a.id}
                  className="hover:bg-neutral-50 cursor-pointer"
                  onClick={() => setSelectedAdmission(a)}
                >
                  <td className="px-5 py-3 font-medium text-neutral-800">{a.name}</td>
                  <td className="px-5 py-3 text-neutral-600">{a.course}</td>
                  <td className="px-5 py-3 text-neutral-600">{a.batch}</td>
                  <td className="px-5 py-3 text-neutral-600">{a.admissionDate}</td>
                  <td className="px-5 py-3">
                    <StatusBadge status={a.status} />
                  </td>
                  <td className="px-5 py-3">
                    <StatusBadge status={a.feeStatus} />
                  </td>
                  <td className="px-5 py-3 text-right">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        setSelectedAdmission(a)
                      }}
                      className="text-brand-600 hover:text-brand-700 font-medium text-sm"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <NewAdmissionModal open={modalOpen} onClose={() => setModalOpen(false)} onAdd={handleAddAdmission} />
      <AdmissionDetailsDrawer
        admission={selectedAdmission}
        onClose={() => setSelectedAdmission(null)}
        onStatusChange={handleStatusChange}
        onFeeStatusChange={handleFeeStatusChange}
      />
    </div>
  )
}

export default Admissions