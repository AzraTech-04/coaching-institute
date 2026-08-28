import { useState } from "react";
import StatusBadge from "./StatusBadge";
import ProgressBar from "./ProgressBar";
import { students } from "../data/studentsData";

function TestDetailsDrawer({
  test,
  batch,
  onClose,
  onEdit,
  onStatusChange,
  onComplete,
}) {
  const [documents, setDocuments] = useState(test ? test.materials : []);
  if (!test) return null;

  const registeredStudents = batch?.studentList || [];
  const performance = test.performance || [];
  const scores = performance.map((entry) => entry.score);
  const average = scores.length
    ? Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length)
    : 0;
  const highest = scores.length ? Math.max(...scores) : 0;
  const lowest = scores.length ? Math.min(...scores) : 0;
  const passCount = performance.filter(
    (entry) => entry.score >= test.passingMarks,
  ).length;
  const passRate = scores.length
    ? Math.round((passCount / scores.length) * 100)
    : 0;
  const nextStatus = {
    Draft: "Scheduled",
    Scheduled: "Ongoing",
    Ongoing: "Completed",
  }[test.status];
  const completedDocuments = documents.filter(
    (document) => document.submitted,
  ).length;

  function handleDocumentUpload(index) {
    setDocuments((current) =>
      current.map((document, documentIndex) =>
        documentIndex === index ? { ...document, submitted: true } : document,
      ),
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white w-full max-w-xl h-full shadow-lg overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 sticky top-0 bg-white z-10">
          <div>
            <p className="text-xs text-neutral-500 uppercase tracking-wide">
              Test details
            </p>
            <h3 className="text-lg font-semibold text-neutral-800 mt-0.5">
              {test.name}
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
                {test.type} · {test.subject}
              </p>
              <p className="text-sm text-neutral-600 mt-1">
                {test.description}
              </p>
            </div>
            <StatusBadge status={test.status} />
          </div>
          <button
            type="button"
            onClick={() => onEdit(test)}
            className="px-3.5 py-2 rounded-lg bg-brand-600 text-white text-sm font-medium hover:bg-brand-700"
          >
            Edit test
          </button>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 border-y border-neutral-100 py-4 text-sm">
            <div>
              <p className="text-neutral-400">Course</p>
              <p className="font-medium text-neutral-800 mt-1">{test.course}</p>
            </div>
            <div>
              <p className="text-neutral-400">Batch</p>
              <p className="font-medium text-neutral-800 mt-1">{test.batch}</p>
            </div>
            <div>
              <p className="text-neutral-400">Faculty</p>
              <p className="font-medium text-neutral-800 mt-1">
                {test.faculty}
              </p>
            </div>
            <div>
              <p className="text-neutral-400">Date / time</p>
              <p className="font-medium text-neutral-800 mt-1">
                {test.date} · {test.startTime}
              </p>
            </div>
            <div>
              <p className="text-neutral-400">Duration</p>
              <p className="font-medium text-neutral-800 mt-1">
                {test.duration} minutes
              </p>
            </div>
            <div>
              <p className="text-neutral-400">Marks</p>
              <p className="font-medium text-neutral-800 mt-1">
                {test.totalMarks} total · {test.passingMarks} pass
              </p>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-neutral-800">
                Status workflow
              </h4>
              <select
                value={test.status}
                onChange={(event) => onStatusChange(event.target.value)}
                className="px-2.5 py-1.5 text-sm border border-neutral-300 rounded-lg bg-white"
              >
                <option>Draft</option>
                <option>Scheduled</option>
                <option>Ongoing</option>
                <option>Completed</option>
              </select>
            </div>
            {nextStatus && (
              <button
                type="button"
                onClick={() =>
                  nextStatus === "Completed"
                    ? onComplete()
                    : onStatusChange(nextStatus)
                }
                className="w-full bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium py-2.5 rounded-lg"
              >
                {nextStatus === "Completed"
                  ? "Mark Test Completed"
                  : `Move to ${nextStatus}`}
              </button>
            )}
          </div>

          <div>
            <h4 className="font-semibold text-neutral-800 mb-3">
              Student participation
            </h4>
            <div className="grid grid-cols-3 gap-2 text-center border border-neutral-100 rounded-lg py-3">
              <div>
                <p className="text-lg font-bold text-neutral-800">
                  {registeredStudents.length || batch?.students || 0}
                </p>
                <p className="text-xs text-neutral-500">Registered</p>
              </div>
              <div>
                <p className="text-lg font-bold text-neutral-800">
                  {performance.length}
                </p>
                <p className="text-xs text-neutral-500">Attempted</p>
              </div>
              <div>
                <p className="text-lg font-bold text-neutral-800">
                  {Math.max(
                    (registeredStudents.length || batch?.students || 0) -
                      performance.length,
                    0,
                  )}
                </p>
                <p className="text-xs text-neutral-500">Not attempted</p>
              </div>
            </div>
            {!(registeredStudents.length || batch?.students) && (
              <p className="text-sm text-yellow-700 bg-yellow-50 rounded-lg p-3 mt-3">
                No students are enrolled in the selected batch.
              </p>
            )}
          </div>

          {test.status === "Completed" && (
            <div>
              <h4 className="font-semibold text-neutral-800 mb-3">
                Performance summary
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                {[
                  ["Average", average],
                  ["Highest", highest],
                  ["Lowest", lowest],
                  ["Pass rate", `${passRate}%`],
                ].map(([label, value]) => (
                  <div key={label} className="bg-neutral-50 rounded-lg p-3">
                    <p className="text-xs text-neutral-500">{label}</p>
                    <p className="text-lg font-bold text-neutral-800 mt-1">
                      {value}
                    </p>
                  </div>
                ))}
              </div>
              <div className="flex gap-4 text-sm mb-3">
                <span className="text-green-700">{passCount} passed</span>
                <span className="text-red-700">
                  {performance.length - passCount} failed
                </span>
              </div>
              <div className="space-y-2">
                {performance.map((entry) => {
                  const student = students.find(
                    (item) => item.id === entry.studentId,
                  );
                  const percentage = Math.round(
                    (entry.score / test.totalMarks) * 100,
                  );
                  return (
                    <div
                      key={entry.studentId}
                      className="flex items-center gap-3 text-sm"
                    >
                      <span className="w-28 truncate text-neutral-700">
                        {student?.name || "Student"}
                      </span>
                      <ProgressBar percentage={percentage} />
                      <span
                        className={`ml-auto font-medium ${entry.score >= test.passingMarks ? "text-green-700" : "text-red-700"}`}
                      >
                        {entry.score}/{test.totalMarks}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold text-neutral-800">Test materials</h4>
              <span className="text-xs text-neutral-500">
                {completedDocuments}/{documents.length} submitted
              </span>
            </div>
            <ProgressBar
              percentage={
                documents.length
                  ? Math.round((completedDocuments / documents.length) * 100)
                  : 0
              }
            />
            <div className="mt-4 divide-y divide-neutral-100 border border-neutral-100 rounded-lg">
              {documents.map((document, index) => (
                <div
                  key={document.name}
                  className="flex items-center justify-between px-3 py-3"
                >
                  <div>
                    <p className="text-sm font-medium text-neutral-700">
                      {document.name}
                    </p>
                    <p
                      className={`text-xs mt-0.5 ${document.submitted ? "text-green-600" : "text-neutral-400"}`}
                    >
                      {document.submitted ? "Submitted" : "Pending"}
                    </p>
                  </div>
                  {!document.submitted && (
                    <label className="text-brand-600 hover:text-brand-700 text-sm font-medium cursor-pointer">
                      Upload
                      <input
                        type="file"
                        className="hidden"
                        onChange={() => handleDocumentUpload(index)}
                      />
                    </label>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-brand-50 border border-brand-100 rounded-lg p-4">
            <p className="text-xs font-medium uppercase text-brand-700 mb-1">
              Next action
            </p>
            <p className="text-sm text-neutral-700">
              {test.status === "Completed"
                ? "Review student performance and publish results when ready."
                : `Prepare materials and ${nextStatus ? `move the test to ${nextStatus.toLowerCase()}` : "review the completed results"}.`}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TestDetailsDrawer;
