import { roleOptions, userStatusOptions, branchOptions, permissionMatrix, permissionModules } from '../data/settingsUsersData'

function levelStyle(level) {
  if (level === 'Manage') return 'bg-green-50 text-green-700'
  if (level === 'Edit') return 'bg-blue-50 text-blue-700'
  if (level === 'View') return 'bg-neutral-100 text-neutral-600'
  return 'bg-neutral-50 text-neutral-400'
}

function UserDetailsDrawer({ user, onClose, onUpdate }) {
  if (!user) return null

  const permissions = permissionMatrix[user.role] || {}

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white w-full max-w-sm h-full shadow-lg overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200">
          <h3 className="text-lg font-semibold text-neutral-800">User Details</h3>
          <button type="button" onClick={onClose} className="text-neutral-400 hover:text-neutral-600" aria-label="Close">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="px-6 py-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 font-semibold text-lg">
              {user.name.split(' ').filter((n) => /^[A-Z]/.test(n)).map((n) => n[0]).join('').slice(0, 2)}
            </div>
            <div>
              <h4 className="text-base font-semibold text-neutral-800">{user.name}</h4>
              <p className="text-sm text-neutral-500">{user.email}</p>
            </div>
          </div>

          <div className="mt-6 space-y-3 border-t border-neutral-100 pt-4">
            <div>
              <label className="block text-sm text-neutral-500 mb-1.5">Role</label>
              <select
                value={user.role}
                onChange={(e) => onUpdate(user.id, { role: e.target.value })}
                className="w-full px-3.5 py-2.5 text-sm border border-neutral-300 rounded-lg outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 bg-white"
              >
                {roleOptions.map((r) => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm text-neutral-500 mb-1.5">Branch</label>
              <select
                value={user.branch}
                onChange={(e) => onUpdate(user.id, { branch: e.target.value })}
                className="w-full px-3.5 py-2.5 text-sm border border-neutral-300 rounded-lg outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 bg-white"
              >
                {branchOptions.map((b) => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm text-neutral-500 mb-1.5">Status</label>
              <select
                value={user.status}
                onChange={(e) => onUpdate(user.id, { status: e.target.value })}
                className="w-full px-3.5 py-2.5 text-sm border border-neutral-300 rounded-lg outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 bg-white"
              >
                {userStatusOptions.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-neutral-500">Last active</span>
              <span className="text-neutral-800 font-medium">{user.lastActive}</span>
            </div>
          </div>

          <div className="mt-6 border-t border-neutral-100 pt-4">
            <p className="text-xs font-semibold text-neutral-400 uppercase mb-3">Access Permissions — {user.role}</p>
            <ul className="space-y-1.5">
              {permissionModules.map((mod) => (
                <li key={mod} className="flex items-center justify-between text-sm">
                  <span className="text-neutral-600">{mod}</span>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${levelStyle(permissions[mod])}`}>
                    {permissions[mod] || 'None'}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserDetailsDrawer