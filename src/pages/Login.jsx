import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { setIdentity } from '../utils/identity'
import { faculty } from '../data/facultyData'
import { students } from '../data/studentsData'

// settingsUsers ID 1 = Aditya Rao (Super Admin)
// settingsUsers ID 6 = Neha Kapoor (Counsellor)
// These are the only admin/counsellor records appropriate for a demo login.
const ADMIN_ID = 1
const COUNSELLOR_ID = 6

function initials(name) {
  return name.split(' ').filter((w) => /^[A-Z]/.test(w)).map((w) => w[0]).join('').slice(0, 2)
}

function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  // null = show role grid  |  'faculty' = show faculty picker  |  'student' = show student picker
  const [demoStep, setDemoStep] = useState(null)

  function handleSubmit(e) {
    e.preventDefault()
    // Mock authentication only — no real backend call yet.
    // Standard form login defaults to the Admin identity for this prototype.
    setIdentity('admin', ADMIN_ID)
    navigate('/')
  }

  function handleRoleClick(role) {
    if (role === 'admin') {
      setIdentity('admin', ADMIN_ID)
      navigate('/')
    } else if (role === 'counsellor') {
      setIdentity('counsellor', COUNSELLOR_ID)
      navigate('/')
    } else {
      // Faculty and Student require a specific person to be chosen.
      setDemoStep(role)
    }
  }

  function handlePersonSelect(role, id) {
    setIdentity(role, id)
    navigate('/')
  }

  // ─── Role selection grid (initial view) ───────────────────────────────────

  const roleGrid = (
    <>
      <div className="flex items-center gap-3 my-7">
        <div className="flex-1 h-px bg-neutral-200" />
        <span className="text-xs font-medium text-neutral-400 uppercase tracking-wide">or continue as a demo user</span>
        <div className="flex-1 h-px bg-neutral-200" />
      </div>

      <p className="text-sm text-neutral-500 mb-4 leading-relaxed">
        Explore Aravya from a specific role's perspective. Each role has its own dashboard, navigation, and available modules.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Admin — direct login, single representative */}
        <button
          type="button"
          onClick={() => handleRoleClick('admin')}
          className="group border border-neutral-200 text-left px-4 py-3.5 rounded-xl hover:bg-neutral-50 hover:border-brand-300 hover:shadow-sm transition-all"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[11px] font-semibold text-brand-600 uppercase tracking-wide mb-1">Administrator</p>
              <p className="text-sm font-semibold text-neutral-800 leading-tight">Aditya Rao</p>
              <p className="text-xs text-neutral-400 mt-0.5 leading-tight">Super Admin · Main Branch</p>
            </div>
            <svg className="w-4 h-4 text-neutral-300 group-hover:text-brand-500 transition-colors shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </button>

        {/* Faculty — requires person selection */}
        <button
          type="button"
          onClick={() => handleRoleClick('faculty')}
          className="group border border-neutral-200 text-left px-4 py-3.5 rounded-xl hover:bg-neutral-50 hover:border-brand-300 hover:shadow-sm transition-all"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[11px] font-semibold text-brand-600 uppercase tracking-wide mb-1">Faculty Member</p>
              <p className="text-sm font-semibold text-neutral-800 leading-tight">Select a member</p>
              <p className="text-xs text-neutral-400 mt-0.5 leading-tight">{faculty.length} faculty available</p>
            </div>
            <svg className="w-4 h-4 text-neutral-300 group-hover:text-brand-500 transition-colors shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </button>

        {/* Counsellor — direct login, single representative */}
        <button
          type="button"
          onClick={() => handleRoleClick('counsellor')}
          className="group border border-neutral-200 text-left px-4 py-3.5 rounded-xl hover:bg-neutral-50 hover:border-brand-300 hover:shadow-sm transition-all"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[11px] font-semibold text-brand-600 uppercase tracking-wide mb-1">Counsellor</p>
              <p className="text-sm font-semibold text-neutral-800 leading-tight">Neha Kapoor</p>
              <p className="text-xs text-neutral-400 mt-0.5 leading-tight">Admissions &amp; leads</p>
            </div>
            <svg className="w-4 h-4 text-neutral-300 group-hover:text-brand-500 transition-colors shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </button>

        {/* Student — requires person selection */}
        <button
          type="button"
          onClick={() => handleRoleClick('student')}
          className="group border border-neutral-200 text-left px-4 py-3.5 rounded-xl hover:bg-neutral-50 hover:border-brand-300 hover:shadow-sm transition-all"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[11px] font-semibold text-brand-600 uppercase tracking-wide mb-1">Student</p>
              <p className="text-sm font-semibold text-neutral-800 leading-tight">Select a student</p>
              <p className="text-xs text-neutral-400 mt-0.5 leading-tight">{students.length} students available</p>
            </div>
            <svg className="w-4 h-4 text-neutral-300 group-hover:text-brand-500 transition-colors shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </button>
      </div>
    </>
  )

  // ─── Faculty picker ────────────────────────────────────────────────────────

  const facultyPicker = (
    <>
      <div className="flex items-center gap-3 mb-6">
        <button
          type="button"
          onClick={() => setDemoStep(null)}
          className="text-neutral-400 hover:text-neutral-700 transition-colors p-1 -ml-1 rounded-lg hover:bg-neutral-100"
          aria-label="Back to role selection"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div>
          <h3 className="text-base font-semibold text-neutral-800 leading-tight">Select Faculty Member</h3>
          <p className="text-xs text-neutral-400">Continue as this person</p>
        </div>
      </div>

      <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
        {faculty.map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => handlePersonSelect('faculty', f.id)}
            className="w-full flex items-center gap-3 border border-neutral-200 rounded-xl px-4 py-3 hover:bg-neutral-50 hover:border-brand-300 transition-colors text-left"
          >
            <div className="w-9 h-9 rounded-full bg-brand-100 text-brand-700 text-sm font-semibold flex items-center justify-center shrink-0">
              {initials(f.name)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-neutral-800 truncate">{f.name}</p>
              <p className="text-xs text-neutral-400 mt-0.5">{f.subject} · {f.experience}</p>
            </div>
            <span
              className={`shrink-0 text-xs font-medium px-2 py-0.5 rounded-full ${
                f.status === 'Active'
                  ? 'bg-green-50 text-green-700'
                  : 'bg-neutral-100 text-neutral-500'
              }`}
            >
              {f.status}
            </span>
          </button>
        ))}
      </div>
    </>
  )

  // ─── Student picker ────────────────────────────────────────────────────────

  const studentPicker = (
    <>
      <div className="flex items-center gap-3 mb-6">
        <button
          type="button"
          onClick={() => setDemoStep(null)}
          className="text-neutral-400 hover:text-neutral-700 transition-colors p-1 -ml-1 rounded-lg hover:bg-neutral-100"
          aria-label="Back to role selection"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div>
          <h3 className="text-base font-semibold text-neutral-800 leading-tight">Select Student</h3>
          <p className="text-xs text-neutral-400">Continue as this student</p>
        </div>
      </div>

      <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
        {students.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => handlePersonSelect('student', s.id)}
            className="w-full flex items-center gap-3 border border-neutral-200 rounded-xl px-4 py-3 hover:bg-neutral-50 hover:border-brand-300 transition-colors text-left"
          >
            <div className="w-9 h-9 rounded-full bg-brand-100 text-brand-700 text-sm font-semibold flex items-center justify-center shrink-0">
              {initials(s.name)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-neutral-800 truncate">{s.name}</p>
              <p className="text-xs text-neutral-400 mt-0.5">{s.course} · {s.batch}</p>
            </div>
            <span
              className={`shrink-0 text-xs font-medium px-2 py-0.5 rounded-full ${
                s.status === 'Active'
                  ? 'bg-green-50 text-green-700'
                  : 'bg-neutral-100 text-neutral-500'
              }`}
            >
              {s.status}
            </span>
          </button>
        ))}
      </div>
    </>
  )

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-white">
      {/* LEFT — BRAND EXPERIENCE */}
      <div
        className="relative overflow-hidden bg-neutral-900 text-white px-6 py-10 sm:px-10 lg:w-[55%] lg:px-16 lg:py-14 flex flex-col justify-between"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)',
          backgroundSize: '44px 44px',
        }}
      >
        {/* Soft glow accents */}
        <div className="pointer-events-none absolute -top-24 -left-24 w-96 h-96 rounded-full bg-brand-600/30 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 right-0 w-80 h-80 rounded-full bg-brand-500/20 blur-3xl" />

        <div className="relative">
          {/* Logo mark: abstract connected nodes */}
          <div className="flex items-center gap-3 mb-10 lg:mb-16">
            <svg className="w-9 h-9" viewBox="0 0 36 36" fill="none">
              <circle cx="18" cy="8" r="4" fill="white" fillOpacity="0.95" />
              <circle cx="8" cy="26" r="4" fill="white" fillOpacity="0.7" />
              <circle cx="28" cy="26" r="4" fill="white" fillOpacity="0.7" />
              <path d="M18 12L9 23M18 12l9 11" stroke="white" strokeOpacity="0.4" strokeWidth="1.5" />
            </svg>
            <div>
              <p className="text-lg font-bold leading-tight">Aravya</p>
              <p className="text-xs text-white/50 leading-tight">Coaching Management Platform</p>
            </div>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-bold leading-tight tracking-tight max-w-md">
            Everything your institute needs.
            <span className="block text-brand-300">One connected platform.</span>
          </h1>

          <p className="mt-5 text-sm sm:text-base text-white/60 max-w-md leading-relaxed">
            Aravya brings students, faculty, admissions, academics, attendance, communication, and analytics together in one intelligent coaching management platform.
          </p>
        </div>

        {/* Feature strip */}
        <div className="relative hidden lg:grid grid-cols-3 gap-6 mt-16 pt-8 border-t border-white/10">
          <div>
            <p className="text-[11px] font-semibold text-brand-300 uppercase tracking-wider mb-1.5">Student Management</p>
            <p className="text-xs text-white/50 leading-relaxed">Profiles, batches, attendance</p>
          </div>
          <div>
            <p className="text-[11px] font-semibold text-brand-300 uppercase tracking-wider mb-1.5">Academic Control</p>
            <p className="text-xs text-white/50 leading-relaxed">Courses, tests, assignments</p>
          </div>
          <div>
            <p className="text-[11px] font-semibold text-brand-300 uppercase tracking-wider mb-1.5">Institute Intelligence</p>
            <p className="text-xs text-white/50 leading-relaxed">Analytics, admissions, insights</p>
          </div>
        </div>
      </div>

      {/* RIGHT — LOGIN */}
      <div className="flex-1 flex items-center justify-center px-4 py-10 sm:px-6 lg:px-16">
        <div className="w-full max-w-sm">
          <div className="flex items-center gap-2 mb-8">
            <span className="w-2 h-2 rounded-full bg-green-500" />
            <span className="text-xs font-medium text-neutral-500 uppercase tracking-wide">Secure institute access</span>
          </div>

          {demoStep === 'faculty' ? (
            facultyPicker
          ) : demoStep === 'student' ? (
            studentPicker
          ) : (
            <>
              <h2 className="text-2xl font-bold text-neutral-800 mb-1.5">Welcome back</h2>
              <p className="text-sm text-neutral-500 mb-7">Sign in to continue to your Aravya workspace.</p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-1.5">
                    Email address
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@institute.com"
                    className="w-full px-4 py-3 text-sm border border-neutral-300 rounded-xl outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-shadow"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label htmlFor="password" className="block text-sm font-medium text-neutral-700">
                      Password
                    </label>
                    <a href="#" className="text-xs font-medium text-brand-600 hover:text-brand-700">
                      Forgot password?
                    </a>
                  </div>
                  <input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-3 text-sm border border-neutral-300 rounded-xl outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-shadow"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold py-3 rounded-xl transition-colors shadow-sm flex items-center justify-center gap-1.5"
                >
                  Sign in
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </button>
              </form>

              {roleGrid}
            </>
          )}

          {!demoStep && (
            <p className="text-center text-sm text-neutral-500 mt-8">
              Don't have an account?{' '}
              <a href="#" className="font-medium text-brand-600 hover:text-brand-700">
                Contact your administrator
              </a>
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export default Login