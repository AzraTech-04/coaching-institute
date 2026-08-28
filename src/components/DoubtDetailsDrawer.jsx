import StatusBadge from "./StatusBadge";

function PriorityBadge({ priority }) {
  const styles = {
    Low: "bg-green-50 text-green-700",
    Medium: "bg-yellow-50 text-yellow-700",
    High: "bg-red-50 text-red-700",
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${styles[priority] || "bg-neutral-100 text-neutral-600"}`}
    >
      {priority}
    </span>
  );
}

function DoubtDetailsDrawer({ doubt, onClose, onEdit, onStatusChange }) {
  if (!doubt) return null;

  const nextStatus =
    {
      Open: "In Progress",
      "In Progress": "Resolved",
      Resolved: "In Progress",
    }[doubt.status] || "In Progress";

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white w-full max-w-xl h-full shadow-lg overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 sticky top-0 bg-white z-10">
          <div>
            <p className="text-xs text-neutral-500 uppercase tracking-wide">
              Doubt details
            </p>
            <h3 className="text-lg font-semibold text-neutral-800 mt-0.5">
              {doubt.topic}
            </h3>
          </div>
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

        <div className="px-6 py-6 space-y-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm text-neutral-500">
                {doubt.student} · {doubt.course}
              </p>
              <p className="text-sm text-neutral-600 mt-1">{doubt.batch}</p>
            </div>
            <StatusBadge status={doubt.status} />
          </div>

          <button
            type="button"
            onClick={() => onEdit(doubt)}
            className="px-3.5 py-2 rounded-lg bg-brand-600 text-white text-sm font-medium hover:bg-brand-700"
          >
            Edit doubt
          </button>

          <div className="grid grid-cols-2 gap-4 border-y border-neutral-100 py-4 text-sm">
            <div>
              <p className="text-neutral-400">Student</p>
              <p className="font-medium text-neutral-800 mt-1">
                {doubt.student}
              </p>
            </div>
            <div>
              <p className="text-neutral-400">Course</p>
              <p className="font-medium text-neutral-800 mt-1">
                {doubt.course}
              </p>
            </div>
            <div>
              <p className="text-neutral-400">Batch</p>
              <p className="font-medium text-neutral-800 mt-1">{doubt.batch}</p>
            </div>
            <div>
              <p className="text-neutral-400">Subject</p>
              <p className="font-medium text-neutral-800 mt-1">
                {doubt.subject}
              </p>
            </div>
            <div>
              <p className="text-neutral-400">Assigned faculty</p>
              <p className="font-medium text-neutral-800 mt-1">
                {doubt.faculty}
              </p>
            </div>
            <div>
              <p className="text-neutral-400">Priority</p>
              <div className="mt-1">
                <PriorityBadge priority={doubt.priority} />
              </div>
            </div>
            <div>
              <p className="text-neutral-400">Created date</p>
              <p className="font-medium text-neutral-800 mt-1">
                {doubt.createdDate}
              </p>
            </div>
            <div>
              <p className="text-neutral-400">Status</p>
              <p className="font-medium text-neutral-800 mt-1">
                {doubt.status}
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4">
            <p className="text-sm font-semibold text-neutral-800 mb-2">
              Question
            </p>
            <p className="text-sm text-neutral-700 leading-6">
              {doubt.question}
            </p>
          </div>

          <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-semibold text-neutral-800">
                Resolution
              </p>
              <select
                value={doubt.status}
                onChange={(event) => onStatusChange(event.target.value)}
                className="px-2.5 py-1.5 text-sm border border-neutral-300 rounded-lg bg-white"
              >
                <option>Open</option>
                <option>In Progress</option>
                <option>Resolved</option>
              </select>
            </div>

            <p className="text-sm text-neutral-700 leading-6">
              {doubt.resolution || "No faculty response recorded yet."}
            </p>
          </div>

          <div>
            <p className="text-sm font-medium text-neutral-700 mb-2">
              Next action
            </p>
            <button
              type="button"
              onClick={() => onStatusChange(nextStatus)}
              className="w-full bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium py-2.5 rounded-lg"
            >
              {doubt.status === "Open"
                ? "Move to In Progress"
                : doubt.status === "In Progress"
                  ? "Mark Resolved"
                  : "Reopen for review"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DoubtDetailsDrawer;
