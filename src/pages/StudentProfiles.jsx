import { useState } from 'react'
import { students, batchOptions } from '../data/studentsData'
import StatusBadge from '../components/StatusBadge'
import PageHeader from '../components/PageHeader'
import EmptyState from '../components/EmptyState'
import StatCard from '../components/StatCard'
import StudentProfileDrawer from '../components/StudentProfileDrawer'

function completionFor(student) {
  const fields = [student.name, student.email, student.contact, student.course, student.batch]
  const filled = fields.filter((f) => f && String(f).trim().length > 0).length
  return Math.round((filled / fields.length) * 100)
}

function StudentProfiles() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [batchFilter, setBatchFilter] = useState('All')
  const [courseFilter, setCourseFilter] = useState('All')
  const [selectedStudentId, setSelectedStudentId] = useState(null)

  const courseOptions = [...new Set(students.map((s) => s.course))]

  const filtered = students.filter((s) => {
    const q = search.toLowerCase()
    const matchesSearch =
      s.name.toLowerCase().includes(q) ||
      s.email.toLowerCase().includes(q) ||
      s.contact.toLowerCase().includes(q) ||
      s.batch.toLowerCase().includes(q)
    const matchesStatus = statusFilter === 'All' || s.status === statusFilter
    const matchesBatch = batchFilter === 'All' || s.batch === batchFilter
    const matchesCourse = courseFilter === 'All' || s.course === courseFilter
    return matchesSearch && matchesStatus && matchesBatch && matchesCourse
  })

  const stats = [
    { label: 'Total Students', value: students.length, change: 'All records', trend: 'up' },
    { label: 'Active Students', value: students.filter((s) => s.status === 'Active').length, change: 'Currently enrolled', trend: 'up' },
    { label: 'Inactive Students', value: students.filter((s) => s.status === 'Inactive').length, change: 'Not currently active', trend: 'down' },
    { label: 'Complete Profiles', value: students.filter((s) => completionFor(s) === 100).length, change: 'All fields filled', trend: 'up' },
  ]

  const selectedStudent = selectedStudentId ? students.find((s) => s.id === selectedStudentId) : null

  return (
    <div>
      <PageHeader title="Student Profiles" subtitle="View and manage detailed student information." />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((s) => <StatCard key={s.label} label={s.label} value={s.value} change={s.change} trend={s.trend} />)}
      </div>

      <div className="flex flex-col sm:flex-row flex-wrap gap-3 mb-4">
        <div className="relative flex-1 min-w-[180px]">
          <svg className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 10.5A6.5 6.5 0 114 10.5a6.5 6.5 0 0113 0z" />
          </svg>
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name, email, contact, or batch..." className="w-full pl-9 pr-3 py-2.5 text-sm border border-neutral-300 rounded-lg outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500" />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-3.5 py-2.5 text-sm border border-neutral-300 rounded-lg outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 bg-white">
          <option value="All">All Statuses</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
        <select value={batchFilter} onChange={(e) => setBatchFilter(e.target.value)} className="px-3.5 py-2.5 text-sm border border-neutral-300 rounded-lg outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 bg-white">
          <option value="All">All Batches</option>
          {batchOptions.map((b) => <option key={b} value={b}>{b}</option>)}
        </select>
        <select value={courseFilter} onChange={(e) => setCourseFilter(e.target.value)} className="px-3.5 py-2.5 text-sm border border-neutral-300 rounded-lg outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 bg-white">
          <option value="All">All Courses</option>
          {courseOptions.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      <div className="bg-white border border-neutral-200 rounded-xl shadow-sm overflow-hidden">
        {students.length === 0 ? (
          <EmptyState title="No students yet" message="Students will appear here once added." />
        ) : filtered.length === 0 ? (
          <EmptyState title="No matching student profiles" message="Try adjusting your search or filters." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left min-w-[760px]">
              <thead className="bg-neutral-50 text-neutral-500 uppercase text-xs">
                <tr>
                  <th className="px-5 py-3">Student</th>
                  <th className="px-5 py-3">Course</th>
                  <th className="px-5 py-3">Batch</th>
                  <th className="px-5 py-3">Contact</th>
                  <th className="px-5 py-3">Email</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3">Profile</th>
                  <th className="px-5 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {filtered.map((s) => (
                  <tr key={s.id} className="hover:bg-neutral-50 cursor-pointer" onClick={() => setSelectedStudentId(s.id)}>
                    <td className="px-5 py-3 font-medium text-neutral-800">{s.name}</td>
                    <td className="px-5 py-3 text-neutral-600">{s.course}</td>
                    <td className="px-5 py-3 text-neutral-600">{s.batch}</td>
                    <td className="px-5 py-3 text-neutral-600">{s.contact}</td>
                    <td className="px-5 py-3 text-neutral-600">{s.email}</td>
                    <td className="px-5 py-3"><StatusBadge status={s.status} /></td>
                    <td className="px-5 py-3 text-neutral-600">{completionFor(s)}%</td>
                    <td className="px-5 py-3 text-right">
                      <button type="button" onClick={(e) => { e.stopPropagation(); setSelectedStudentId(s.id) }} className="text-brand-600 hover:text-brand-700 font-medium text-sm">View</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <StudentProfileDrawer student={selectedStudent} onClose={() => setSelectedStudentId(null)} />
    </div>
  )
}

export default StudentProfiles