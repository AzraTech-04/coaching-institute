export const attendanceRecords = [
  // JEE Advanced - Morning (batchId 1): Aditi Sharma (studentId 1), Arjun Nair (studentId 6)
  { id: 1, studentId: 1, batchId: 1, date: '2026-08-08', session: 'Morning Session', status: 'Present', submitted: true, submittedAt: '08 Aug 2026, 9:10 AM' },
  { id: 2, studentId: 6, batchId: 1, date: '2026-08-08', session: 'Morning Session', status: 'Absent', submitted: true, submittedAt: '08 Aug 2026, 9:10 AM' },
  { id: 3, studentId: 1, batchId: 1, date: '2026-08-10', session: 'Morning Session', status: 'Present', submitted: true, submittedAt: '10 Aug 2026, 9:05 AM' },
  { id: 4, studentId: 6, batchId: 1, date: '2026-08-10', session: 'Morning Session', status: 'Absent', submitted: true, submittedAt: '10 Aug 2026, 9:05 AM' },
  { id: 5, studentId: 1, batchId: 1, date: '2026-08-12', session: 'Morning Session', status: 'Present', submitted: true, submittedAt: '12 Aug 2026, 9:12 AM' },
  { id: 6, studentId: 6, batchId: 1, date: '2026-08-12', session: 'Morning Session', status: 'Present', submitted: true, submittedAt: '12 Aug 2026, 9:12 AM' },
  { id: 7, studentId: 1, batchId: 1, date: '2026-08-15', session: 'Morning Session', status: 'Present', submitted: true, submittedAt: '15 Aug 2026, 9:08 AM' },
  { id: 8, studentId: 6, batchId: 1, date: '2026-08-15', session: 'Morning Session', status: 'Absent', submitted: true, submittedAt: '15 Aug 2026, 9:08 AM' },
  { id: 9, studentId: 1, batchId: 1, date: '2026-08-19', session: 'Morning Session', status: 'Present', submitted: true, submittedAt: '19 Aug 2026, 9:00 AM' },
  { id: 10, studentId: 6, batchId: 1, date: '2026-08-19', session: 'Morning Session', status: 'Late', submitted: true, submittedAt: '19 Aug 2026, 9:20 AM' },

  // JEE Advanced - Evening (batchId 2): Priya Singh (studentId 3)
  { id: 11, studentId: 3, batchId: 2, date: '2026-08-08', session: 'Evening Session', status: 'Present', submitted: true, submittedAt: '08 Aug 2026, 5:10 PM' },
  { id: 12, studentId: 3, batchId: 2, date: '2026-08-10', session: 'Evening Session', status: 'Present', submitted: true, submittedAt: '10 Aug 2026, 5:05 PM' },
  { id: 13, studentId: 3, batchId: 2, date: '2026-08-12', session: 'Evening Session', status: 'Present', submitted: true, submittedAt: '12 Aug 2026, 5:12 PM' },
  { id: 14, studentId: 3, batchId: 2, date: '2026-08-15', session: 'Evening Session', status: 'Present', submitted: true, submittedAt: '15 Aug 2026, 5:08 PM' },
  { id: 15, studentId: 3, batchId: 2, date: '2026-08-19', session: 'Evening Session', status: 'Present', submitted: true, submittedAt: '19 Aug 2026, 5:00 PM' },

  // NEET Batch A (batchId 3): Rohan Verma (studentId 2)
  { id: 16, studentId: 2, batchId: 3, date: '2026-08-08', session: 'Morning Session', status: 'Present', submitted: true, submittedAt: '08 Aug 2026, 8:10 AM' },
  { id: 17, studentId: 2, batchId: 3, date: '2026-08-10', session: 'Morning Session', status: 'Present', submitted: true, submittedAt: '10 Aug 2026, 8:05 AM' },
  { id: 18, studentId: 2, batchId: 3, date: '2026-08-12', session: 'Morning Session', status: 'Absent', submitted: true, submittedAt: '12 Aug 2026, 8:12 AM' },
  { id: 19, studentId: 2, batchId: 3, date: '2026-08-15', session: 'Morning Session', status: 'Present', submitted: true, submittedAt: '15 Aug 2026, 8:08 AM' },
  { id: 20, studentId: 2, batchId: 3, date: '2026-08-19', session: 'Morning Session', status: 'Present', submitted: true, submittedAt: '19 Aug 2026, 8:00 AM' },

  // NEET Batch B (batchId 4): Sneha Gupta (studentId 5)
  { id: 21, studentId: 5, batchId: 4, date: '2026-08-08', session: 'Afternoon Session', status: 'Present', submitted: true, submittedAt: '08 Aug 2026, 2:10 PM' },
  { id: 22, studentId: 5, batchId: 4, date: '2026-08-10', session: 'Afternoon Session', status: 'Present', submitted: true, submittedAt: '10 Aug 2026, 2:05 PM' },
  { id: 23, studentId: 5, batchId: 4, date: '2026-08-12', session: 'Afternoon Session', status: 'Present', submitted: true, submittedAt: '12 Aug 2026, 2:12 PM' },
  { id: 24, studentId: 5, batchId: 4, date: '2026-08-15', session: 'Afternoon Session', status: 'Present', submitted: true, submittedAt: '15 Aug 2026, 2:08 PM' },
  { id: 25, studentId: 5, batchId: 4, date: '2026-08-19', session: 'Afternoon Session', status: 'Present', submitted: true, submittedAt: '19 Aug 2026, 2:00 PM' },

  // Foundation - Class 10 (batchId 5): Karan Mehta (studentId 4)
  { id: 26, studentId: 4, batchId: 5, date: '2026-08-09', session: 'Evening Session', status: 'Present', submitted: true, submittedAt: '09 Aug 2026, 4:10 PM' },
  { id: 27, studentId: 4, batchId: 5, date: '2026-08-11', session: 'Evening Session', status: 'Present', submitted: true, submittedAt: '11 Aug 2026, 4:05 PM' },
  { id: 28, studentId: 4, batchId: 5, date: '2026-08-13', session: 'Evening Session', status: 'Present', submitted: true, submittedAt: '13 Aug 2026, 4:12 PM' },
  { id: 29, studentId: 4, batchId: 5, date: '2026-08-16', session: 'Evening Session', status: 'Leave', submitted: true, submittedAt: '16 Aug 2026, 4:08 PM' },
  { id: 30, studentId: 4, batchId: 5, date: '2026-08-20', session: 'Evening Session', status: 'Present', submitted: true, submittedAt: '20 Aug 2026, 4:00 PM' },
]

export const sessionOptions = ['Morning Session', 'Afternoon Session', 'Evening Session']
export const attendanceStatusOptions = ['Present', 'Absent', 'Late', 'Leave']