import { useState } from 'react'
import { courses as initialCourses, categoryOptions, levelOptions } from '../data/coursesData'
import { batches } from '../data/batchesData'
import { students } from '../data/studentsData'
import PageHeader from '../components/PageHeader'
import EmptyState from '../components/EmptyState'
import StatCard from '../components/StatCard'
import StatusBadge from '../components/StatusBadge'
import AddCourseModal from '../components/AddCourseModal'
import CourseDetailsDrawer from '../components/CourseDetailsDrawer'

function Courses() {
  const [courses, setCourses] = useState(initialCourses)
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('All')
  const [statusFilter, setStatusFilter] = useState('All')
  const [levelFilter, setLevelFilter] = useState('All')
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedCourse, setSelectedCourse] = useState(null)

  const filteredCourses = courses.filter((c) => {
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase())
    const matchesCategory = categoryFilter === 'All' || c.category === categoryFilter
    const matchesStatus = statusFilter === 'All' || c.status === statusFilter
    const matchesLevel = levelFilter === 'All' || c.level === levelFilter
    return matchesSearch && matchesCategory && matchesStatus && matchesLevel
  })

  const stats = [
    { label: 'Total Courses', value: courses.length, change: 'All programs', trend: 'up' },
    { label: 'Active Courses', value: courses.filter((c) => c.status === 'Active').length, change: 'Currently running', trend: 'up' },
    { label: 'Total Enrolled Students', value: students.length, change: 'Across all courses', trend: 'up' },
    { label: 'Active Batches', value: batches.filter((b) => b.status === 'Active').length, change: 'Currently running', trend: 'up' },
  ]

  function handleAddCourse(form) {
    const newCourse = {
      id: courses.length + 1,
      name: form.name,
      category: form.category,
      level: form.level,
      duration: form.duration,
      subjects: form.subjects,
      status: 'Active',
      activeBatches: 0,
      enrolledStudents: 0,
      facultyNames: [],
    }
    setCourses([newCourse, ...courses])
  }

  function handleStatusChange(id, newStatus) {
    setCourses(courses.map((c) => (c.id === id ? { ...c, status: newStatus } : c)))
    setSelectedCourse((prev) => (prev && prev.id === id ? { ...prev, status: newStatus } : prev))
  }

  return (
    <div>
      <PageHeader
        title="Courses"
        subtitle="Manage the institute's academic programs."
        actionLabel="+ Add Course"
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
            placeholder="Search courses..."
            className="w-full pl-9 pr-3 py-2.5 text-sm border border-neutral-300 rounded-lg outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-3.5 py-2.5 text-sm border border-neutral-300 rounded-lg outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 bg-white"
        >
          <option value="All">All Categories</option>
          {categoryOptions.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
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
          value={levelFilter}
          onChange={(e) => setLevelFilter(e.target.value)}
          className="px-3.5 py-2.5 text-sm border border-neutral-300 rounded-lg outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 bg-white"
        >
          <option value="All">All Levels</option>
          {levelOptions.map((l) => (
            <option key={l} value={l}>{l}</option>
          ))}
        </select>
      </div>

      {courses.length === 0 ? (
        <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden shadow-sm">
          <EmptyState
            title="No courses yet"
            message="Add your first course to start building your academic programs."
            actionLabel="+ Add Course"
            onAction={() => setModalOpen(true)}
          />
        </div>
      ) : filteredCourses.length === 0 ? (
        <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden shadow-sm">
          <EmptyState
            title="No matching courses"
            message="Try adjusting your search or filters to find what you're looking for."
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCourses.map((course) => (
            <div
              key={course.id}
              onClick={() => setSelectedCourse(course)}
              className="bg-white border border-neutral-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-base font-semibold text-neutral-800">{course.name}</h3>
                  <p className="text-sm text-neutral-500 mt-0.5">{course.category} · {course.level}</p>
                </div>
                <StatusBadge status={course.status} />
              </div>

              <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                <div>
                  <p className="text-lg font-bold text-neutral-800">{course.duration}</p>
                  <p className="text-xs text-neutral-400">Duration</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-neutral-800">{course.activeBatches}</p>
                  <p className="text-xs text-neutral-400">Batches</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-neutral-800">{course.enrolledStudents}</p>
                  <p className="text-xs text-neutral-400">Students</p>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-neutral-100 flex items-center justify-between">
                <div className="flex flex-wrap gap-1">
                  {course.subjects.slice(0, 2).map((s) => (
                    <span key={s} className="px-2 py-0.5 rounded-full text-xs bg-neutral-100 text-neutral-600">
                      {s}
                    </span>
                  ))}
                  {course.subjects.length > 2 && (
                    <span className="px-2 py-0.5 rounded-full text-xs bg-neutral-100 text-neutral-600">
                      +{course.subjects.length - 2}
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    setSelectedCourse(course)
                  }}
                  className="text-brand-600 hover:text-brand-700 font-medium text-sm shrink-0"
                >
                  View
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <AddCourseModal open={modalOpen} onClose={() => setModalOpen(false)} onAdd={handleAddCourse} />
      <CourseDetailsDrawer course={selectedCourse} onClose={() => setSelectedCourse(null)} onStatusChange={handleStatusChange} />
    </div>
  )
}

export default Courses