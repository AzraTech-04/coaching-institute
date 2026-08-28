import StatusBadge from "./StatusBadge";

function StudentFeeDetailsDrawer({ record, onClose }) {
  if (!record) return null;

  const {
    student,
    totalFee,
    paidAmount,
    remaining,
    percentage,
    status,
    dueDate,
    paymentHistory,
  } = record;

  let nextAction = "Fee payment is complete.";
  if (status === "Overdue") {
    nextAction =
      "Payment is overdue — follow up with the student for the remaining balance.";
  } else if (status === "Pending") {
    nextAction = "No payment received yet — reach out before the due date.";
  } else if (status === "Partially Paid") {
    nextAction = `Remaining balance of ₹${remaining.toLocaleString("en-IN")} is due by ${dueDate}.`;
  }

  const barColor =
    status === "Paid"
      ? "bg-green-500"
      : status === "Overdue"
        ? "bg-red-500"
        : status === "Pending"
          ? "bg-neutral-300"
          : "bg-yellow-500";

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white w-full max-w-sm h-full shadow-lg overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200">
          <h3 className="text-lg font-semibold text-neutral-800">
            Fee Details
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
                {student.batch} · {student.course}
              </p>
            </div>
          </div>

          <div className="mt-6 border-t border-neutral-100 pt-4">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-neutral-500">Payment progress</span>
              <span className="font-medium text-neutral-800">
                {percentage}%
              </span>
            </div>
            <div className="h-2 bg-neutral-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${barColor}`}
                style={{ width: `${Math.min(percentage, 100)}%` }}
              />
            </div>
          </div>

          <div className="mt-6 space-y-3 border-t border-neutral-100 pt-4">
            <div className="flex justify-between text-sm">
              <span className="text-neutral-500">Total fee</span>
              <span className="text-neutral-800 font-medium">
                ₹{totalFee.toLocaleString("en-IN")}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-neutral-500">Paid</span>
              <span className="text-neutral-800 font-medium">
                ₹{paidAmount.toLocaleString("en-IN")}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-neutral-500">Remaining</span>
              <span
                className={`font-medium ${remaining > 0 ? "text-red-600" : "text-green-600"}`}
              >
                ₹{remaining.toLocaleString("en-IN")}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-neutral-500">Due date</span>
              <span className="text-neutral-800 font-medium">{dueDate}</span>
            </div>
            <div className="flex justify-between text-sm items-center">
              <span className="text-neutral-500">Status</span>
              <StatusBadge status={status} />
            </div>
          </div>

          <div className="mt-6 border-t border-neutral-100 pt-4">
            <p className="text-sm text-neutral-500 mb-2">Payment history</p>
            {paymentHistory.length === 0 ? (
              <p className="text-sm text-neutral-400">
                No payments recorded yet.
              </p>
            ) : (
              <ul className="space-y-2">
                {[...paymentHistory]
                  .sort((a, b) => new Date(b.date) - new Date(a.date))
                  .map((p) => (
                    <li
                      key={p.id}
                      className="flex items-center justify-between text-sm"
                    >
                      <div>
                        <p className="text-neutral-700">{p.date}</p>
                        <p className="text-xs text-neutral-400">{p.method}</p>
                      </div>
                      <span className="font-medium text-neutral-800">
                        ₹{p.amount.toLocaleString("en-IN")}
                      </span>
                    </li>
                  ))}
              </ul>
            )}
          </div>

          <div
            className={`mt-6 border rounded-lg p-4 ${
              status === "Overdue"
                ? "bg-red-50 border-red-100"
                : status === "Pending"
                  ? "bg-yellow-50 border-yellow-100"
                  : "bg-brand-50 border-brand-100"
            }`}
          >
            <p className="text-xs font-medium uppercase mb-1 text-neutral-600">
              Next action
            </p>
            <p className="text-sm text-neutral-700">{nextAction}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentFeeDetailsDrawer;
