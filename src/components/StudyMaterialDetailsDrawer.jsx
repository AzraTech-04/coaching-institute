import { useMemo } from "react";
import StatusBadge from "./StatusBadge";
import { students } from "../data/studentsData";

function StudyMaterialDetailsDrawer({
  material,
  batch,
  onClose,
  onEdit,
  onStatusChange,
}) {
  if (!material) return null;

  const relatedStudents = useMemo(
    () =>
      students.filter(
        (student) =>
          material.studentIds?.includes(student.id) ||
          student.batch === material.batch,
      ),
    [material.batch, material.studentIds],
  );

  const nextStatus =
    {
      Draft: "Published",
      Published: "Archived",
      Archived: "Published",
    }[material.status] || "Published";

  const accessSummary =
    material.studentAccessCount ?? relatedStudents.length ?? 0;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white w-full max-w-xl h-full shadow-lg overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 sticky top-0 bg-white z-10">
          <div>
            <p className="text-xs text-neutral-500 uppercase tracking-wide">
              Study material details
            </p>
            <h3 className="text-lg font-semibold text-neutral-800 mt-0.5">
              {material.title}
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
                {material.course} · {material.subject}
              </p>
              <p className="text-sm text-neutral-600 mt-1">{material.topic}</p>
            </div>
            <StatusBadge status={material.status} />
          </div>

          <button
            type="button"
            onClick={() => onEdit(material)}
            className="px-3.5 py-2 rounded-lg bg-brand-600 text-white text-sm font-medium hover:bg-brand-700"
          >
            Edit material
          </button>

          <div className="grid grid-cols-2 gap-4 border-y border-neutral-100 py-4 text-sm">
            <div>
              <p className="text-neutral-400">Course</p>
              <p className="font-medium text-neutral-800 mt-1">
                {material.course}
              </p>
            </div>
            <div>
              <p className="text-neutral-400">Batch</p>
              <p className="font-medium text-neutral-800 mt-1">
                {material.batch}
              </p>
            </div>
            <div>
              <p className="text-neutral-400">Faculty</p>
              <p className="font-medium text-neutral-800 mt-1">
                {material.faculty}
              </p>
            </div>
            <div>
              <p className="text-neutral-400">Material type</p>
              <p className="font-medium text-neutral-800 mt-1">
                {material.materialType}
              </p>
            </div>
            <div>
              <p className="text-neutral-400">Topic</p>
              <p className="font-medium text-neutral-800 mt-1">
                {material.topic}
              </p>
            </div>
            <div>
              <p className="text-neutral-400">Resource</p>
              <p className="font-medium text-neutral-800 mt-1">
                {material.resourceName}
              </p>
            </div>
            <div>
              <p className="text-neutral-400">Uploaded date</p>
              <p className="font-medium text-neutral-800 mt-1">
                {material.uploadedDate}
              </p>
            </div>
            <div>
              <p className="text-neutral-400">Student access</p>
              <p className="font-medium text-neutral-800 mt-1">
                {accessSummary} students
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-neutral-800">
                Resource visibility
              </h4>
              <select
                value={material.status}
                onChange={(event) => onStatusChange(event.target.value)}
                className="px-2.5 py-1.5 text-sm border border-neutral-300 rounded-lg bg-white"
              >
                <option>Draft</option>
                <option>Published</option>
                <option>Archived</option>
              </select>
            </div>

            <div className="space-y-2 text-sm text-neutral-700">
              <div className="flex justify-between">
                <span>Batch</span>
                <span className="font-medium">{material.batch}</span>
              </div>
              <div className="flex justify-between">
                <span>Students with access</span>
                <span className="font-medium">{accessSummary}</span>
              </div>
              <div className="flex justify-between">
                <span>Current status</span>
                <span className="font-medium">{material.status}</span>
              </div>
            </div>
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
              {material.status === "Draft"
                ? "Publish material"
                : material.status === "Published"
                  ? "Archive material"
                  : "Publish material"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudyMaterialDetailsDrawer;
