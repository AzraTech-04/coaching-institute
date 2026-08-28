import { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { rolePermissions } from "../config/rolePermissions";

const navItems = [
  { type: "link", name: "Dashboard", path: "/", icon: "dashboard" },
  {
    type: "group",
    name: "Students",
    icon: "students",
    children: [
      { name: "All Students", path: "/students" },
      { name: "Student Profiles", path: "/students/profiles" },
    ],
  },
  {
    type: "group",
    name: "Admissions",
    icon: "admissions",
    children: [
      { name: "Leads", path: "/leads" },
      { name: "Counselling", path: "/admissions/counselling" },
      { name: "Admissions", path: "/admissions" },
    ],
  },
  {
    type: "group",
    name: "Academics",
    icon: "academics",
    children: [
      { name: "Courses", path: "/academics/courses" },
      { name: "Batches", path: "/batches" },
      { name: "Faculty", path: "/faculty" },
      { name: "Attendance", path: "/attendance" },
      { name: "Tests", path: "/tests" },
      { name: "Question Bank", path: "/academics/question-bank" },
      { name: "Results & Rankings", path: "/academics/results" },
      { name: "Assignments", path: "/academics/assignments" },
      { name: "Study Materials", path: "/academics/study-materials" },
      { name: "Doubts", path: "/academics/doubts" },
    ],
  },
  {
    type: "group",
    name: "Analytics",
    icon: "analytics",
    children: [
      { name: "Academic Analytics", path: "/analytics/student-performance" },
      { name: "Attendance Analytics", path: "/analytics/attendance" },
      { name: "Lead Conversion", path: "/analytics/lead-conversion" },
      { name: "Batch Analytics", path: "/analytics/batch" },
    ],
  },
  {
    type: "group",
    name: "Communication",
    icon: "communication",
    children: [
      { name: "Notifications", path: "/communication/notifications" },
      { name: "WhatsApp", path: "/communication/whatsapp" },
      { name: "SMS / Email", path: "/communication/sms-email" },
      { name: "Announcements", path: "/communication/announcements" },
    ],
  },
  { type: "link", name: "Fees & Payments", path: "/fees", icon: "fees" },
  { type: "link", name: "AI Assistant", path: "/ai-assistant", icon: "ai" },
  { type: "link", name: "Branches", path: "/branches", icon: "branches" },
  {
    type: "group",
    name: "Settings",
    icon: "settings",
    children: [
      { name: "Users & Roles", path: "/settings/users-roles" },
      { name: "Integrations", path: "/settings/integrations" },
      { name: "System Settings", path: "/settings/system" },
    ],
  },
];

// Phase 3 addition: role -> set of allowed paths. Admin is handled separately (full nav).

// Filters the existing navItems structure down to allowed paths.
// Groups are kept only if at least one child survives.
function filterNavItems(items, allowedPaths) {
  return items.reduce((visible, item) => {
    if (item.type === "link") {
      if (allowedPaths.has(item.path)) visible.push(item);
      return visible;
    }
    const children = item.children.filter((child) =>
      allowedPaths.has(child.path),
    );
    if (children.length > 0) visible.push({ ...item, children });
    return visible;
  }, []);
}

const iconPaths = {
  dashboard: "M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z",
  students: "M12 14l9-5-9-5-9 5 9 5zm0 0v7m-9-7v5a9 9 0 0018 0v-5",
  admissions:
    "M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2m14-14a4 4 0 11-8 0 4 4 0 018 0zM19 8v6m3-3h-6",
  academics:
    "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253",
  analytics:
    "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2",
  communication:
    "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.86 9.86 0 01-4-.8L3 20l1.3-3.9A7.96 7.96 0 013 12c0-4.418 4.03-8 9-8s9 3.582 9 8z",
  fees: "M12 8c-1.657 0-3 .672-3 1.5S10.343 11 12 11s3 .672 3 1.5-1.343 1.5-3 1.5m0-6c1.11 0 2.08.402 2.599 1M12 8V6m0 2v6m0 0v2m0-2c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
  ai: "M13 10V3L4 14h7v7l9-11h-7z",
  branches: "M3 21h18M5 21V7l7-4 7 4v14M9 9h1m4 0h1m-6 4h1m4 0h1m-6 4h1m4 0h1",
  settings:
    "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z",
};

function Icon({ name, className }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.75}
        d={iconPaths[name]}
      />
    </svg>
  );
}

function ChevronIcon({ open }) {
  return (
    <svg
      className={`w-4 h-4 transition-transform duration-150 ${open ? "rotate-180" : ""}`}
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
  );
}

function Sidebar({ isOpen, onClose }) {
  const location = useLocation();
  const [openGroups, setOpenGroups] = useState({});

  // Phase 3: determine which nav items this role can see.
  // Admin (and any unrecognized/missing role, to preserve prior behavior) sees everything.
  const role = localStorage.getItem("currentUserRole");
  const visibleNavItems =
    role && rolePermissions[role]
      ? filterNavItems(navItems, rolePermissions[role])
      : navItems;

  // Auto-expand whichever group contains the current page, whenever the route changes.
  useEffect(() => {
    const activeGroup = visibleNavItems.find(
      (item) =>
        item.type === "group" &&
        item.children.some((c) => c.path === location.pathname),
    );
    if (activeGroup) {
      setOpenGroups((prev) => ({ ...prev, [activeGroup.name]: true }));
    }
  }, [location.pathname, role]);

  function toggleGroup(name) {
    setOpenGroups((prev) => ({ ...prev, [name]: !prev[name] }));
  }

  const linkClasses = ({ isActive }) =>
    `flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
      isActive
        ? "bg-brand-50 text-brand-700"
        : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"
    }`;

  const childLinkClasses = ({ isActive }) =>
    `block px-3 py-1.5 rounded-md text-sm transition-colors ${
      isActive
        ? "text-brand-700 font-medium bg-brand-50"
        : "text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100"
    }`;

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 md:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex h-screen w-72 max-w-[85vw] shrink-0 transform flex-col border-r border-neutral-200 bg-white transition-transform duration-200 md:static md:w-64 md:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="px-6 py-5 border-b border-neutral-200 shrink-0">
          <h1 className="text-xl font-bold text-brand-600">Aravya</h1>
        </div>

        <nav className="flex-1 min-h-0 overflow-y-auto px-3 py-4 space-y-1">
          {visibleNavItems.map((item) => {
            if (item.type === "link") {
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === "/"}
                  onClick={onClose}
                  className={linkClasses}
                >
                  <Icon name={item.icon} className="w-5 h-5 shrink-0" />
                  {item.name}
                </NavLink>
              );
            }

            const isGroupOpen = !!openGroups[item.name];
            const isGroupActive = item.children.some(
              (c) => c.path === location.pathname,
            );

            return (
              <div key={item.name}>
                <button
                  type="button"
                  onClick={() => toggleGroup(item.name)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isGroupActive
                      ? "text-brand-700"
                      : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <Icon name={item.icon} className="w-5 h-5 shrink-0" />
                    {item.name}
                  </span>
                  <ChevronIcon open={isGroupOpen} />
                </button>

                {isGroupOpen && (
                  <div className="mt-1 ml-4 pl-3 border-l border-neutral-200 space-y-0.5">
                    {item.children.map((child) => (
                      <NavLink
                        key={child.path}
                        to={child.path}
                        onClick={onClose}
                        className={childLinkClasses}
                      >
                        {child.name}
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </aside>
    </>
  );
}

export default Sidebar;
