import { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getIdentity, clearIdentity } from "../utils/identity";
import { settingsUsers } from "../data/settingsUsersData";
import { faculty } from "../data/facultyData";
import { students } from "../data/studentsData";

const pageTitles = {
  "/": "Dashboard",
  "/profile": "Profile",
  "/students": "Students",
  "/students/profiles": "Student Profiles",
  "/leads": "Leads",
  "/admissions/counselling": "Counselling",
  "/admissions": "Admissions",
  "/academics/courses": "Courses",
  "/batches": "Batches",
  "/faculty": "Faculty",
  "/attendance": "Attendance",
  "/tests": "Tests",
  "/academics/question-bank": "Question Bank",
  "/academics/results": "Results & Rankings",
  "/academics/assignments": "Assignments",
  "/academics/study-materials": "Study Materials",
  "/academics/doubts": "Doubts",
  "/analytics/student-performance": "Student Performance Analytics",
  "/analytics/attendance": "Attendance Analytics",
  "/analytics/lead-conversion": "Lead Conversion Analytics",
  "/analytics/batch": "Batch Analytics",
  "/communication/notifications": "Notifications",
  "/communication/whatsapp": "WhatsApp",
  "/communication/sms-email": "SMS & Email",
  "/communication/announcements": "Announcements",
  "/fees": "Fees & Payments",
  "/ai-assistant": "AI Assistant",
  "/branches": "Branches",
  "/settings/users-roles": "Users & Roles",
  "/settings/integrations": "Integrations",
  "/settings/system": "System Settings",
};

// Role titles shown under the person's name in the header avatar menu.
const roleTitles = {
  admin: "Administrator",
  faculty: "Faculty Member",
  counsellor: "Counsellor",
  student: "Student",
};

/**
 * Resolve the display name for the current identity.
 * Looks up the real record from the appropriate data array.
 * Falls back gracefully if the ID is missing or unrecognised.
 */
function resolveDisplayName(role, userIdInt) {
  if (!role || userIdInt === null) return null;

  if (role === "student") {
    const record = students.find((s) => s.id === userIdInt);
    return record ? record.name : null;
  }

  if (role === "faculty") {
    const record = faculty.find((f) => f.id === userIdInt);
    return record ? record.name : null;
  }

  // admin and counsellor both live in settingsUsers
  if (role === "admin" || role === "counsellor") {
    const record = settingsUsers.find((u) => u.id === userIdInt);
    return record ? record.name : null;
  }

  return null;
}

function Header({ onMenuClick }) {
  const location = useLocation();
  const navigate = useNavigate();
  const title = pageTitles[location.pathname] || "Aravya";

  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const { role, userIdInt } = getIdentity();

  const resolvedName = resolveDisplayName(role, userIdInt);
  // If we have a real name use it; otherwise fall back to the generic role label.
  const displayName =
    resolvedName ||
    (role ? role.charAt(0).toUpperCase() + role.slice(1) : "Guest");
  const displayTitle = roleTitles[role] || "Not signed in";
  // Avatar initial: first letter of first word of the resolved name.
  const avatarInitial = displayName.charAt(0).toUpperCase();

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleLogout() {
    setMenuOpen(false);
    clearIdentity(); // removes both currentUserRole AND currentUserId
    navigate("/login");
  }

  return (
    <header className="h-16 bg-white border-b border-neutral-200 flex items-center justify-between px-4 md:px-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          className="md:hidden text-neutral-500 hover:text-neutral-800"
          aria-label="Open menu"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
        <h2 className="text-lg font-semibold text-neutral-800">{title}</h2>
      </div>

      <div className="relative" ref={menuRef}>
        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          className="flex items-center gap-3 hover:bg-neutral-50 rounded-lg px-2 py-1.5 transition-colors"
        >
          <div className="w-9 h-9 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 font-medium text-sm">
            {avatarInitial}
          </div>
          <div className="text-sm hidden sm:block text-left">
            <p className="font-medium text-neutral-800 leading-tight">
              {displayName}
            </p>
            <p className="text-neutral-400 text-xs leading-tight">
              {displayTitle}
            </p>
          </div>
          <svg
            className="w-4 h-4 text-neutral-400 hidden sm:block"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>

        {menuOpen && (
          <div className="absolute right-0 mt-2 w-52 bg-white border border-neutral-200 rounded-lg shadow-lg py-1 z-50">
            <div className="px-4 py-2 border-b border-neutral-100">
              <p className="text-sm font-medium text-neutral-800">
                {displayName}
              </p>
              <p className="text-xs text-neutral-400">{displayTitle}</p>
            </div>
            <button
              type="button"
              onClick={() => {
                setMenuOpen(false);
                navigate("/profile");
              }}
              className="w-full text-left px-4 py-2 text-sm text-neutral-600 hover:bg-neutral-50"
            >
              Profile
            </button>
            <button
              type="button"
              onClick={() => {
                setMenuOpen(false);
                navigate("/settings/system");
              }}
              className="w-full text-left px-4 py-2 text-sm text-neutral-600 hover:bg-neutral-50"
            >
              Settings
            </button>
            <div className="border-t border-neutral-100 mt-1 pt-1">
              <button
                type="button"
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
              >
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;
