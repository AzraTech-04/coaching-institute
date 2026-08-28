import { useMemo } from "react";
import StatusBadge from "./StatusBadge";
import { students } from "../data/studentsData";

function AssignmentDetailsDrawer({
  assignment,
  batch,
  onClose,
  onEdit,
  onStatusChange,
  onMarkSubmitted,
}) {
  if (!assignment) return null;

  const submissions = assignment.submissions || [];
  const totalStudents = submissions.length || batch?.students || 0;
  const submittedCount = submissions.filter(
    (submission) => submission.status === "Submitted",
  ).length;
  const pendingCount = Math.max(totalStudents - submittedCount, 0);
  const progress = totalStudents
    ? Math.round((submittedCount / totalStudents) * 100)
    : 0;
  const pendingStudents = useMemo(
    () =>
      students.filter((student) =>
        submissions.some(
          (submission) =>
            submission.studentId === student.id &&
            submission.status === "Pending",
        ),
      ),
    [submissions],
  );

  const nextStatus =
    {
      Draft: "Active",
      Active: "Pending",
      Pending: "Completed",
      Completed: "Active",
    }[assignment.status] || "Active";

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white w-full max-w-xl h-full shadow-lg overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 sticky top-0 bg-white z-10">
          <div>
            <p className="text-xs text-neutral-500 uppercase tracking-wide">
              Assignment details
            </p>
            <h3 className="text-lg font-semibold text-neutral-800 mt-0.5">
              {assignment.title}
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
                {assignment.course} · {assignment.subject}
              </p>
              <p className="text-sm text-neutral-600 mt-1">
                {assignment.instructions}
              </p>
            </div>
            <StatusBadge status={assignment.status} />
          </div>

          <button
            type="button"
            onClick={() => onEdit(assignment)}
            className="px-3.5 py-2 rounded-lg bg-brand-600 text-white text-sm font-medium hover:bg-brand-700"
          >
            Edit assignment
          </button>

          <div className="grid grid-cols-2 gap-4 border-y border-neutral-100 py-4 text-sm">
            <div>
              <p className="text-neutral-400">Course</p>
              <p className="font-medium text-neutral-800 mt-1">
                {assignment.course}
              </p>
            </div>
            <div>
              <p className="text-neutral-400">Batch</p>
              <p className="font-medium text-neutral-800 mt-1">
                {assignment.batch}
              </p>
            </div>
            <div>
              <p className="text-neutral-400">Faculty</p>
              <p className="font-medium text-neutral-800 mt-1">
                {assignment.faculty}
              </p>
            </div>
            <div>
              <p className="text-neutral-400">Status</p>
              <p className="font-medium text-neutral-800 mt-1">
                {assignment.status}
              </p>
            </div>
            <div>
              <p className="text-neutral-400">Assigned date</p>
              <p className="font-medium text-neutral-800 mt-1">
                {assignment.assignedDate}
              </p>
            </div>
            <div>
              <p className="text-neutral-400">Due date</p>
              <p className="font-medium text-neutral-800 mt-1">
                {assignment.dueDate}
              </p>
            </div>
            <div>
              <p className="text-neutral-400">Total marks</p>
              <p className="font-medium text-neutral-800 mt-1">
                {assignment.totalMarks}
              </p>
            </div>
            <div>
              <p className="text-neutral-400">Students</p>
              <p className="font-medium text-neutral-800 mt-1">
                {totalStudents}
              </p>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-neutral-800">
                Submission progress
              </h4>
              <select
                value={assignment.status}
                onChange={(event) => onStatusChange(event.target.value)}
                className="px-2.5 py-1.5 text-sm border border-neutral-300 rounded-lg bg-white"
              >
                <option>Draft</option>
                <option>Active</option>
                <option>Pending</option>
                <option>Completed</option>
              </select>
            </div>

            <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-neutral-600">Submitted</span>
                <span className="font-medium text-neutral-800">
                  {submittedCount}/{totalStudents}
                </span>
              </div>
              <div className="h-2.5 w-full bg-neutral-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-brand-600 rounded-full"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="mt-3 flex items-center justify-between text-xs text-neutral-500">
                <span>{pendingCount} pending</span>
                <span>{progress}% complete</span>
              </div>
            </div>

            {pendingStudents.length > 0 && (
              <div className="mt-4">
                <p className="text-sm font-medium text-neutral-700 mb-2">
                  Mark pending student as submitted
                </p>
                <div className="space-y-2">
                  {pendingStudents.map((student) => (
                    <div
                      key={student.id}
                      className="flex items-center justify-between rounded-lg border border-neutral-200 px-3 py-2"
                    >
                      <span className="text-sm text-neutral-700">
                        {student.name}
                      </span>
                      <button
                        type="button"
                        onClick={() => onMarkSubmitted(student.id)}
                        className="text-xs font-medium text-brand-600 hover:text-brand-700"
                      >
                        Mark as Submitted
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {nextStatus && (
              <button
                type="button"
                onClick={() => onStatusChange(nextStatus)}
                className="w-full mt-4 bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium py-2.5 rounded-lg"
              >
                {nextStatus === "Completed"
                  ? "Mark Assignment Complete"
                  : `Move to ${nextStatus}`}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AssignmentDetailsDrawer;
