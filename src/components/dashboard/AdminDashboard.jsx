import StatCard from '../StatCard'
import PageHeader from '../PageHeader'
import StatusBadge from '../StatusBadge'
import { dashboardStats } from '../../data/dashboardData'
import { settingsUsers } from '../../data/settingsUsersData'
import { batches } from '../../data/batchesData'
import { students } from '../../data/studentsData'
import { attendanceRecords } from '../../data/attendanceData'
import { leads } from '../../data/leadsData'
import { admissionsRecords } from '../../data/admissionsData'
import { feeRecords } from '../../data/feesData'

function AdminDashboard({ adminId }) {
  const admin = settingsUsers.find((u) => u.id === adminId)
  const subtitle = admin ? `Welcome back, ${admin.name}.` : 'Welcome to Aravya.'

  // ── Attendance by batch (real, computed) ──────────────────────────────
  const batchAttendance = batches.map((b) => {
    const records = attendanceRecords.filter((r) => r.batchId === b.id)
    const present = records.filter((r) => r.status === 'Present').length
    const rate = records.length > 0 ? Math.round((present / records.length) * 100) : null
    return { name: b.name, rate, sessions: records.length }
  }).filter((b) => b.rate !== null)

  // ── Top attendance (real, computed per student) ───────────────────────
  const topAttendance = students.map((s) => {
    const records = attendanceRecords.filter((r) => r.studentId === s.id)
    const present = records.filter((r) => r.status === 'Present').length
    const rate = records.length > 0 ? Math.round((present / records.length) * 100) : null
    return { name: s.name, rate }
  }).filter((s) => s.rate !== null).sort((a, b) => b.rate - a.rate).slice(0, 5)

  // ── Leads/Admissions overview (real) ───────────────────────────────────
  const leadStats = {
    new: leads.filter((l) => l.status === 'New').length,
    followUp: leads.filter((l) => l.status === 'Follow-up').length,
    converted: leads.filter((l) => l.status === 'Converted').length,
    lost: leads.filter((l) => l.status === 'Lost').length,
  }
  const conversionRate = leads.length > 0 ? Math.round((leadStats.converted / leads.length) * 100) : 0

  // ── Recent activities (real dates, merged from 3 sources) ─────────────
  const activities = [
    ...leads.map((l) => ({ type: 'Lead', text: `${l.name} — ${l.status}`, date: l.followUpDate })),
    ...admissionsRecords.map((a) => ({ type: 'Admission', text: `${a.name} admitted to ${a.batch}`, date: a.admissionDate })),
    ...feeRecords.flatMap((f) => {
      const student = students.find((s) => s.id === f.studentId)
      return f.paymentHistory.map((p) => ({
        type: 'Payment',
        text: `${student ? student.name : 'Student'} paid ₹${p.amount.toLocaleString('en-IN')}`,
        date: p.date,
      }))
    }),
  ].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 6)

  const activityIcon = { Lead: 'M12 6v6l4 2', Admission: 'M5 13l4 4L19 7', Payment: 'M12 8c-1.657 0-3 .672-3 1.5' }
  const activityColor = { Lead: 'bg-blue-50 text-blue-600', Admission: 'bg-green-50 text-green-600', Payment: 'bg-brand-50 text-brand-600' }

  // ── Fee outstanding total (real) ───────────────────────────────────────
  const totalOutstanding = feeRecords.reduce((sum, f) => {
    const paid = f.paymentHistory.reduce((s, p) => s + p.amount, 0)
    return sum + (f.totalFee - paid)
  }, 0)

  // ── Quick insights (derived, no fabrication) ───────────────────────────
  const insights = []
  if (batchAttendance.length > 0) {
    const best = [...batchAttendance].sort((a, b) => b.rate - a.rate)[0]
    insights.push(`${best.name} has the strongest attendance at ${best.rate}%.`)
  }
  if (leadStats.followUp > 0) {
    insights.push(`${leadStats.followUp} lead${leadStats.followUp === 1 ? '' : 's'} currently need${leadStats.followUp === 1 ? 's' : ''} follow-up.`)
  }
  const largestBatch = [...batches].sort((a, b) => b.students - a.students)[0]
  if (largestBatch) insights.push(`${largestBatch.name} is the largest batch with ${largestBatch.students} students.`)
  if (totalOutstanding > 0) insights.push(`₹${totalOutstanding.toLocaleString('en-IN')} in fees remains outstanding across all students.`)

  return (
    <div>
      <PageHeader title="Dashboard" subtitle={subtitle} />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {dashboardStats.map((stat) => (
          <StatCard key={stat.label} label={stat.label} value={stat.value} change={stat.change} trend={stat.trend} />
        ))}
      </div>

      {/* Attendance trend + Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        <div className="bg-white border border-neutral-200 rounded-xl shadow-sm p-5">
          <h3 className="text-base font-semibold text-neutral-800">Attendance by Batch</h3>
          <p className="text-xs text-neutral-400 mb-4">Present rate across recorded sessions</p>
          {batchAttendance.length === 0 ? (
            <p className="text-sm text-neutral-400 py-6 text-center">No attendance data recorded yet.</p>
          ) : (
            <div className="space-y-3">
              {batchAttendance.map((b) => (
                <div key={b.name}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-neutral-600 font-medium">{b.name}</span>
                    <span className="text-neutral-500">{b.rate}%</span>
                  </div>
                  <div className="h-2 bg-neutral-100 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${b.rate >= 85 ? 'bg-green-500' : b.rate >= 65 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{ width: `${b.rate}%` }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white border border-neutral-200 rounded-xl shadow-sm p-5">
          <h3 className="text-base font-semibold text-neutral-800 mb-4">Recent Activities</h3>
          {activities.length === 0 ? (
            <p className="text-sm text-neutral-400 py-6 text-center">No recent activity to show.</p>
          ) : (
            <ul className="space-y-3">
              {activities.map((a, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${activityColor[a.type]}`}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={activityIcon[a.type]} />
                    </svg>
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm text-neutral-800 truncate">{a.text}</p>
                    <p className="text-xs text-neutral-400">{a.type} · {a.date}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Top Attendance + Batch Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        <div className="bg-white border border-neutral-200 rounded-xl shadow-sm p-5">
          <h3 className="text-base font-semibold text-neutral-800 mb-4">Top Attendance</h3>
          {topAttendance.length === 0 ? (
            <p className="text-sm text-neutral-400 py-6 text-center">No attendance data recorded yet.</p>
          ) : (
            <ul className="space-y-2.5">
              {topAttendance.map((s, i) => (
                <li key={s.name} className="flex items-center justify-between text-sm">
                  <span className="text-neutral-700"><span className="text-neutral-400 font-mono mr-2">{String(i + 1).padStart(2, '0')}</span>{s.name}</span>
                  <span className="font-medium text-green-700">{s.rate}%</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="bg-white border border-neutral-200 rounded-xl shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-neutral-100">
            <h3 className="text-base font-semibold text-neutral-800">Batch Overview</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[420px] text-sm text-left">
              <thead className="bg-neutral-50 text-neutral-500 uppercase text-xs">
                <tr><th className="px-5 py-2.5">Batch</th><th className="px-5 py-2.5">Students</th><th className="px-5 py-2.5">Faculty</th><th className="px-5 py-2.5">Status</th></tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {batches.map((b) => (
                  <tr key={b.id}>
                    <td className="px-5 py-2.5 font-medium text-neutral-800">{b.name}</td>
                    <td className="px-5 py-2.5 text-neutral-600">{b.students}</td>
                    <td className="px-5 py-2.5 text-neutral-600">{b.facultyName}</td>
                    <td className="px-5 py-2.5"><StatusBadge status={b.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Leads Overview + Quick Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white border border-neutral-200 rounded-xl shadow-sm p-5">
          <h3 className="text-base font-semibold text-neutral-800 mb-1">Admissions Pipeline</h3>
          <p className="text-xs text-neutral-400 mb-4">{conversionRate}% conversion rate across {leads.length} leads</p>
          <div className="grid grid-cols-4 gap-2 text-center">
            <div><p className="text-lg font-bold text-neutral-800">{leadStats.new}</p><p className="text-xs text-neutral-400">New</p></div>
            <div><p className="text-lg font-bold text-neutral-800">{leadStats.followUp}</p><p className="text-xs text-neutral-400">Follow-up</p></div>
            <div><p className="text-lg font-bold text-green-700">{leadStats.converted}</p><p className="text-xs text-neutral-400">Converted</p></div>
            <div><p className="text-lg font-bold text-red-600">{leadStats.lost}</p><p className="text-xs text-neutral-400">Lost</p></div>
          </div>
        </div>

        <div className="bg-white border border-neutral-200 rounded-xl shadow-sm p-5">
          <h3 className="text-base font-semibold text-neutral-800 mb-4">Quick Insights</h3>
          {insights.length === 0 ? (
            <p className="text-sm text-neutral-400">Not enough data yet for insights.</p>
          ) : (
            <ul className="space-y-2.5">
              {insights.map((text, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-neutral-600">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-500 mt-1.5 shrink-0" />
                  {text}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard