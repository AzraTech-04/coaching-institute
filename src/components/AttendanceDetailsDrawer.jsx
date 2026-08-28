import StatusBadge from "./StatusBadge";

function AttendanceDetailsDrawer({ student, batch, stats, onClose }) {
  if (!student || !stats) return null;

  const tier = stats.tier;

  let nextAction = "Attendance is on track.";
  if (tier.label === "Critical") {
    nextAction = "Attendance below recommended level — follow-up required.";
  } else if (tier.label === "Needs Attention") {
    nextAction = "Attendance is dipping — keep an eye on upcoming sessions.";
  }

  const recentHistory = [...stats.history]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 8);

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white w-full max-w-sm h-full shadow-lg overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200">
          <h3 className="text-lg font-semibold text-neutral-800">
            Attendance Details
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="text-neutral-400 hover:text-neutral-600"
            aria-label="Close"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="px-6 py-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 font-semibold text-lg">
              {student.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </div>
            <div>
              <h4 className="text-base font-semibold text-neutral-800">
                {student.name}
              </h4>
              <p className="text-sm text-neutral-500">
                {batch ? batch.name : student.batch}
                {batch ? ` · ${batch.facultyName}` : ""}
              </p>
            </div>
          </div>

          <div className="mt-6 border-t border-neutral-100 pt-4">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-neutral-500">Attendance</span>
              <span className={`font-medium ${tier.text}`}>
                {stats.percentage}% · {tier.label}
              </span>
            </div>
            <div className="h-2 bg-neutral-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${tier.bar}`}
                style={{ width: `${Math.min(stats.percentage, 100)}%` }}
              />
            </div>
          </div>

          <div className="mt-6 grid grid-cols-4 gap-2 text-center border-t border-neutral-100 pt-4">
            <div>
              <p className="text-base font-bold text-neutral-800">
                {stats.present}
              </p>
              <p className="text-xs text-neutral-400">Present</p>
            </div>
            <div>
              <p className="text-base font-bold text-neutral-800">
                {stats.absent}
              </p>
              <p className="text-xs text-neutral-400">Absent</p>
            </div>
            <div>
              <p className="text-base font-bold text-neutral-800">
                {stats.late}
              </p>
              <p className="text-xs text-neutral-400">Late</p>
            </div>
            <div>
              <p className="text-base font-bold text-neutral-800">
                {stats.leave}
              </p>
              <p className="text-xs text-neutral-400">Leave</p>
            </div>
          </div>

          <div className="mt-6 border-t border-neutral-100 pt-4">
            <p className="text-sm text-neutral-500 mb-2">
              Recent attendance history
            </p>
            <ul className="space-y-2">
              {recentHistory.map((record) => (
                <li
                  key={record.id}
                  className="flex items-center justify-between text-sm"
                >
                  <div>
                    <p className="text-neutral-700">{record.date}</p>
                    <p className="text-xs text-neutral-400">
                      {record.session}
                      {record.submitted
                        ? ` · Submitted ${record.submittedAt}`
                        : ""}
                    </p>
                  </div>
                  <StatusBadge status={record.status} />
                </li>
              ))}
            </ul>
          </div>

          <div
            className={`mt-6 border rounded-lg p-4 ${
              tier.label === "Critical"
                ? "bg-red-50 border-red-100"
                : tier.label === "Needs Attention"
                  ? "bg-yellow-50 border-yellow-100"
                  : "bg-brand-50 border-brand-100"
            }`}
          >
            <p className={`text-xs font-medium uppercase mb-1 ${tier.text}`}>
              Next action
            </p>
            <p className="text-sm text-neutral-700">{nextAction}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AttendanceDetailsDrawer;
