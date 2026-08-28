import { useState } from 'react'
import { batches as initialBatches, timingOptions } from '../data/batchesData'
import { courses } from '../data/coursesData'
import { faculty } from '../data/facultyData'
import StatusBadge from '../components/StatusBadge'
import PageHeader from '../components/PageHeader'
import EmptyState from '../components/EmptyState'
import StatCard from '../components/StatCard'
import AddBatchModal from '../components/AddBatchModal'
import BatchDetailsDrawer from '../components/BatchDetailsDrawer'

function Batches() {
  const [batches, setBatches] = useState(initialBatches)
  const [search, setSearch] = useState('')
  const [courseFilter, setCourseFilter] = useState('All')
  const [statusFilter, setStatusFilter] = useState('All')
  const [facultyFilter, setFacultyFilter] = useState('All')
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedBatch, setSelectedBatch] = useState(null)

  const filteredBatches = batches.filter((b) => {
    const matchesSearch = b.name.toLowerCase().includes(search.toLowerCase())
    const matchesCourse = courseFilter === 'All' || b.course === courseFilter
    const matchesStatus = statusFilter === 'All' || b.status === statusFilter
    const matchesFaculty = facultyFilter === 'All' || b.facultyName === facultyFilter
    return matchesSearch && matchesCourse && matchesStatus && matchesFaculty
  })

  const stats = [
    { label: 'Total Batches', value: batches.length, change: 'All batches', trend: 'up' },
    { label: 'Active Batches', value: batches.filter((b) => b.status === 'Active').length, change: 'Currently running', trend: 'up' },
    { label: 'Total Students', value: batches.reduce((sum, b) => sum + b.students, 0), change: 'Across all batches', trend: 'up' },
    { label: 'Upcoming Batches', value: batches.filter((b) => b.status === 'Upcoming').length, change: 'Not yet started', trend: 'up' },
  ]

  function handleAddBatch(form) {
    const assignedFaculty = faculty.find((f) => f.id === form.facultyId)
    const newBatch = {
      id: batches.length + 1,
      name: form.name,
      course: form.course,
      facultyId: form.facultyId,
      facultyName: assignedFaculty ? assignedFaculty.name : 'Unassigned',
      facultySubject: assignedFaculty ? assignedFaculty.subject : null,
      room: form.room,
      timing: form.timing,
      startDate: form.startDate,
      capacity: form.capacity,
      status: 'Upcoming',
      students: 0,
      studentList: [],
    }
    setBatches([newBatch, ...batches])
  }

  function handleStatusChange(id, newStatus) {
    setBatches(batches.map((b) => (b.id === id ? { ...b, status: newStatus } : b)))
    setSelectedBatch((prev) => (prev && prev.id === id ? { ...prev, status: newStatus } : prev))
  }

  const facultyNames = [...new Set(batches.map((b) => b.facultyName))]

  return (
    <div>
      <PageHeader
        title="Batches"
        subtitle="Manage batches and schedules here."
        actionLabel="+ Add Batch"
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
            placeholder="Search batches..."
            className="w-full pl-9 pr-3 py-2.5 text-sm border border-neutral-300 rounded-lg outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
          />
        </div>
        <select
          value={courseFilter}
          onChange={(e) => setCourseFilter(e.target.value)}
          className="px-3.5 py-2.5 text-sm border border-neutral-300 rounded-lg outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 bg-white"
        >
          <option value="All">All Courses</option>
          {courses.map((c) => (
            <option key={c.id} value={c.name}>{c.name}</option>
          ))}
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3.5 py-2.5 text-sm border border-neutral-300 rounded-lg outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 bg-white"
        >
          <option value="All">All Statuses</option>
          <option value="Active">Active</option>
          <option value="Upcoming">Upcoming</option>
          <option value="Inactive">Inactive</option>
        </select>
        <select
          value={facultyFilter}
          onChange={(e) => setFacultyFilter(e.target.value)}
          className="px-3.5 py-2.5 text-sm border border-neutral-300 rounded-lg outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 bg-white"
        >
          <option value="All">All Faculty</option>
          {facultyNames.map((name) => (
            <option key={name} value={name}>{name}</option>
          ))}
        </select>
      </div>

      <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden shadow-sm">
        {batches.length === 0 ? (
          <EmptyState
            title="No batches yet"
            message="Create your first batch to start scheduling classes."
            actionLabel="+ Add Batch"
            onAction={() => setModalOpen(true)}
          />
        ) : filteredBatches.length === 0 ? (
          <EmptyState
            title="No matching batches"
            message="Try adjusting your search or filters to find what you're looking for."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[620px] text-sm text-left">
              <thead className="bg-neutral-50 text-neutral-500 uppercase text-xs">
                <tr>
                  <th className="px-5 py-3">Batch Name</th>
                  <th className="px-5 py-3">Course</th>
                  <th className="px-5 py-3">Faculty</th>
                  <th className="px-5 py-3">Timing</th>
                  <th className="px-5 py-3">Students</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {filteredBatches.map((batch) => (
                  <tr
                    key={batch.id}
                    className="hover:bg-neutral-50 cursor-pointer"
                    onClick={() => setSelectedBatch(batch)}
                  >
                    <td className="px-5 py-3 font-medium text-neutral-800">{batch.name}</td>
                    <td className="px-5 py-3 text-neutral-600">{batch.course}</td>
                    <td className="px-5 py-3 text-neutral-600">{batch.facultyName}</td>
                    <td className="px-5 py-3 text-neutral-600">{batch.timing}</td>
                    <td className="px-5 py-3 text-neutral-600">{batch.students} / {batch.capacity}</td>
                    <td className="px-5 py-3">
                      <StatusBadge status={batch.status} />
                    </td>
                    <td className="px-5 py-3 text-right">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          setSelectedBatch(batch)
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
          </div>
        )}
      </div>

      <AddBatchModal open={modalOpen} onClose={() => setModalOpen(false)} onAdd={handleAddBatch} />
      <BatchDetailsDrawer batch={selectedBatch} onClose={() => setSelectedBatch(null)} onStatusChange={handleStatusChange} />
    </div>
  )
}

export default Batches