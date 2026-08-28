import { useMemo } from "react";
import PageHeader from "../components/PageHeader";
import { settingsUsers } from "../data/settingsUsersData";
import { faculty } from "../data/facultyData";
import { students } from "../data/studentsData";
import { batches } from "../data/batchesData";
import { getIdentity } from "../utils/identity";

const roleLabels = {
  admin: "Administrator",
  faculty: "Faculty Member",
  counsellor: "Counsellor",
  student: "Student",
};

function findCurrentUser(role, userIdInt) {
  if (role === "admin" || role === "counsellor") {
    return settingsUsers.find((user) => user.id === userIdInt);
  }
  if (role === "faculty") {
    return faculty.find((user) => user.id === userIdInt);
  }
  if (role === "student") {
    return students.find((user) => user.id === userIdInt);
  }
  return null;
}

function Profile() {
  const { role, userIdInt } = getIdentity();
  const user = useMemo(
    () => findCurrentUser(role, userIdInt),
    [role, userIdInt],
  );
  const displayRole = user?.role || roleLabels[role] || "User";
  const initials = user?.name
    ? user.name
        .split(" ")
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "?";
  const details = [
    ["Name", user?.name],
    ["Role", displayRole],
    ["Student ID", role === "student" ? user?.id : null],
    ["Subject", user?.subject],
    ["Course", user?.course],
    ["Batch", user?.batch],
    ["Email", user?.email],
    ["Contact", user?.contact],
    ["Branch", user?.branch],
    ["Status", user?.status],
    ["Join date", user?.joinDate],
  ].filter(([, value]) => value);
  const assignedBatches =
    role === "faculty"
      ? batches
          .filter((batch) => batch.facultyId === userIdInt)
          .map((batch) => batch.name)
      : [];

  return (
    <div>
      <PageHeader title="Profile" subtitle="View your account information." />
      <section className="max-w-2xl bg-white border border-neutral-200 rounded-xl shadow-sm overflow-hidden">
        <div className="flex items-center gap-4 px-6 py-6 border-b border-neutral-100">
          <div className="w-14 h-14 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 font-semibold text-lg">
            {initials}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-neutral-800">
              {user?.name || "Profile unavailable"}
            </h3>
            <p className="text-sm text-neutral-500">{displayRole}</p>
          </div>
        </div>
        <dl className="divide-y divide-neutral-100 px-6">
          {details.map(([label, value]) => (
            <div
              key={label}
              className="flex justify-between gap-6 py-4 text-sm"
            >
              <dt className="text-neutral-500">{label}</dt>
              <dd className="text-neutral-800 font-medium text-right">
                {value}
              </dd>
            </div>
          ))}
          {assignedBatches.length > 0 && (
            <div className="flex justify-between gap-6 py-4 text-sm">
              <dt className="text-neutral-500">Assigned batches</dt>
              <dd className="text-neutral-800 font-medium text-right">
                {assignedBatches.join(", ")}
              </dd>
            </div>
          )}
        </dl>
      </section>
    </div>
  );
}

export default Profile;
