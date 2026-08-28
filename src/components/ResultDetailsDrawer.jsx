import { useState } from "react";
import StatusBadge from "./StatusBadge";
import ProgressBar from "./ProgressBar";
import {
  resultDetails,
  resultDocuments,
  subjectBreakdowns,
} from "../data/resultsData";

function ResultDetailsDrawer({
  result,
  history,
  published,
  category,
  onClose,
  onEdit,
}) {
  const [documents, setDocuments] = useState(resultDocuments);
  if (!result) return null;

  const details = resultDetails[`${result.test.id}-${result.student.id}`] || {
    correctAnswers: result.score
      ? Math.round((result.score / result.test.totalMarks) * 30)
      : 0,
    incorrectAnswers: result.score
      ? Math.round((result.score / result.test.totalMarks) * 6)
      : 0,
    attemptedQuestions: result.score ? 30 : 0,
    notAttemptedQuestions: result.score ? 0 : 30,
  };
  const breakdown = subjectBreakdowns[result.test.id] || [
    { subject: result.test.subject, percentage: result.percentage },
  ];
  const submittedDocuments = documents.filter(
    (document) => document.submitted,
  ).length;

  function uploadDocument(index) {
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
        <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b border-neutral-200 bg-white">
          <div>
            <p className="text-xs text-neutral-500 uppercase tracking-wide">
              Student result
            </p>
            <h3 className="text-lg font-semibold text-neutral-800 mt-0.5">
              {result.student.name}
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
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <div className="px-6 py-6 space-y-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm text-neutral-500">{result.test.name}</p>
              <p className="text-sm text-neutral-600 mt-1">
                {result.test.date} · {result.test.subject}
              </p>
            </div>
            <StatusBadge status={published ? "Published" : result.status} />
          </div>
          <button
            type="button"
            onClick={() => onEdit(result)}
            className="px-3.5 py-2 rounded-lg bg-brand-600 text-white text-sm font-medium hover:bg-brand-700"
          >
            Edit result
          </button>
          <section>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-brand-50 rounded-lg p-3">
                <p className="text-xs text-brand-700">Score</p>
                <p className="text-xl font-bold text-neutral-800 mt-1">
                  {result.score}/{result.test.totalMarks}
                </p>
              </div>
              <div className="bg-neutral-50 rounded-lg p-3">
                <p className="text-xs text-neutral-500">Percentage</p>
                <p className="text-xl font-bold text-neutral-800 mt-1">
                  {result.percentage}%
                </p>
              </div>
              <div className="bg-neutral-50 rounded-lg p-3">
                <p className="text-xs text-neutral-500">Rank</p>
                <p className="text-xl font-bold text-neutral-800 mt-1">
                  {result.rank ? `#${result.rank}` : "-"}
                </p>
              </div>
              <div className="bg-neutral-50 rounded-lg p-3">
                <p className="text-xs text-neutral-500">Result</p>
                <p
                  className={`text-sm font-semibold mt-2 ${result.status === "Pass" ? "text-green-700" : result.status === "Fail" ? "text-red-700" : "text-neutral-500"}`}
                >
                  {result.status}
                </p>
              </div>
            </div>
            <p className="text-sm text-neutral-600 mt-3">
              Performance category: <span className="font-semibold text-neutral-800">{category}</span>
            </p>
            <div className="mt-4">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-neutral-500">Overall performance</span>
                <span className="font-medium text-neutral-700">
                  {result.percentage}%
                </span>
              </div>
              <ProgressBar percentage={result.percentage} />
            </div>
          </section>
          <section>
            <h4 className="font-semibold text-neutral-800 mb-3">
              Student and test information
            </h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              {[
                ["Student", result.student.name],
                ["Batch", result.student.batch],
                ["Course", result.test.course],
                ["Test date", result.test.date],
                ["Total marks", result.test.totalMarks],
                ["Passing marks", result.test.passingMarks],
              ].map(([label, value]) => (
                <div key={label}>
                  <p className="text-neutral-400">{label}</p>
                  <p className="font-medium text-neutral-800 mt-1">{value}</p>
                </div>
              ))}
            </div>
          </section>
          <section>
            <h4 className="font-semibold text-neutral-800 mb-3">
              Answer breakdown
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="border border-green-100 rounded-lg p-3">
                <p className="text-lg font-bold text-green-700">
                  {details.correctAnswers}
                </p>
                <p className="text-xs text-neutral-500">Correct</p>
              </div>
              <div className="border border-red-100 rounded-lg p-3">
                <p className="text-lg font-bold text-red-700">
                  {details.incorrectAnswers}
                </p>
                <p className="text-xs text-neutral-500">Incorrect</p>
              </div>
              <div className="border border-neutral-100 rounded-lg p-3">
                <p className="text-lg font-bold text-neutral-800">
                  {details.attemptedQuestions}
                </p>
                <p className="text-xs text-neutral-500">Attempted</p>
              </div>
              <div className="border border-neutral-100 rounded-lg p-3">
                <p className="text-lg font-bold text-neutral-800">
                  {details.notAttemptedQuestions}
                </p>
                <p className="text-xs text-neutral-500">Not attempted</p>
              </div>
            </div>
          </section>
          <section>
            <h4 className="font-semibold text-neutral-800 mb-3">
              Performance breakdown
            </h4>
            <div className="space-y-3">
              {breakdown.map((item) => (
                <div key={item.subject} className="flex items-center gap-3">
                  <span className="w-28 text-sm text-neutral-700">
                    {item.subject}
                  </span>
                  <ProgressBar percentage={item.percentage} />
                </div>
              ))}
            </div>
          </section>
          <section>
            <h4 className="font-semibold text-neutral-800 mb-3">
              Recent Test Performance
            </h4>
            <div className="divide-y divide-neutral-100 border border-neutral-100 rounded-lg">
              {history.length ? (
                history.map((item) => (
                  <div
                    key={item.test.id}
                    className="flex items-center justify-between px-3 py-3 text-sm"
                  >
                    <div>
                      <p className="font-medium text-neutral-700">
                        {item.test.name}
                      </p>
                      <p className="text-xs text-neutral-400 mt-0.5">
                        {item.percentage}% · Rank #{item.rank}
                      </p>
                    </div>
                    <span className="font-semibold text-neutral-800">
                      {item.marksObtained}/{item.totalMarks}
                    </span>
                  </div>
                ))
              ) : (
                <p className="p-3 text-sm text-neutral-500">
                  No previous completed test results.
                </p>
              )}
            </div>
          </section>
          <section>
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold text-neutral-800">
                Result documents
              </h4>
              <span className="text-xs text-neutral-500">
                {submittedDocuments}/{documents.length} submitted
              </span>
            </div>
            <ProgressBar
              percentage={Math.round(
                (submittedDocuments / documents.length) * 100,
              )}
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
                        onChange={() => uploadDocument(index)}
                      />
                    </label>
                  )}
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default ResultDetailsDrawer;
