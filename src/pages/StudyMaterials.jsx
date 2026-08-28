import { useMemo, useState } from "react";
import AddStudyMaterialModal from "../components/AddStudyMaterialModal";
import EmptyState from "../components/EmptyState";
import PageHeader from "../components/PageHeader";
import StatCard from "../components/StatCard";
import StatusBadge from "../components/StatusBadge";
import StudyMaterialDetailsDrawer from "../components/StudyMaterialDetailsDrawer";
import { batches } from "../data/batchesData";
import { courses } from "../data/coursesData";
import { faculty } from "../data/facultyData";
import { students } from "../data/studentsData";
import {
  materialStatuses,
  materialTypes,
  studyMaterials as initialStudyMaterials,
} from "../data/studyMaterialsData";

function StudyMaterials() {
  const [materials, setMaterials] = useState(initialStudyMaterials);
  const [search, setSearch] = useState("");
  const [courseFilter, setCourseFilter] = useState("All");
  const [batchFilter, setBatchFilter] = useState("All");
  const [subjectFilter, setSubjectFilter] = useState("All");
  const [facultyFilter, setFacultyFilter] = useState("All");
  const [materialTypeFilter, setMaterialTypeFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState(null);
  const [selectedMaterialId, setSelectedMaterialId] = useState(null);

  const allSubjects = useMemo(
    () => [...new Set(materials.map((material) => material.subject))],
    [materials],
  );

  const filteredMaterials = materials.filter((material) => {
    const query = search.toLowerCase();
    return (
      (!query ||
        `${material.title} ${material.subject} ${material.topic} ${material.batch} ${material.faculty} ${material.course}`
          .toLowerCase()
          .includes(query)) &&
      (courseFilter === "All" || material.course === courseFilter) &&
      (batchFilter === "All" || material.batch === batchFilter) &&
      (subjectFilter === "All" || material.subject === subjectFilter) &&
      (facultyFilter === "All" || material.faculty === facultyFilter) &&
      (materialTypeFilter === "All" ||
        material.materialType === materialTypeFilter) &&
      (statusFilter === "All" || material.status === statusFilter)
    );
  });

  const stats = [
    {
      label: "Total Materials",
      value: materials.length,
      change: "Across all batches",
      trend: "up",
    },
    {
      label: "Published Materials",
      value: materials.filter((material) => material.status === "Published")
        .length,
      change: "Live for students",
      trend: "up",
    },
    {
      label: "Draft Materials",
      value: materials.filter((material) => material.status === "Draft").length,
      change: "Waiting for review",
      trend: "up",
    },
    {
      label: "Subjects Covered",
      value: new Set(materials.map((material) => material.subject)).size,
      change: "Across academic tracks",
      trend: "up",
    },
  ];

  const selectedMaterial = materials.find(
    (material) => material.id === selectedMaterialId,
  );
  const selectedBatch = selectedMaterial
    ? batches.find((batch) => batch.name === selectedMaterial.batch)
    : null;

  function saveMaterial(material) {
    const payload = {
      ...material,
      title: material.title || "Untitled Material",
      materialType: material.materialType || "PDF",
      resourceName:
        material.resourceName || `${material.title || "study-material"}.pdf`,
      uploadedDate:
        material.uploadedDate || new Date().toISOString().slice(0, 10),
      status: material.status || "Draft",
      studentAccessCount:
        material.studentAccessCount ||
        batches.find((batch) => batch.name === material.batch)?.students ||
        0,
    };

    if (editingMaterial) {
      setMaterials((current) =>
        current.map((item) =>
          item.id === editingMaterial.id ? { ...item, ...payload } : item,
        ),
      );
      setEditingMaterial(null);
      return;
    }

    setMaterials((current) => [
      {
        ...payload,
        id: Date.now(),
        studentIds: students
          .filter((student) => student.batch === payload.batch)
          .map((student) => student.id),
      },
      ...current,
    ]);
  }

  function openCreateModal() {
    setEditingMaterial(null);
    setModalOpen(true);
  }

  function updateStatus(materialId, status) {
    setMaterials((current) =>
      current.map((material) =>
        material.id === materialId ? { ...material, status } : material,
      ),
    );
  }

  const inputClass =
    "px-3.5 py-2.5 text-sm border border-neutral-300 rounded-lg outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 bg-white";

  const tableEmptyTitle =
    materials.length === 0
      ? "No study materials yet"
      : "No matching study materials";

  const tableEmptyMessage =
    materials.length === 0
      ? "Create your first study material to build the institute resource library."
      : "Try adjusting your search or filters to find the right learning resource.";

  return (
    <div>
      <PageHeader
        title="Study Materials"
        subtitle="Centralize classroom resources, revision notes, and learning assets for every batch and course."
        actionLabel="+ Add Material"
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
            placeholder="Search study materials..."
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
          value={materialTypeFilter}
          onChange={(event) => setMaterialTypeFilter(event.target.value)}
          className={inputClass}
        >
          <option value="All">All Material Types</option>
          {materialTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>

        <select
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
          className={inputClass}
        >
          <option value="All">All Status</option>
          {materialStatuses.map((status) => (
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
                  Material
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wide">
                  Course
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wide">
                  Batch
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wide">
                  Faculty
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wide">
                  Type
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wide">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wide">
                  Access
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {filteredMaterials.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-0">
                    <EmptyState
                      title={tableEmptyTitle}
                      message={tableEmptyMessage}
                      actionLabel={
                        materials.length === 0 ? "+ Add Material" : undefined
                      }
                      onAction={
                        materials.length === 0 ? openCreateModal : undefined
                      }
                    />
                  </td>
                </tr>
              ) : (
                filteredMaterials.map((material) => (
                  <tr
                    key={material.id}
                    className="hover:bg-neutral-50 transition-colors cursor-pointer"
                    onClick={() => setSelectedMaterialId(material.id)}
                  >
                    <td className="px-4 py-4 align-top">
                      <div>
                        <p className="font-medium text-neutral-800">
                          {material.title}
                        </p>
                        <p className="text-sm text-neutral-500 mt-1">
                          {material.topic}
                        </p>
                        <p className="text-xs text-neutral-400 mt-1">
                          {material.resourceName}
                        </p>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm text-neutral-700">
                      {material.course}
                    </td>
                    <td className="px-4 py-4 text-sm text-neutral-700">
                      {material.batch}
                    </td>
                    <td className="px-4 py-4 text-sm text-neutral-700">
                      {material.faculty}
                    </td>
                    <td className="px-4 py-4 text-sm text-neutral-700">
                      {material.materialType}
                    </td>
                    <td className="px-4 py-4">
                      <StatusBadge status={material.status} />
                    </td>
                    <td className="px-4 py-4 text-sm text-neutral-700">
                      {material.studentAccessCount ?? 0} students
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AddStudyMaterialModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingMaterial(null);
        }}
        material={editingMaterial}
        onSave={(material) => {
          saveMaterial(material);
          setModalOpen(false);
        }}
      />

      <StudyMaterialDetailsDrawer
        material={selectedMaterial}
        batch={selectedBatch}
        onClose={() => setSelectedMaterialId(null)}
        onEdit={(material) => {
          setSelectedMaterialId(null);
          setEditingMaterial(material);
          setModalOpen(true);
        }}
        onStatusChange={(status) => {
          if (selectedMaterial) {
            updateStatus(selectedMaterial.id, status);
          }
        }}
      />
    </div>
  );
}

export default StudyMaterials;
