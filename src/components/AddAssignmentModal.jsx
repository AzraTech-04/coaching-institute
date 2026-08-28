import { useState } from "react";
import Modal from "./Modal";
import { courses } from "../data/coursesData";
import { batches } from "../data/batchesData";
import { faculty } from "../data/facultyData";
import { assignmentStatuses } from "../data/assignmentsData";

const emptyForm = {
  title: "",
  course: courses[0]?.name || "",
  batch: "",
  subject: "",
  facultyId: "",
  assignedDate: "",
  dueDate: "",
  totalMarks: "",
  instructions: "",
  status: "Active",
};

function formFromAssignment(assignment) {
  if (!assignment) return emptyForm;

  return {
    title: assignment.title || "",
    course: assignment.course || courses[0]?.name || "",
    batch: assignment.batch || "",
    subject: assignment.subject || "",
    facultyId: assignment.facultyId ? String(assignment.facultyId) : "",
    assignedDate: assignment.assignedDate || "",
    dueDate: assignment.dueDate || "",
    totalMarks: assignment.totalMarks ? String(assignment.totalMarks) : "",
    instructions: assignment.instructions || "",
    status: assignment.status || "Active",
  };
}

function AddAssignmentModal({ open, onClose, onSave, assignment = null }) {
  const [form, setForm] = useState(() => formFromAssignment(assignment));
  const selectedCourse = courses.find((course) => course.name === form.course);
  const relatedBatches = batches.filter(
    (batch) => batch.course === form.course,
  );
  const selectedBatch = relatedBatches.find(
    (batch) => batch.name === form.batch,
  );
  const relatedFaculty = faculty.filter((member) => member.status === "Active");

  function handleChange(event) {
    const { name, value } = event.target;

    if (name === "course") {
      const nextCourse = courses.find((course) => course.name === value);
      const nextBatch =
        relatedBatches.find((batch) => batch.course === value)?.name || "";
      setForm({
        ...form,
        course: value,
        batch: nextBatch,
        subject: nextCourse?.subjects[0] || "",
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
      totalMarks: Number(form.totalMarks),
      status: form.status || "Active",
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
      title={assignment ? "Edit Assignment" : "Create Assignment"}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className={labelClass}>Assignment title</label>
          <input
            name="title"
            required
            value={form.title}
            onChange={handleChange}
            placeholder="e.g. Physics Numerical Practice"
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
              <option value="">Select batch</option>
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
              {relatedFaculty.map((member) => (
                <option key={member.id} value={member.id}>
                  {member.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>Assigned date</label>
            <input
              type="date"
              name="assignedDate"
              required
              value={form.assignedDate}
              onChange={handleChange}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Due date</label>
            <input
              type="date"
              name="dueDate"
              required
              value={form.dueDate}
              onChange={handleChange}
              className={inputClass}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>Total marks</label>
            <input
              type="number"
              name="totalMarks"
              required
              min="1"
              value={form.totalMarks}
              onChange={handleChange}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Status</label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className={inputClass}
            >
              {assignmentStatuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className={labelClass}>Instructions</label>
          <textarea
            name="instructions"
            value={form.instructions}
            onChange={handleChange}
            rows="3"
            className={inputClass}
            placeholder="Assignment expectations and submission instructions"
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
            {assignment ? "Save Changes" : "Create Assignment"}
          </button>
        </div>
      </form>
    </Modal>
  );
}

export default AddAssignmentModal;
