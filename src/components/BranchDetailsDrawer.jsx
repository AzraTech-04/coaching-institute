import StatusBadge from "./StatusBadge";
import { batches } from "../data/batchesData";
import { faculty } from "../data/facultyData";
import { students } from "../data/studentsData";

function ListSection({ title, children, emptyMessage }) {
  return (
    <div className="mt-6 border-t border-neutral-100 pt-4">
      <p className="text-xs font-semibold text-neutral-400 uppercase mb-3">
        {title}
      </p>
      {children || <p className="text-sm text-neutral-400">{emptyMessage}</p>}
    </div>
  );
}

function BranchDetailsDrawer({ branch, onClose }) {
  if (!branch) return null;
  const relatedBatches = batches.filter((batch) =>
    branch.batchIds?.includes(batch.id),
  );
  const relatedFaculty = faculty.filter((member) =>
    relatedBatches.some((batch) => batch.facultyId === member.id),
  );
  const relatedStudents = students.filter((student) =>
    relatedBatches.some((batch) => batch.name === student.batch),
  );
  const relatedCourses = [
    ...new Set(relatedBatches.map((batch) => batch.course)),
  ];
  const occupancy =
    branch.capacity > 0 ? (relatedStudents.length / branch.capacity) * 100 : 0;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <aside className="relative bg-white w-full max-w-md h-full shadow-lg overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200">
          <h3 className="text-lg font-semibold text-neutral-800">
            Branch Details
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
              <h4 className="text-lg font-semibold text-neutral-800">
                {branch.name}
              </h4>
              <p className="text-sm text-neutral-500">
                {branch.code} · {branch.city}
              </p>
            </div>
            <StatusBadge status={branch.status} />
          </div>
          <div className="mt-6 space-y-3 border-t border-neutral-100 pt-4">
            <p className="text-xs font-semibold text-neutral-400 uppercase mb-1">
              Branch Information
            </p>
            {[
              ["Address", branch.address],
              ["Contact", branch.contact],
              ["Email", branch.email || "Not provided"],
              ["Manager", branch.manager || "Not assigned"],
              ["Capacity", branch.capacity],
            ].map(([label, value]) => (
              <div key={label} className="flex justify-between gap-4 text-sm">
                <span className="text-neutral-500">{label}</span>
                <span className="text-neutral-800 font-medium text-right">
                  {value}
                </span>
              </div>
            ))}
            <div className="flex justify-between gap-4 text-sm">
              <span className="text-neutral-500">Occupancy</span>
              <span className="text-neutral-800 font-medium">
                {relatedStudents.length} / {branch.capacity} (
                {Math.round(occupancy)}%)
              </span>
            </div>
          </div>
          <ListSection
            title="Courses offered"
            emptyMessage="No courses assigned"
          >
            <div className="flex flex-wrap gap-2">
              {relatedCourses.map((course) => (
                <span
                  key={course}
                  className="px-2.5 py-1 rounded-lg bg-brand-50 text-brand-700 text-xs font-medium"
                >
                  {course}
                </span>
              ))}
            </div>
          </ListSection>
          <ListSection title="Batches" emptyMessage="No batches assigned">
            {relatedBatches.length > 0 && (
              <div className="space-y-3">
                {relatedBatches.map((batch) => (
                  <div
                    key={batch.id}
                    className="border border-neutral-100 rounded-lg p-3"
                  >
                    <div className="flex justify-between gap-3">
                      <p className="text-sm font-medium text-neutral-800">
                        {batch.name}
                      </p>
                      <StatusBadge status={batch.status} />
                    </div>
                    <p className="text-xs text-neutral-500 mt-1">
                      {batch.course} · {batch.timing}
                    </p>
                    <p className="text-xs text-neutral-500 mt-1">
                      {batch.students} students · {batch.facultyName}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </ListSection>
          <ListSection title="Faculty" emptyMessage="No faculty assigned">
            {relatedFaculty.length > 0 && (
              <div className="space-y-2">
                {relatedFaculty.map((member) => (
                  <div key={member.id} className="flex justify-between text-sm">
                    <span className="text-neutral-700">{member.name}</span>
                    <span className="text-neutral-500">{member.subject}</span>
                  </div>
                ))}
              </div>
            )}
          </ListSection>
          <ListSection title="Students" emptyMessage="No students enrolled">
            {relatedStudents.length > 0 && (
              <div className="space-y-2">
                {relatedStudents.map((student) => (
                  <div
                    key={student.id}
                    className="flex justify-between text-sm"
                  >
                    <span className="text-neutral-700">{student.name}</span>
                    <span className="text-neutral-500">{student.status}</span>
                  </div>
                ))}
              </div>
            )}
          </ListSection>
        </div>
      </aside>
    </div>
  );
}

export default BranchDetailsDrawer;
