import { getIdentity } from '../utils/identity'
import AdminDashboard from '../components/dashboard/AdminDashboard'
import FacultyDashboard from '../components/dashboard/FacultyDashboard'
import CounsellorDashboard from '../components/dashboard/CounsellorDashboard'
import StudentDashboard from '../components/dashboard/StudentDashboard'

function Dashboard() {
  const { role, userIdInt } = getIdentity()

  if (role === 'faculty') return <FacultyDashboard facultyId={userIdInt} />
  if (role === 'counsellor') return <CounsellorDashboard counsellorId={userIdInt} />
  if (role === 'student') return <StudentDashboard studentId={userIdInt} />
  return <AdminDashboard adminId={userIdInt} />
}

export default Dashboard