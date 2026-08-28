import { useState } from "react";
import { faculty as rawFaculty } from "../data/facultyData";
import { batches as allBatches } from "../data/batchesData";
import StatusBadge from "../components/StatusBadge";
import PageHeader from "../components/PageHeader";
import EmptyState from "../components/EmptyState";
import StatCard from "../components/StatCard";
import AddFacultyModal from "../components/AddFacultyModal";
import FacultyDetailsDrawer from "../components/FacultyDetailsDrawer";

function enrichFacultyMember(member) {
  const assignedBatches = allBatches.filter((b) => b.facultyId === member.id);
  const assignedCourses = [...new Set(assignedBatches.map((b) => b.course))];
  const studentCount = assignedBatches.reduce((sum, b) => sum + b.students, 0);
  return { ...member, assignedBatches, assignedCourses, studentCount };
}

const initialFaculty = rawFaculty.map(enrichFacultyMember);

function Faculty() {
  const [faculty, setFaculty] = useState(initialFaculty);
  const [search, setSearch] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [batchFilter, setBatchFilter] = useState("All");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);

  const filteredFaculty = faculty.filter((f) => {
    const matchesSearch = f.name.toLowerCase().includes(search.toLowerCase());
    const matchesSubject =
      subjectFilter === "All" || f.subject === subjectFilter;
    const matchesStatus = statusFilter === "All" || f.status === statusFilter;
    const matchesBatch =
      batchFilter === "All" ||
      f.assignedBatches.some((b) => b.name === batchFilter);
    return matchesSearch && matchesSubject && matchesStatus && matchesBatch;
  });

  const stats = [
    {
      label: "Total Faculty",
      value: faculty.length,
      change: "All staff",
      trend: "up",
    },
    {
      label: "Active Faculty",
      value: faculty.filter((f) => f.status === "Active").length,
      change: "Currently teaching",
      trend: "up",
    },
    {
      label: "Assigned to Batches",
      value: faculty.filter((f) => f.assignedBatches.length > 0).length,
      change: "Have a schedule",
      trend: "up",
    },
    {
      label: "Subjects Covered",
      value: [...new Set(faculty.map((f) => f.subject))].length,
      change: "Across all faculty",
      trend: "up",
    },
  ];

  function handleAddFaculty(form) {
    const newId = faculty.length + 1;
    const assignedBatches = allBatches
      .filter((b) => form.batchIds.includes(b.id))
      .map((b) => ({ ...b, facultyId: newId, facultyName: form.name }));
    const derivedCourses = [
      ...new Set([
        ...form.courseNames,
        ...assignedBatches.map((b) => b.course),
      ]),
    ];

    const newMember = {
      id: newId,
      name: form.name,
      subject: form.subject,
      experience: form.experience,
      contact: form.contact,
      status: "Active",
      documents: [
        { name: "Qualification Certificate", submitted: false },
        { name: "ID Proof", submitted: false },
        { name: "Experience Certificate", submitted: false },
        { name: "Other Documents", submitted: false },
      ],
      assignedBatches,
      assignedCourses: derivedCourses,
      studentCount: assignedBatches.reduce((sum, b) => sum + b.students, 0),
    };
    setFaculty([newMember, ...faculty]);
  }

  function handleStatusChange(id, newStatus) {
    setFaculty(
      faculty.map((f) => (f.id === id ? { ...f, status: newStatus } : f)),
    );
    setSelectedMember((prev) =>
      prev && prev.id === id ? { ...prev, status: newStatus } : prev,
    );
  }

  function handleDocumentUpload(id, docName) {
    function updateDocs(member) {
      return {
        ...member,
        documents: member.documents.map((d) =>
          d.name === docName ? { ...d, submitted: true } : d,
        ),
      };
    }
    setFaculty(faculty.map((f) => (f.id === id ? updateDocs(f) : f)));
    setSelectedMember((prev) =>
      prev && prev.id === id ? updateDocs(prev) : prev,
    );
  }

  const subjectOptions = [...new Set(faculty.map((f) => f.subject))];
  const batchOptionsForFilter = [
    ...new Set(faculty.flatMap((f) => f.assignedBatches.map((b) => b.name))),
  ];

  return (
    <div>
      <PageHeader
        title="Faculty"
        subtitle="Manage faculty members here."
        actionLabel="+ Add Faculty"
        onAction={() => setModalOpen(true)}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((stat) => (
          <StatCard
            key={stat.label}
            label={stat.label}
            value={stat.value}
            change={stat.change}
            trend={stat.trend}
          />
        ))}
      </div>

      <div className="flex flex-col sm:flex-row flex-wrap gap-3 mb-4">
        <div className="relative flex-1 min-w-[180px]">
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
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search faculty..."
            className="w-full pl-9 pr-3 py-2.5 text-sm border border-neutral-300 rounded-lg outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
          />
        </div>
        <select
          value={subjectFilter}
          onChange={(e) => setSubjectFilter(e.target.value)}
          className="px-3.5 py-2.5 text-sm border border-neutral-300 rounded-lg outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 bg-white"
        >
          <option value="All">All Subjects</option>
          {subjectOptions.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3.5 py-2.5 text-sm border border-neutral-300 rounded-lg outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 bg-white"
        >
          <option value="All">All Statuses</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
        <select
          value={batchFilter}
          onChange={(e) => setBatchFilter(e.target.value)}
          className="px-3.5 py-2.5 text-sm border border-neutral-300 rounded-lg outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 bg-white"
        >
          <option value="All">All Batches</option>
          {batchOptionsForFilter.map((b) => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
        </select>
      </div>

      <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden shadow-sm">
        {faculty.length === 0 ? (
          <EmptyState
            title="No faculty members yet"
            message="Add your first faculty member to start assigning batches."
            actionLabel="+ Add Faculty"
            onAction={() => setModalOpen(true)}
          />
        ) : filteredFaculty.length === 0 ? (
          <EmptyState
            title="No matching faculty"
            message="Try adjusting your search or filters to find what you're looking for."
          />
        ) : (
          <table className="w-full text-sm text-left">
            <thead className="bg-neutral-50 text-neutral-500 uppercase text-xs">
              <tr>
                <th className="px-5 py-3">Name</th>
                <th className="px-5 py-3">Subject</th>
                <th className="px-5 py-3">Courses</th>
                <th className="px-5 py-3">Batches</th>
                <th className="px-5 py-3">Experience</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {filteredFaculty.map((member) => (
                <tr
                  key={member.id}
                  className="hover:bg-neutral-50 cursor-pointer"
                  onClick={() => setSelectedMember(member)}
                >
                  <td className="px-5 py-3 font-medium text-neutral-800">
                    {member.name}
                  </td>
                  <td className="px-5 py-3 text-neutral-600">
                    {member.subject}
                  </td>
                  <td className="px-5 py-3 text-neutral-600">
                    {member.assignedCourses.join(", ") || "—"}
                  </td>
                  <td className="px-5 py-3 text-neutral-600">
                    {member.assignedBatches.length}
                  </td>
                  <td className="px-5 py-3 text-neutral-600">
                    {member.experience}
                  </td>
                  <td className="px-5 py-3">
                    <StatusBadge status={member.status} />
                  </td>
                  <td className="px-5 py-3 text-right">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedMember(member);
                      }}
                      className="text-brand-600 hover:text-brand-700 font-medium text-sm"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <AddFacultyModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onAdd={handleAddFaculty}
      />
      <FacultyDetailsDrawer
        member={selectedMember}
        onClose={() => setSelectedMember(null)}
        onStatusChange={handleStatusChange}
        onDocumentUpload={handleDocumentUpload}
      />
    </div>
  );
}

export default Faculty;
