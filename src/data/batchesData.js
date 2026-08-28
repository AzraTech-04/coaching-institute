import { faculty } from './facultyData'
import { students } from './studentsData'

const baseBatches = [
  { id: 1, name: 'JEE Advanced - Morning', course: 'JEE Advanced', facultyId: 1, room: 'Room 101', timing: 'Mon-Sat, 7:00 AM - 9:00 AM', startDate: '2026-01-05', capacity: 45, status: 'Active' },
  { id: 2, name: 'JEE Advanced - Evening', course: 'JEE Advanced', facultyId: 1, room: 'Room 102', timing: 'Mon-Sat, 5:00 PM - 7:00 PM', startDate: '2026-01-05', capacity: 40, status: 'Active' },
  { id: 3, name: 'NEET Batch A', course: 'NEET', facultyId: 2, room: 'Room 201', timing: 'Mon-Fri, 8:00 AM - 10:00 AM', startDate: '2025-12-01', capacity: 48, status: 'Active' },
  { id: 4, name: 'NEET Batch B', course: 'NEET', facultyId: 2, room: 'Room 202', timing: 'Mon-Fri, 2:00 PM - 4:00 PM', startDate: '2025-12-01', capacity: 42, status: 'Active' },
  { id: 5, name: 'Foundation - Class 10', course: 'Foundation - Class 10', facultyId: 3, room: 'Room 301', timing: 'Tue-Sun, 4:00 PM - 6:00 PM', startDate: '2026-02-10', capacity: 35, status: 'Inactive' },
]

function facultyForBatch(facultyId) {
  return faculty.find((f) => f.id === facultyId) || null
}

function studentsForBatch(batchName) {
  return students.filter((s) => s.batch === batchName)
}

export const batches = baseBatches.map((batch) => {
  const assignedFaculty = facultyForBatch(batch.facultyId)
  const enrolledStudents = studentsForBatch(batch.name)
  return {
    ...batch,
    facultyName: assignedFaculty ? assignedFaculty.name : 'Unassigned',
    facultySubject: assignedFaculty ? assignedFaculty.subject : null,
    students: enrolledStudents.length,
    studentList: enrolledStudents,
  }
})

export const timingOptions = ['Morning', 'Afternoon', 'Evening', 'Weekend']



