import { Link } from 'react-router-dom'
import PageHeader from '../PageHeader'
import StatCard from '../StatCard'
import StatusBadge from '../StatusBadge'
import { leads } from '../../data/leadsData'
import { admissionsRecords } from '../../data/admissionsData'
import { counsellingRecords } from '../../data/counsellingData'
import { messages } from '../../data/communicationData'
import { settingsUsers } from '../../data/settingsUsersData'

function CounsellorDashboard({ counsellorId }) {
  // Resolve the counsellor's name from settingsUsers if an ID was provided.
  // Note: per-counsellor filtering of counsellingData is not yet possible because
  // counsellingData stores counsellor names as plain strings with no FK to settingsUsers.
  // The dashboard therefore remains a global pipeline view.
  const counsellor = settingsUsers.find((u) => u.id === counsellorId)
  const subtitle = counsellor
    ? `Welcome back, ${counsellor.name}. Admissions pipeline and communication overview.`
    : 'Admissions pipeline and communication overview.'

  const newLeads = leads.filter((l) => l.status === 'New').length
  const followUps = leads.filter((l) => l.status === 'Follow-up').length
  const converted = leads.filter((l) => l.status === 'Converted').length
  const conversionRate = leads.length > 0 ? Math.round((converted / leads.length) * 100) : 0

  const stats = [
    { label: 'Total Leads', value: leads.length, change: 'All time', trend: 'up' },
    { label: 'New Leads', value: newLeads, change: 'Awaiting contact', trend: 'up' },
    { label: 'Follow-ups Due', value: followUps, change: 'Need attention', trend: 'down' },
    { label: 'Conversion Rate', value: `${conversionRate}%`, change: `${admissionsRecords.length} admissions`, trend: 'up' },
  ]

  const recentLeads = [...leads]
    .sort((a, b) => new Date(b.followUpDate) - new Date(a.followUpDate))
    .slice(0, 5)

  const messagesSent = messages.filter((m) => m.status === 'Sent' || m.status === 'Published').length
  const scheduledCounselling = counsellingRecords.filter((c) => c.status === 'Scheduled').length

  return (
    <div>
      <PageHeader title="Counsellor Dashboard" subtitle={subtitle} />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((s) => <StatCard key={s.label} label={s.label} value={s.value} change={s.change} trend={s.trend} />)}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-neutral-200 rounded-xl shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-neutral-100">
            <h3 className="text-base font-semibold text-neutral-800">Recent Leads</h3>
          </div>
          <ul className="divide-y divide-neutral-100">
            {recentLeads.map((lead) => (
              <li key={lead.id} className="px-5 py-3 flex items-center justify-between text-sm">
                <div>
                  <p className="font-medium text-neutral-800">{lead.name}</p>
                  <p className="text-xs text-neutral-400">{lead.course} · Follow-up {lead.followUpDate}</p>
                </div>
                <StatusBadge status={lead.status} />
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white border border-neutral-200 rounded-xl shadow-sm p-5">
          <h3 className="text-base font-semibold text-neutral-800 mb-4">Activity Snapshot</h3>
          <div className="space-y-3">
            <div className="flex justify-between text-sm"><span className="text-neutral-500">Scheduled counselling sessions</span><span className="font-medium text-neutral-800">{scheduledCounselling}</span></div>
            <div className="flex justify-between text-sm"><span className="text-neutral-500">Total admissions</span><span className="font-medium text-neutral-800">{admissionsRecords.length}</span></div>
            <div className="flex justify-between text-sm"><span className="text-neutral-500">Messages sent</span><span className="font-medium text-neutral-800">{messagesSent}</span></div>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 mt-6">
        <Link to="/leads" className="border border-neutral-300 text-neutral-700 text-sm font-medium px-4 py-2 rounded-lg hover:bg-neutral-50 transition-colors">View Leads</Link>
        <Link to="/admissions/counselling" className="border border-neutral-300 text-neutral-700 text-sm font-medium px-4 py-2 rounded-lg hover:bg-neutral-50 transition-colors">Counselling</Link>
        <Link to="/admissions" className="border border-neutral-300 text-neutral-700 text-sm font-medium px-4 py-2 rounded-lg hover:bg-neutral-50 transition-colors">Admissions</Link>
        <Link to="/ai-assistant" className="bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">AI Assistant</Link>
      </div>
    </div>
  )
}

export default CounsellorDashboard