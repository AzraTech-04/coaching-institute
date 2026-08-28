// src/utils/identity.js
//
// Lightweight identity utility for the Aravya prototype.
// This is NOT real authentication. It stores a role + user ID in localStorage
// so dashboards can personalize data without a backend.
//
// Role  → what pages a user can access  (controlled by rolePermissions.js)
// ID    → which data record belongs to them (used inside dashboard components)

export const ROLE_KEY = 'currentUserRole'
export const USER_ID_KEY = 'currentUserId'

/**
 * Read the current identity from localStorage.
 * Returns { role, userId, userIdInt }.
 * userId is a string (as stored); userIdInt is parsed as an integer (null if missing or NaN).
 */
export function getIdentity() {
  const role = localStorage.getItem(ROLE_KEY)
  const userId = localStorage.getItem(USER_ID_KEY)
  const parsed = parseInt(userId, 10)
  return {
    role,
    userId,
    userIdInt: Number.isNaN(parsed) ? null : parsed,
  }
}

/**
 * Persist a role + user ID pair atomically.
 * @param {string} role  - 'admin' | 'faculty' | 'counsellor' | 'student'
 * @param {number|string} id - The integer ID of the specific record in that role's data array
 */
export function setIdentity(role, id) {
  localStorage.setItem(ROLE_KEY, role)
  localStorage.setItem(USER_ID_KEY, String(id))
}

/**
 * Remove both identity keys on logout.
 * Must always remove BOTH keys together — never just one.
 */
export function clearIdentity() {
  localStorage.removeItem(ROLE_KEY)
  localStorage.removeItem(USER_ID_KEY)
}
