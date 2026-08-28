import { useState } from "react";
import { Outlet, Navigate, useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { rolePermissions, validRoles } from "../config/rolePermissions";

function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const role = localStorage.getItem("currentUserRole");

  // Missing or unrecognized role: do not guess a role, send to login.
  if (!role || !validRoles.includes(role)) {
    return <Navigate to="/login" replace />;
  }

  // Admin is unrestricted. Everyone else is checked against the shared
  // permission Sets using exact pathname matching (no prefix matching,
  // so /students and /students/profiles are correctly treated as distinct).
  const isAllowed =
    role === "admin" || rolePermissions[role].has(location.pathname);

  if (!isAllowed) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="flex h-screen w-full max-w-full overflow-x-hidden bg-neutral-50">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <Header onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 min-w-0 overflow-y-auto overflow-x-hidden p-3 sm:p-4 lg:p-6">
          <div className="w-full max-w-full overflow-x-hidden">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

export default MainLayout;
