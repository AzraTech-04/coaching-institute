import { useState } from "react";
import PageHeader from "../components/PageHeader";
import StatCard from "../components/StatCard";
import StatusBadge from "../components/StatusBadge";
import EmptyState from "../components/EmptyState";
import AddAssignmentModal from "../components/AddAssignmentModal";
import AssignmentDetailsDrawer from "../components/AssignmentDetailsDrawer";
import {
  assignments as initialAssignments,
  assignmentStatuses,
} from "../data/assignmentsData";
import { courses } from "../data/coursesData";
import { batches } from "../data/batchesData";
import { faculty } from "../data/facultyData";
import { students } from "../data/studentsData";

function buildSubmissions(batchName, submittedStudentIds = []) {
  const batchStudents = students
    .filter((student) => student.batch === batchName)
    .map((student) => student.id);

  return batchStudents.map((studentId) => ({
    studentId,
    status: submittedStudentIds.includes(studentId) ? "Submitted" : "Pending",
  }));
}

function Assignments() {
  const [assignments, setAssignments] = useState(initialAssignments);
  const [search, setSearch] = useState("");
  const [courseFilter, setCourseFilter] = useState("All");
  const [batchFilter, setBatchFilter] = useState("All");
  const [facultyFilter, setFacultyFilter] = useState("All");
  const [subjectFilter, setSubjectFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState(null);
  const [selectedAssignmentId, setSelectedAssignmentId] = useState(null);

  const filteredAssignments = assignments.filter((assignment) => {
    const query = search.toLowerCase();
    return (
      (!query ||
        `${assignment.title} ${assignment.subject} ${assignment.batch} ${assignment.faculty}`
          .toLowerCase()
          .includes(query)) &&
      (courseFilter === "All" || assignment.course === courseFilter) &&
      (batchFilter === "All" || assignment.batch === batchFilter) &&
      (facultyFilter === "All" || assignment.faculty === facultyFilter) &&
      (subjectFilter === "All" || assignment.subject === subjectFilter) &&
      (statusFilter === "All" || assignment.status === statusFilter)
    );
  });

  const selectedAssignment = assignments.find(
    (assignment) => assignment.id === selectedAssignmentId,
  );
  const selectedBatch = selectedAssignment
    ? batches.find((batch) => batch.name === selectedAssignment.batch)
    : null;

  const stats = [
    {
      label: "Total Assignments",
      value: assignments.length,
      change: "Across active batches",
      trend: "up",
    },
    {
      label: "Active Assignments",
      value: assignments.filter((assignment) =>
        ["Active", "Pending"].includes(assignment.status),
      ).length,
      change: "Currently in progress",
      trend: "up",
    },
    {
      label: "Pending Submissions",
      value: assignments.reduce(
        (total, assignment) =>
          total +
          (assignment.submissions || []).filter(
            (submission) => submission.status === "Pending",
          ).length,
        0,
      ),
      change: "Needs follow-up",
      trend: "up",
    },
    {
      label: "Completed Assignments",
      value: assignments.filter(
        (assignment) => assignment.status === "Completed",
      ).length,
      change: "Assignments closed",
      trend: "up",
    },
  ];

  function saveAssignment(assignment) {
    const payload = {
      ...assignment,
      status: assignment.status || "Active",
      submissions:
        assignment.submissions || buildSubmissions(assignment.batch, []),
    };

    if (editingAssignment) {
      setAssignments((current) =>
        current.map((item) =>
          item.id === editingAssignment.id ? { ...item, ...payload } : item,
        ),
      );
      setEditingAssignment(null);
      return;
    }

    setAssignments((current) => [
      {
        ...payload,
        id: Date.now(),
        submissions:
          payload.submissions && payload.submissions.length
            ? payload.submissions
            : buildSubmissions(payload.batch, []),
      },
      ...current,
    ]);
  }

  function openCreateModal() {
    setEditingAssignment(null);
    setModalOpen(true);
  }

  function openEditModal(assignment) {
    setSelectedAssignmentId(null);
    setEditingAssignment(assignment);
    setModalOpen(true);
  }

  function updateStatus(assignmentId, status) {
    setAssignments((current) =>
      current.map((assignment) =>
        assignment.id === assignmentId ? { ...assignment, status } : assignment,
      ),
    );
  }

  function markStudentSubmitted(assignmentId, studentId) {
    setAssignments((current) =>
      current.map((assignment) => {
        if (assignment.id !== assignmentId) return assignment;

        const updatedSubmissions = (assignment.submissions || []).map(
          (submission) =>
            submission.studentId === studentId
              ? { ...submission, status: "Submitted" }
              : submission,
        );

        const pendingCount = updatedSubmissions.filter(
          (submission) => submission.status === "Pending",
        ).length;

        return {
          ...assignment,
          submissions: updatedSubmissions,
          status: pendingCount === 0 ? "Completed" : "Pending",
        };
      }),
    );
  }

  const tableEmptyTitle =
    assignments.length === 0
      ? "No assignments yet"
      : statusFilter === "Active"
        ? "No active assignments"
        : statusFilter === "Completed"
          ? "No completed assignments"
          : "No matching assignments";

  const tableEmptyMessage =
    assignments.length === 0
      ? "Create your first assignment to begin tracking academic work."
      : statusFilter === "Active"
        ? "There are no active assignments matching this view."
        : statusFilter === "Completed"
          ? "Completed assignments will appear here."
          : "Try adjusting your search or filters to find what you are looking for.";

  const inputClass =
    "px-3.5 py-2.5 text-sm border border-neutral-300 rounded-lg outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 bg-white";

  return (
    <div>
      <PageHeader
        title="Assignments"
        subtitle="Track academic tasks, submission progress, and class-level work assigned by faculty."
        actionLabel="+ Create Assignment"
        onAction={openCreateModal}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      <div className="flex flex-col sm:flex-row flex-wrap gap-3 mb-4">
        <div className="relative flex-1 min-w-[220px]">
          <svg
            className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-4.35-4.35M17 10.5A6.5 6.5 0 114 10.5a6.5 6.5 0 0113 0z"
            />
          </svg>
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search assignments..."
            className={`w-full pl-9 ${inputClass}`}
          />
        </div>

        <select
          value={courseFilter}
          onChange={(event) => setCourseFilter(event.target.value)}
          className={inputClass}
        >
          <option value="All">All Courses</option>
          {courses.map((course) => (
            <option key={course.id} value={course.name}>
              {course.name}
            </option>
          ))}
        </select>

        <select
          value={batchFilter}
          onChange={(event) => setBatchFilter(event.target.value)}
          className={inputClass}
        >
          <option value="All">All Batches</option>
          {batches.map((batch) => (
            <option key={batch.id} value={batch.name}>
              {batch.name}
            </option>
          ))}
        </select>

        <select
          value={facultyFilter}
          onChange={(event) => setFacultyFilter(event.target.value)}
          className={inputClass}
        >
          <option value="All">All Faculty</option>
          {faculty.map((member) => (
            <option key={member.id} value={member.name}>
              {member.name}
            </option>
          ))}
        </select>

        <select
          value={subjectFilter}
          onChange={(event) => setSubjectFilter(event.target.value)}
          className={inputClass}
        >
          <option value="All">All Subjects</option>
          {[
            ...new Set(assignments.map((assignment) => assignment.subject)),
          ].map((subject) => (
            <option key={subject} value={subject}>
              {subject}
            </option>
          ))}
        </select>

        <select
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
          className={inputClass}
        >
          <option value="All">All Statuses</option>
          {assignmentStatuses.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </div>

      <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden shadow-sm">
        {filteredAssignments.length === 0 ? (
          <EmptyState
            title={tableEmptyTitle}
            message={tableEmptyMessage}
            actionLabel={
              assignments.length === 0 ? "+ Create Assignment" : undefined
            }
            onAction={openCreateModal}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left min-w-[1100px]">
              <thead className="bg-neutral-50 text-neutral-500 uppercase text-xs">
                <tr>
                  <th className="px-5 py-3">Assignment</th>
                  <th className="px-5 py-3">Course / batch</th>
                  <th className="px-5 py-3">Faculty</th>
                  <th className="px-5 py-3">Subject</th>
                  <th className="px-5 py-3">Assigned</th>
                  <th className="px-5 py-3">Due</th>
                  <th className="px-5 py-3">Marks</th>
                  <th className="px-5 py-3">Submissions</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {filteredAssignments.map((assignment) => {
                  const submissions = assignment.submissions || [];
                  const studentCount = submissions.length || 0;
                  const submittedCount = submissions.filter(
                    (submission) => submission.status === "Submitted",
                  ).length;
                  const progress = studentCount
                    ? Math.round((submittedCount / studentCount) * 100)
                    : 0;

                  return (
                    <tr
                      key={assignment.id}
                      className="hover:bg-neutral-50 cursor-pointer"
                      onClick={() => setSelectedAssignmentId(assignment.id)}
                    >
                      <td className="px-5 py-3.5 font-medium text-neutral-800">
                        {assignment.title}
                      </td>
                      <td className="px-5 py-3.5">
                        <p className="text-neutral-700">{assignment.course}</p>
                        <p className="text-xs text-neutral-400 mt-0.5">
                          {assignment.batch}
                        </p>
                      </td>
                      <td className="px-5 py-3.5 text-neutral-600">
                        {assignment.faculty}
                      </td>
                      <td className="px-5 py-3.5 text-neutral-600">
                        {assignment.subject}
                      </td>
                      <td className="px-5 py-3.5 text-neutral-600">
                        {assignment.assignedDate}
                      </td>
                      <td className="px-5 py-3.5 text-neutral-600">
                        {assignment.dueDate}
                      </td>
                      <td className="px-5 py-3.5 text-neutral-600">
                        {assignment.totalMarks}
                      </td>
                      <td className="px-5 py-3.5 text-neutral-600">
                        <p className="font-medium text-neutral-700">
                          {submittedCount}/{studentCount}
                        </p>
                        <p className="text-xs text-neutral-400 mt-0.5">
                          {progress}% complete
                        </p>
                      </td>
                      <td className="px-5 py-3.5">
                        <StatusBadge status={assignment.status} />
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <button
                          type="button"
                          onClick={(event) => {
                            event.stopPropagation();
                            setSelectedAssignmentId(assignment.id);
                          }}
                          className="text-brand-600 hover:text-brand-700 font-medium"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {modalOpen && (
        <AddAssignmentModal
          key={editingAssignment ? editingAssignment.id : "new-assignment"}
          open={modalOpen}
          assignment={editingAssignment}
          onClose={() => {
            setModalOpen(false);
            setEditingAssignment(null);
          }}
          onSave={saveAssignment}
        />
      )}

      <AssignmentDetailsDrawer
        key={selectedAssignment?.id || "no-assignment"}
        assignment={selectedAssignment}
        batch={selectedBatch}
        onClose={() => setSelectedAssignmentId(null)}
        onEdit={openEditModal}
        onStatusChange={(status) => updateStatus(selectedAssignmentId, status)}
        onMarkSubmitted={(studentId) =>
          selectedAssignmentId &&
          markStudentSubmitted(selectedAssignmentId, studentId)
        }
      />
    </div>
  );
}

export default Assignments;
