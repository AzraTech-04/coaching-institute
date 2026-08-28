import { useState } from "react";
import {
  settingsUsers as initialUsers,
  roleOptions,
  userStatusOptions,
  permissionMatrix,
  permissionModules,
} from "../data/settingsUsersData";
import StatusBadge from "../components/StatusBadge";
import PageHeader from "../components/PageHeader";
import EmptyState from "../components/EmptyState";
import StatCard from "../components/StatCard";
import UserDetailsDrawer from "../components/UserDetailsDrawer";

function levelStyle(level) {
  if (level === "Manage") return "bg-green-50 text-green-700";
  if (level === "Edit") return "bg-blue-50 text-blue-700";
  if (level === "View") return "bg-neutral-100 text-neutral-600";
  return "bg-neutral-50 text-neutral-400";
}

function UsersRoles() {
  const [users, setUsers] = useState(initialUsers);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedUserId, setSelectedUserId] = useState(null);

  const filtered = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === "All" || u.role === roleFilter;
    const matchesStatus = statusFilter === "All" || u.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const stats = [
    {
      label: "Total Users",
      value: users.length,
      change: "All accounts",
      trend: "up",
    },
    {
      label: "Active Users",
      value: users.filter((u) => u.status === "Active").length,
      change: "Currently active",
      trend: "up",
    },
    {
      label: "Inactive Users",
      value: users.filter((u) => u.status === "Inactive").length,
      change: "Deactivated",
      trend: "down",
    },
    {
      label: "Roles in Use",
      value: [...new Set(users.map((u) => u.role))].length,
      change: `Of ${roleOptions.length} available`,
      trend: "up",
    },
  ];

  function handleUpdateUser(id, updates) {
    setUsers(users.map((u) => (u.id === id ? { ...u, ...updates } : u)));
  }

  const selectedUser = selectedUserId
    ? users.find((u) => u.id === selectedUserId)
    : null;

  return (
    <div>
      <PageHeader
        title="Users & Roles"
        subtitle="Manage who can access Aravya and what they can do."
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((s) => (
          <StatCard
            key={s.label}
            label={s.label}
            value={s.value}
            change={s.change}
            trend={s.trend}
          />
        ))}
      </div>

      <div className="flex flex-col sm:flex-row flex-wrap gap-3 mb-4">
        <div className="relative flex-1 min-w-[180px]">
          <svg
            className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-4.35-4.35M17 10.5A6.5 6.5 0 114 10.5a6.5 6.5 0 0113 0z"
            />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email..."
            className="w-full pl-9 pr-3 py-2.5 text-sm border border-neutral-300 rounded-lg outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
          />
        </div>
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="px-3.5 py-2.5 text-sm border border-neutral-300 rounded-lg outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 bg-white"
        >
          <option value="All">All Roles</option>
          {roleOptions.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3.5 py-2.5 text-sm border border-neutral-300 rounded-lg outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 bg-white"
        >
          <option value="All">All Statuses</option>
          {userStatusOptions.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden shadow-sm mb-6">
        {users.length === 0 ? (
          <EmptyState
            title="No users yet"
            message="Users will appear here once added."
          />
        ) : filtered.length === 0 ? (
          <EmptyState
            title="No matching users"
            message="Try adjusting your search or filters."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[620px] text-sm text-left">
              <thead className="bg-neutral-50 text-neutral-500 uppercase text-xs">
                <tr>
                  <th className="px-5 py-3">Name</th>
                  <th className="px-5 py-3">Email</th>
                  <th className="px-5 py-3">Role</th>
                  <th className="px-5 py-3">Branch</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3">Last Active</th>
                  <th className="px-5 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {filtered.map((u) => (
                  <tr
                    key={u.id}
                    className="hover:bg-neutral-50 cursor-pointer"
                    onClick={() => setSelectedUserId(u.id)}
                  >
                    <td className="px-5 py-3 font-medium text-neutral-800">
                      {u.name}
                    </td>
                    <td className="px-5 py-3 text-neutral-600">{u.email}</td>
                    <td className="px-5 py-3 text-neutral-600">{u.role}</td>
                    <td className="px-5 py-3 text-neutral-600">{u.branch}</td>
                    <td className="px-5 py-3">
                      <StatusBadge status={u.status} />
                    </td>
                    <td className="px-5 py-3 text-neutral-600">{u.lastActive}</td>
                    <td className="px-5 py-3 text-right">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedUserId(u.id);
                        }}
                        className="text-brand-600 hover:text-brand-700 font-medium text-sm"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="bg-white border border-neutral-200 rounded-xl shadow-sm p-5">
        <h3 className="text-base font-semibold text-neutral-800 mb-1">
          Role & Permission Matrix
        </h3>
        <p className="text-sm text-neutral-500 mb-4">
          What each role can access across Aravya.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left min-w-[720px]">
            <thead className="bg-neutral-50 text-neutral-500 uppercase text-xs">
              <tr>
                <th className="px-4 py-2.5">Module</th>
                {roleOptions.map((r) => (
                  <th key={r} className="px-4 py-2.5">
                    {r}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {permissionModules.map((mod) => (
                <tr key={mod}>
                  <td className="px-4 py-2.5 font-medium text-neutral-800">
                    {mod}
                  </td>
                  {roleOptions.map((r) => {
                    const level = permissionMatrix[r]?.[mod] || "None";
                    return (
                      <td key={r} className="px-4 py-2.5">
                        <span
                          className={`text-xs font-medium px-2 py-0.5 rounded-full ${levelStyle(level)}`}
                        >
                          {level}
                        </span>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <UserDetailsDrawer
        user={selectedUser}
        onClose={() => setSelectedUserId(null)}
        onUpdate={handleUpdateUser}
      />
    </div>
  );
}

export default UsersRoles;
