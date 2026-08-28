import { useState } from "react";
import StatusBadge from "./StatusBadge";
import ProgressBar from "./ProgressBar";
import EmptyState from "./EmptyState";
import { questionStatuses } from "../data/questionBankData";

function QuestionDetailsDrawer({ question, onClose, onEdit, onStatusChange }) {
  const [documents, setDocuments] = useState(question?.materials || []);

  if (!question) return null;

  const submittedDocuments = documents.filter(
    (document) => document.submitted,
  ).length;
  const nextAction = {
    Draft: "Complete the question before using it in a test.",
    Active: "Question is available for test creation.",
    Archived: "Question is no longer available for new tests.",
  }[question.status];

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
              Question details
            </p>
            <h3 className="text-lg font-semibold text-neutral-800 mt-0.5">
              {question.topic}
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
              <p className="text-sm text-neutral-500">
                {question.type} · {question.difficulty}
              </p>
              <p className="text-base text-neutral-800 mt-2 leading-6">
                {question.text}
              </p>
            </div>
            <StatusBadge status={question.status} />
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => onEdit(question)}
              className="px-3.5 py-2 rounded-lg bg-brand-600 text-white text-sm font-medium hover:bg-brand-700"
            >
              Edit question
            </button>
            <select
              value={question.status}
              onChange={(event) => onStatusChange(event.target.value)}
              className="px-3 py-2 border border-neutral-300 rounded-lg text-sm bg-white"
            >
              {questionStatuses.map((status) => (
                <option key={status}>{status}</option>
              ))}
            </select>
          </div>
          <section>
            <h4 className="font-semibold text-neutral-800 mb-3">Question</h4>
            <div className="bg-neutral-50 rounded-lg p-4 space-y-3">
              <div>
                <p className="text-xs text-neutral-500 mb-1">Options</p>
                {question.options.length ? (
                  <ul className="space-y-1 text-sm text-neutral-700">
                    {question.options.map((option) => (
                      <li
                        key={option}
                        className={
                          question.correctAnswer.includes(option)
                            ? "font-semibold text-green-700"
                            : ""
                        }
                      >
                        {option}
                        {question.correctAnswer.includes(option)
                          ? " (correct)"
                          : ""}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-neutral-700">Numerical response</p>
                )}
              </div>
              <div>
                <p className="text-xs text-neutral-500">Correct answer</p>
                <p className="text-sm font-medium text-neutral-800 mt-1">
                  {question.correctAnswer.join(", ")}
                </p>
              </div>
              <div>
                <p className="text-xs text-neutral-500">Explanation</p>
                <p className="text-sm text-neutral-700 mt-1">
                  {question.explanation || "No explanation added yet."}
                </p>
              </div>
            </div>
          </section>
          <section>
            <h4 className="font-semibold text-neutral-800 mb-3">
              Classification
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
              {[
                ["Course", question.course],
                ["Subject", question.subject],
                ["Topic", question.topic],
                ["Difficulty", question.difficulty],
                [
                  "Marks",
                  `${question.marks} (${question.negativeMarks} negative)`,
                ],
                ["Created by", question.createdBy],
                ["Created date", question.createdDate],
                ["Tags", question.tags.join(", ") || "None"],
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
              Used In Tests
            </h4>
            {question.usedInTests.length ? (
              <div className="space-y-2">
                {question.usedInTests.map((test) => (
                  <div
                    key={test}
                    className="border border-neutral-100 rounded-lg px-3 py-2 text-sm text-neutral-700"
                  >
                    {test}
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState
                title="Not used in any test yet"
                message="This question is ready to be included in a future assessment."
              />
            )}
          </section>
          <section>
            <h4 className="font-semibold text-neutral-800 mb-3">Usage</h4>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-neutral-50 rounded-lg p-3">
                <p className="text-xs text-neutral-500">Tests using question</p>
                <p className="text-lg font-bold text-neutral-800 mt-1">
                  {question.usedInTests.length}
                </p>
              </div>
              <div className="bg-neutral-50 rounded-lg p-3">
                <p className="text-xs text-neutral-500">Times attempted</p>
                <p className="text-lg font-bold text-neutral-800 mt-1">
                  {question.attempted}
                </p>
              </div>
            </div>
            {question.usedInTests.length > 0 && (
              <p className="text-xs text-neutral-500 mt-2">
                Last used in{" "}
                {question.usedInTests[question.usedInTests.length - 1]}
              </p>
            )}
          </section>
          <section>
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold text-neutral-800">
                Question materials
              </h4>
              <span className="text-xs text-neutral-500">
                {submittedDocuments}/{documents.length} submitted
              </span>
            </div>
            <ProgressBar
              percentage={
                documents.length
                  ? Math.round((submittedDocuments / documents.length) * 100)
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
                        onChange={() => uploadDocument(index)}
                      />
                    </label>
                  )}
                </div>
              ))}
            </div>
          </section>
          <div className="bg-brand-50 border border-brand-100 rounded-lg p-4">
            <p className="text-xs font-medium uppercase text-brand-700 mb-1">
              Next action
            </p>
            <p className="text-sm text-neutral-700">{nextAction}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default QuestionDetailsDrawer;
