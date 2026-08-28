import { useMemo, useState } from "react";
import AddDoubtModal from "../components/AddDoubtModal";
import DoubtDetailsDrawer from "../components/DoubtDetailsDrawer";
import EmptyState from "../components/EmptyState";
import PageHeader from "../components/PageHeader";
import StatCard from "../components/StatCard";
import StatusBadge from "../components/StatusBadge";
import { courses } from "../data/coursesData";
import { faculty } from "../data/facultyData";
import {
  doubts as initialDoubts,
  doubtPriorities,
  doubtStatuses,
} from "../data/doubtsData";
import { batches } from "../data/batchesData";

function PriorityBadge({ priority }) {
  const styles = {
    Low: "bg-green-50 text-green-700",
    Medium: "bg-yellow-50 text-yellow-700",
    High: "bg-red-50 text-red-700",
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${styles[priority] || "bg-neutral-100 text-neutral-600"}`}
    >
      {priority}
    </span>
  );
}

function Doubts() {
  const [doubts, setDoubts] = useState(initialDoubts);
  const [search, setSearch] = useState("");
  const [courseFilter, setCourseFilter] = useState("All");
  const [batchFilter, setBatchFilter] = useState("All");
  const [subjectFilter, setSubjectFilter] = useState("All");
  const [facultyFilter, setFacultyFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingDoubt, setEditingDoubt] = useState(null);
  const [selectedDoubtId, setSelectedDoubtId] = useState(null);

  const allSubjects = useMemo(
    () => [...new Set(doubts.map((doubt) => doubt.subject))],
    [doubts],
  );

  const filteredDoubts = doubts.filter((doubt) => {
    const query = search.toLowerCase();
    return (
      (!query ||
        `${doubt.student} ${doubt.course} ${doubt.batch} ${doubt.subject} ${doubt.topic} ${doubt.faculty} ${doubt.question}`
          .toLowerCase()
          .includes(query)) &&
      (courseFilter === "All" || doubt.course === courseFilter) &&
      (batchFilter === "All" || doubt.batch === batchFilter) &&
      (subjectFilter === "All" || doubt.subject === subjectFilter) &&
      (facultyFilter === "All" || doubt.faculty === facultyFilter) &&
      (priorityFilter === "All" || doubt.priority === priorityFilter) &&
      (statusFilter === "All" || doubt.status === statusFilter)
    );
  });

  const selectedDoubt = doubts.find((doubt) => doubt.id === selectedDoubtId);

  const stats = [
    {
      label: "Total Doubts",
      value: doubts.length,
      change: "Across all batches",
      trend: "up",
    },
    {
      label: "Open Doubts",
      value: doubts.filter((doubt) => doubt.status === "Open").length,
      change: "Awaiting faculty action",
      trend: "up",
    },
    {
      label: "In Progress",
      value: doubts.filter((doubt) => doubt.status === "In Progress").length,
      change: "Being reviewed",
      trend: "up",
    },
    {
      label: "Resolved",
      value: doubts.filter((doubt) => doubt.status === "Resolved").length,
      change: "Closed this week",
      trend: "up",
    },
  ];

  function saveDoubt(doubt) {
    const payload = {
      ...doubt,
      student: doubt.student || "Unknown Student",
      course: doubt.course || "",
      batch: doubt.batch || "",
      subject: doubt.subject || "",
      topic: doubt.topic || "General Doubt",
      question: doubt.question || "",
      faculty: doubt.faculty || "Unassigned",
      priority: doubt.priority || "Medium",
      status: doubt.status || "Open",
      createdDate: doubt.createdDate || new Date().toISOString().slice(0, 10),
      resolution: doubt.resolution || "",
    };

    if (editingDoubt) {
      setDoubts((current) =>
        current.map((item) =>
          item.id === editingDoubt.id ? { ...item, ...payload } : item,
        ),
      );
      setEditingDoubt(null);
      return;
    }

    setDoubts((current) => [
      { ...payload, id: Date.now(), facultyId: Number(payload.facultyId) || 0 },
      ...current,
    ]);
  }

  function updateStatus(doubtId, status) {
    setDoubts((current) =>
      current.map((doubt) =>
        doubt.id === doubtId ? { ...doubt, status } : doubt,
      ),
    );
  }

  const inputClass =
    "px-3.5 py-2.5 text-sm border border-neutral-300 rounded-lg outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 bg-white";

  const tableEmptyTitle =
    doubts.length === 0 ? "No doubts raised yet" : "No matching doubts";

  const tableEmptyMessage =
    doubts.length === 0
      ? "Raise the first doubt to start tracking academic support."
      : "Try adjusting your search or filters to find the right query.";

  return (
    <div>
      <PageHeader
        title="Doubts"
        subtitle="Track student academic questions, faculty support, and resolution progress across every batch."
        actionLabel="+ Raise Doubt"
        onAction={() => {
          setEditingDoubt(null);
          setModalOpen(true);
        }}
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
            placeholder="Search doubts..."
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
          value={subjectFilter}
          onChange={(event) => setSubjectFilter(event.target.value)}
          className={inputClass}
        >
          <option value="All">All Subjects</option>
          {allSubjects.map((subject) => (
            <option key={subject} value={subject}>
              {subject}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col sm:flex-row flex-wrap gap-3 mb-6">
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
          value={priorityFilter}
          onChange={(event) => setPriorityFilter(event.target.value)}
          className={inputClass}
        >
          <option value="All">All Priorities</option>
          {doubtPriorities.map((priority) => (
            <option key={priority} value={priority}>
              {priority}
            </option>
          ))}
        </select>

        <select
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
          className={inputClass}
        >
          <option value="All">All Status</option>
          {doubtStatuses.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </div>

      <div className="bg-white border border-neutral-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-neutral-200">
            <thead className="bg-neutral-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wide">
                  Student
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wide">
                  Course
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wide">
                  Subject
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wide">
                  Faculty
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wide">
                  Priority
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wide">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {filteredDoubts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-0">
                    <EmptyState
                      title={tableEmptyTitle}
                      message={tableEmptyMessage}
                      actionLabel={
                        doubts.length === 0 ? "+ Raise Doubt" : undefined
                      }
                      onAction={
                        doubts.length === 0
                          ? () => setModalOpen(true)
                          : undefined
                      }
                    />
                  </td>
                </tr>
              ) : (
                filteredDoubts.map((doubt) => (
                  <tr
                    key={doubt.id}
                    className="hover:bg-neutral-50 transition-colors cursor-pointer"
                    onClick={() => setSelectedDoubtId(doubt.id)}
                  >
                    <td className="px-4 py-4 align-top">
                      <div>
                        <p className="font-medium text-neutral-800">
                          {doubt.student}
                        </p>
                        <p className="text-sm text-neutral-500 mt-1">
                          {doubt.topic}
                        </p>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm text-neutral-700">
                      {doubt.course}
                    </td>
                    <td className="px-4 py-4 text-sm text-neutral-700">
                      {doubt.subject}
                    </td>
                    <td className="px-4 py-4 text-sm text-neutral-700">
                      {doubt.faculty}
                    </td>
                    <td className="px-4 py-4">
                      <PriorityBadge priority={doubt.priority} />
                    </td>
                    <td className="px-4 py-4">
                      <StatusBadge status={doubt.status} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AddDoubtModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingDoubt(null);
        }}
        doubt={editingDoubt}
        onSave={(doubt) => {
          saveDoubt(doubt);
          setModalOpen(false);
        }}
      />

      <DoubtDetailsDrawer
        doubt={selectedDoubt}
        onClose={() => setSelectedDoubtId(null)}
        onEdit={(doubt) => {
          setSelectedDoubtId(null);
          setEditingDoubt(doubt);
          setModalOpen(true);
        }}
        onStatusChange={(status) => {
          if (selectedDoubt) {
            updateStatus(selectedDoubt.id, status);
          }
        }}
      />
    </div>
  );
}

export default Doubts;
