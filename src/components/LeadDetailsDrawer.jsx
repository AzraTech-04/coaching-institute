import { leadStatusOptions } from "../data/leadsData";

const nextActionCopy = {
  New: "Reach out to this lead for the first time.",
  Contacted: "Schedule a counselling session to move this lead forward.",
  "Follow-up": "Follow up before the date below to avoid losing this lead.",
  Converted: "This lead has been converted — ready for admission.",
  Lost: "This lead did not convert.",
};

function LeadDetailsDrawer({
  lead,
  onClose,
  onStatusChange,
  onMoveToCounselling,
}) {
  if (!lead) return null;

  const isActionable = !["Counselling", "Converted", "Lost"].includes(
    lead.status,
  );

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white w-full max-w-sm h-full shadow-lg overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200">
          <h3 className="text-lg font-semibold text-neutral-800">
            Lead Details
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
              {lead.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </div>
            <div>
              <h4 className="text-base font-semibold text-neutral-800">
                {lead.name}
              </h4>
              <p className="text-sm text-neutral-500">{lead.course}</p>
            </div>
          </div>

          <div className="mt-6 space-y-4 border-t border-neutral-100 pt-4">
            <div className="flex justify-between text-sm">
              <span className="text-neutral-500">Contact</span>
              <span className="text-neutral-800 font-medium">
                {lead.contact}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-neutral-500">Source</span>
              <span className="text-neutral-800 font-medium">
                {lead.source}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-neutral-500">Follow-up date</span>
              <span className="text-neutral-800 font-medium">
                {lead.followUpDate}
              </span>
            </div>
          </div>

          <div className="mt-6 border-t border-neutral-100 pt-4">
            <label className="block text-sm text-neutral-500 mb-1.5">
              Status
            </label>
            <select
              value={lead.status}
              onChange={(e) => onStatusChange(lead.id, e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm border border-neutral-300 rounded-lg outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 bg-white"
            >
              {leadStatusOptions.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-6 border-t border-neutral-100 pt-4">
            <p className="text-sm text-neutral-500 mb-2">Notes</p>
            <p className="text-sm text-neutral-700">{lead.notes}</p>
          </div>

          <div className="mt-6 bg-brand-50 border border-brand-100 rounded-lg p-4">
            <p className="text-xs font-medium text-brand-700 uppercase mb-1">
              Next action
            </p>
            <p className="text-sm text-neutral-700">
              {nextActionCopy[lead.status]}
            </p>
          </div>

          <button
            type="button"
            disabled={!isActionable}
            onClick={() => onMoveToCounselling(lead)}
            className={`w-full mt-4 text-sm font-medium py-2.5 rounded-lg transition-colors ${
              isActionable
                ? "bg-brand-600 hover:bg-brand-700 text-white"
                : "bg-neutral-100 text-neutral-400 cursor-not-allowed"
            }`}
          >
            Move to Counselling →
          </button>
        </div>
      </div>
    </div>
  );
}

export default LeadDetailsDrawer;
