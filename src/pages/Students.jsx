import { useState } from 'react'
import { students as initialStudents, batchOptions } from '../data/studentsData'
import StatusBadge from '../components/StatusBadge'
import PageHeader from '../components/PageHeader'
import EmptyState from '../components/EmptyState'
import AddStudentModal from '../components/AddStudentModal'
import StudentDetailsDrawer from '../components/StudentDetailsDrawer'

function Students() {
  const [students, setStudents] = useState(initialStudents)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [batchFilter, setBatchFilter] = useState('All')
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState(null)

  const filteredStudents = students.filter((student) => {
    const matchesSearch = student.name.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === 'All' || student.status === statusFilter
    const matchesBatch = batchFilter === 'All' || student.batch === batchFilter
    return matchesSearch && matchesStatus && matchesBatch
  })

  function handleAddStudent(form) {
    const newStudent = {
      id: students.length + 1,
      name: form.name,
      email: form.email,
      contact: form.contact,
      batch: form.batch,
      course: form.course,
      status: 'Active',
      joinDate: new Date().toISOString().slice(0, 10),
      attendance: 100,
      avgScore: 0,
    }
    setStudents([newStudent, ...students])
  }

  const hasActiveFilters = search || statusFilter !== 'All' || batchFilter !== 'All'

  return (
    <div>
      <PageHeader
        title="Students"
        subtitle="Manage student records here."
        actionLabel="+ Add Student"
        onAction={() => setModalOpen(true)}
      />

      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <svg className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 10.5A6.5 6.5 0 114 10.5a6.5 6.5 0 0113 0z" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search students by name..."
            className="w-full pl-9 pr-3 py-2.5 text-sm border border-neutral-300 rounded-lg outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3.5 py-2.5 text-sm border border-neutral-300 rounded-lg outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 bg-white"
        >
          <option value="All">All Statuses</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
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
      </div>

      <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden shadow-sm">
        {students.length === 0 ? (
          <EmptyState
            title="No students yet"
            message="Add your first student to start building your student records."
            actionLabel="+ Add Student"
            onAction={() => setModalOpen(true)}
          />
        ) : filteredStudents.length === 0 ? (
          <EmptyState
            title="No matching students"
            message="Try adjusting your search or filters to find what you're looking for."
          />
        ) : (
          <table className="w-full text-sm text-left">
            <thead className="bg-neutral-50 text-neutral-500 uppercase text-xs">
              <tr>
                <th className="px-5 py-3">Name</th>
                <th className="px-5 py-3">Batch</th>
                <th className="px-5 py-3">Contact</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {filteredStudents.map((student) => (
                <tr
                  key={student.id}
                  className="hover:bg-neutral-50 cursor-pointer"
                  onClick={() => setSelectedStudent(student)}
                >
                  <td className="px-5 py-3 font-medium text-neutral-800">{student.name}</td>
                  <td className="px-5 py-3 text-neutral-600">{student.batch}</td>
                  <td className="px-5 py-3 text-neutral-600">{student.contact}</td>
                  <td className="px-5 py-3">
                    <StatusBadge status={student.status} />
                  </td>
                  <td className="px-5 py-3 text-right">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        setSelectedStudent(student)
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

      <AddStudentModal open={modalOpen} onClose={() => setModalOpen(false)} onAdd={handleAddStudent} />
      <StudentDetailsDrawer student={selectedStudent} onClose={() => setSelectedStudent(null)} />
    </div>
  )
}

export default Students