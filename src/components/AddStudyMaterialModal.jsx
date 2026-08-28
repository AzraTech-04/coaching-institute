import { useEffect, useState } from "react";
import Modal from "./Modal";
import { courses } from "../data/coursesData";
import { batches } from "../data/batchesData";
import { faculty } from "../data/facultyData";
import { materialStatuses, materialTypes } from "../data/studyMaterialsData";

const emptyForm = {
  title: "",
  course: courses[0]?.name || "",
  batch: "",
  subject: "",
  facultyId: "",
  topic: "",
  materialType: "PDF",
  resourceName: "",
  uploadedDate: new Date().toISOString().slice(0, 10),
  status: "Draft",
};

function formFromMaterial(material) {
  if (!material) return emptyForm;

  return {
    title: material.title || "",
    course: material.course || courses[0]?.name || "",
    batch: material.batch || "",
    subject: material.subject || "",
    facultyId: material.facultyId ? String(material.facultyId) : "",
    topic: material.topic || "",
    materialType: material.materialType || "PDF",
    resourceName: material.resourceName || "",
    uploadedDate:
      material.uploadedDate || new Date().toISOString().slice(0, 10),
    status: material.status || "Draft",
  };
}

function AddStudyMaterialModal({ open, onClose, onSave, material = null }) {
  const [form, setForm] = useState(() => formFromMaterial(material));

  useEffect(() => {
    setForm(formFromMaterial(material));
  }, [material, open]);

  const selectedCourse = courses.find((course) => course.name === form.course);
  const relatedBatches = batches.filter(
    (batch) => batch.course === form.course,
  );
  const selectedBatch = relatedBatches.find(
    (batch) => batch.name === form.batch,
  );
  const availableFaculty = faculty.filter(
    (member) => member.status === "Active",
  );

  function handleChange(event) {
    const { name, value, files } = event.target;

    if (name === "course") {
      const nextCourse = courses.find((course) => course.name === value);
      const nextBatch = relatedBatches[0]?.name || "";
      setForm({
        ...form,
        course: value,
        batch: nextBatch,
        subject: nextCourse?.subjects[0] || "",
      });
      return;
    }

    if (name === "resourceFile" && files && files[0]) {
      setForm({
        ...form,
        resourceName: files[0].name,
      });
      return;
    }

    setForm({ ...form, [name]: value });
  }

  function handleSubmit(event) {
    event.preventDefault();
    const assignedFaculty = faculty.find(
      (member) => member.id === Number(form.facultyId),
    );

    onSave({
      ...form,
      facultyId: Number(form.facultyId),
      faculty: assignedFaculty?.name || "Unassigned",
      resourceName: form.resourceName || `${form.title || "material"}.pdf`,
      status: form.status || "Draft",
      studentAccessCount: selectedBatch ? selectedBatch.students : 0,
    });
    onClose();
  }

  const inputClass =
    "w-full px-3.5 py-2.5 text-sm border border-neutral-300 rounded-lg outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 bg-white";
  const labelClass = "block text-sm font-medium text-neutral-700 mb-1.5";

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={material ? "Edit Study Material" : "Add Study Material"}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className={labelClass}>Material title</label>
          <input
            name="title"
            required
            value={form.title}
            onChange={handleChange}
            placeholder="e.g. JEE Advanced Physics — Mechanics Notes"
            className={inputClass}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>Course</label>
            <select
              name="course"
              value={form.course}
              onChange={handleChange}
              className={inputClass}
            >
              {courses.map((course) => (
                <option key={course.id} value={course.name}>
                  {course.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass}>Subject</label>
            <select
              name="subject"
              value={form.subject}
              onChange={handleChange}
              className={inputClass}
            >
              {(selectedCourse?.subjects || []).map((subject) => (
                <option key={subject} value={subject}>
                  {subject}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>Batch</label>
            <select
              name="batch"
              value={form.batch}
              onChange={handleChange}
              className={inputClass}
            >
              <option value="">Select Batch</option>
              {relatedBatches.map((batch) => (
                <option key={batch.id} value={batch.name}>
                  {batch.name}
                </option>
              ))}
            </select>
            {selectedBatch && (
              <p className="text-xs text-brand-600 mt-1">
                {selectedBatch.students} students enrolled
              </p>
            )}
          </div>
          <div>
            <label className={labelClass}>Faculty</label>
            <select
              name="facultyId"
              value={form.facultyId}
              onChange={handleChange}
              className={inputClass}
            >
              <option value="">Select faculty</option>
              {availableFaculty.map((member) => (
                <option key={member.id} value={member.id}>
                  {member.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className={labelClass}>Topic</label>
          <input
            name="topic"
            value={form.topic}
            onChange={handleChange}
            placeholder="e.g. Mechanics, Organic Chemistry, Algebra"
            className={inputClass}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>Material type</label>
            <select
              name="materialType"
              value={form.materialType}
              onChange={handleChange}
              className={inputClass}
            >
              {materialTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass}>Status</label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className={inputClass}
            >
              {materialStatuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className={labelClass}>Resource / file name</label>
          <input
            name="resourceName"
            value={form.resourceName}
            onChange={handleChange}
            placeholder="e.g. mechanics-notes.pdf"
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>Mock upload</label>
          <input
            type="file"
            name="resourceFile"
            onChange={handleChange}
            className="block w-full text-sm text-neutral-600 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-brand-50 file:text-brand-700 hover:file:bg-brand-100"
          />
        </div>

        <div>
          <label className={labelClass}>Uploaded date</label>
          <input
            type="date"
            name="uploadedDate"
            value={form.uploadedDate}
            onChange={handleChange}
            className={inputClass}
          />
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-lg border border-neutral-300 text-neutral-700 text-sm font-medium hover:bg-neutral-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2.5 rounded-lg bg-brand-600 text-white text-sm font-medium hover:bg-brand-700"
          >
            {material ? "Save Changes" : "Create Material"}
          </button>
        </div>
      </form>
    </Modal>
  );
}

export default AddStudyMaterialModal;
