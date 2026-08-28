import { counsellingStatusOptions } from "../data/counsellingData";

const nextActionCopy = {
  Scheduled: "Session is scheduled. Confirm attendance before the date below.",
  "Follow-up Required": "Follow up with the prospect before the date below.",
  Completed: "Session completed. Awaiting the prospect's decision.",
  Converted: "Ready to proceed — move this record to Admission.",
  "Not Interested": "This prospect chose not to proceed.",
};

function CounsellingDetailsDrawer({
  record,
  onClose,
  onStatusChange,
  onMoveToAdmission,
}) {
  if (!record) return null;

  const isConverted = record.status === "Converted";

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white w-full max-w-sm h-full shadow-lg overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200">
          <h3 className="text-lg font-semibold text-neutral-800">
            Counselling Details
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
              {record.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </div>
            <div>
              <h4 className="text-base font-semibold text-neutral-800">
                {record.name}
              </h4>
              <p className="text-sm text-neutral-500">{record.course}</p>
            </div>
          </div>

          <div className="mt-6 space-y-4 border-t border-neutral-100 pt-4">
            <div className="flex justify-between text-sm">
              <span className="text-neutral-500">Counsellor</span>
              <span className="text-neutral-800 font-medium">
                {record.counsellor}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-neutral-500">Scheduled</span>
              <span className="text-neutral-800 font-medium">
                {record.date} at {record.time}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-neutral-500">Follow-up date</span>
              <span className="text-neutral-800 font-medium">
                {record.followUpDate}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-neutral-500">Linked lead</span>
              <span className="text-neutral-800 font-medium">
                {record.leadId ? `Lead #${record.leadId}` : "Walk-in"}
              </span>
            </div>
          </div>

          <div className="mt-6 border-t border-neutral-100 pt-4">
            <label className="block text-sm text-neutral-500 mb-1.5">
              Status
            </label>
            <select
              value={record.status}
              onChange={(e) => onStatusChange(record.id, e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm border border-neutral-300 rounded-lg outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 bg-white"
            >
              {counsellingStatusOptions.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-6 border-t border-neutral-100 pt-4">
            <p className="text-sm text-neutral-500 mb-2">Notes</p>
            <p className="text-sm text-neutral-700">{record.notes}</p>
          </div>

          <div className="mt-6 bg-brand-50 border border-brand-100 rounded-lg p-4">
            <p className="text-xs font-medium text-brand-700 uppercase mb-1">
              Next action
            </p>
            <p className="text-sm text-neutral-700">
              {nextActionCopy[record.status]}
            </p>
          </div>

          <button
            type="button"
            disabled={!isConverted}
            title={isConverted ? "" : "Available once status is Converted"}
            onClick={() => onMoveToAdmission(record)}
            className={`w-full mt-4 text-sm font-medium py-2.5 rounded-lg transition-colors ${
              isConverted
                ? "bg-brand-600 hover:bg-brand-700 text-white"
                : "bg-neutral-100 text-neutral-400 cursor-not-allowed"
            }`}
          >
            Move to Admission →
          </button>
        </div>
      </div>
    </div>
  );
}

export default CounsellingDetailsDrawer;
