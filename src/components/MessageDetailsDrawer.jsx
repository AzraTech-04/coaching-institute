import StatusBadge from "./StatusBadge";

function MessageDetailsDrawer({ message, onClose }) {
  if (!message) return null;

  let nextAction = "This message has been delivered.";
  if (message.status === "Draft")
    nextAction = "This message is saved as a draft and has not been sent.";
  else if (message.status === "Scheduled")
    nextAction = `Scheduled to send on ${message.scheduledFor}.`;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white w-full max-w-sm h-full shadow-lg overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200">
          <h3 className="text-lg font-semibold text-neutral-800">
            Message Details
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
          <div className="flex items-start justify-between gap-3">
            <div>
              <h4 className="text-base font-semibold text-neutral-800">
                {message.title}
              </h4>
              <p className="text-sm text-neutral-500 mt-0.5">
                {message.channel}
              </p>
            </div>
            <StatusBadge status={message.status} />
          </div>

          <div className="mt-6 border-t border-neutral-100 pt-4">
            <p className="text-sm text-neutral-500 mb-2">Message</p>
            <p className="text-sm text-neutral-700">{message.message}</p>
          </div>

          <div className="mt-6 space-y-3 border-t border-neutral-100 pt-4">
            <div className="flex justify-between text-sm">
              <span className="text-neutral-500">Audience</span>
              <span className="text-neutral-800 font-medium">
                {message.audience.label}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-neutral-500">Recipients</span>
              <span className="text-neutral-800 font-medium">
                {message.audience.count}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-neutral-500">Date</span>
              <span className="text-neutral-800 font-medium">
                {message.date}
              </span>
            </div>
            {message.scheduledFor && (
              <div className="flex justify-between text-sm">
                <span className="text-neutral-500">Scheduled for</span>
                <span className="text-neutral-800 font-medium">
                  {message.scheduledFor}
                </span>
              </div>
            )}
          </div>

          <div className="mt-6 bg-brand-50 border border-brand-100 rounded-lg p-4">
            <p className="text-xs font-medium text-brand-700 uppercase mb-1">
              Next action
            </p>
            <p className="text-sm text-neutral-700">{nextAction}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MessageDetailsDrawer;
