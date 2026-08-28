import { useState } from "react";
import Modal from "./Modal";
import { courses } from "../data/coursesData";
import { batches } from "../data/batchesData";
import { faculty } from "../data/facultyData";
import { testTypes } from "../data/testsData";

const emptyForm = {
  name: "",
  type: testTypes[0],
  course: courses[0]?.name || "",
  batch: "",
  subject: "",
  description: "",
  date: "",
  startTime: "",
  duration: "",
  totalMarks: "",
  passingMarks: "",
  instructions: "",
  facultyId: "",
};

function formFromTest(test) {
  return test
    ? {
        name: test.name,
        type: test.type,
        course: test.course,
        batch: test.batch,
        subject: test.subject,
        description: test.description || "",
        date: test.date,
        startTime: test.startTime,
        duration: test.duration,
        totalMarks: test.totalMarks,
        passingMarks: test.passingMarks,
        instructions: test.instructions || "",
        facultyId: test.facultyId || "",
      }
    : emptyForm;
}

function AddTestModal({ open, onClose, onSave, test = null }) {
  const [form, setForm] = useState(() => formFromTest(test));
  const [formError, setFormError] = useState("");
  const relatedBatches = batches.filter(
    (batch) => batch.course === form.course,
  );
  const selectedBatch = relatedBatches.find(
    (batch) => batch.name === form.batch,
  );
  const selectedCourse = courses.find((course) => course.name === form.course);
  const relatedFaculty = faculty.filter((member) => member.status === "Active");

  function handleChange(event) {
    const { name, value } = event.target;
    setFormError("");
    if (name === "course") {
      const nextCourse = courses.find((course) => course.name === value);
      setForm({
        ...form,
        course: value,
        batch: batches.find((batch) => batch.course === value)?.name || "",
        subject: nextCourse?.subjects[0] || "",
      });
      return;
    }
    setForm({ ...form, [name]: value });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const duration = Number(form.duration);
    const totalMarks = Number(form.totalMarks);
    const passingMarks = Number(form.passingMarks);

    if (
      !form.name.trim() ||
      !form.course ||
      !form.batch ||
      !form.subject ||
      !form.date ||
      !form.startTime ||
      !form.facultyId
    ) {
      setFormError("Complete all required fields before creating the test.");
      return;
    }
    if (duration <= 0 || totalMarks <= 0 || passingMarks <= 0) {
      setFormError(
        "Duration, total marks, and passing marks must be positive.",
      );
      return;
    }
    if (passingMarks > totalMarks) {
      setFormError("Passing marks cannot exceed total marks.");
      return;
    }
    const assignedFaculty = faculty.find(
      (member) => member.id === Number(form.facultyId),
    );

    try {
      await onSave({
        ...form,
        facultyId: Number(form.facultyId),
        faculty: assignedFaculty?.name || "Unassigned",
        duration,
        totalMarks,
        passingMarks,
      });
      onClose();
    } catch (error) {
      console.error("Failed to save test:", error);
      setFormError("The test could not be saved. Please try again.");
    }
  }

  const inputClass =
    "w-full px-3.5 py-2.5 text-sm border border-neutral-300 rounded-lg outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 bg-white";
  const labelClass = "block text-sm font-medium text-neutral-700 mb-1.5";

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={test ? "Edit Test" : "Create Test"}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {formError && (
          <p
            role="alert"
            className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2"
          >
            {formError}
          </p>
        )}
        <div>
          <label className={labelClass}>Test name</label>
          <input
            name="name"
            required
            value={form.name}
            onChange={handleChange}
            placeholder="e.g. JEE Advanced Full Test 02"
            className={inputClass}
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>Test type</label>
            <select
              name="type"
              value={form.type}
              onChange={handleChange}
              className={inputClass}
            >
              {testTypes.map((type) => (
                <option key={type}>{type}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass}>Subject</label>
            <select
              name="subject"
              required
              value={form.subject}
              onChange={handleChange}
              className={inputClass}
            >
              {selectedCourse?.subjects.map((subject) => (
                <option key={subject}>{subject}</option>
              ))}
            </select>
          </div>
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
                <option key={course.id}>{course.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass}>Batch</label>
            <select
              name="batch"
              required
              value={form.batch}
              onChange={handleChange}
              className={inputClass}
            >
              <option value="">Select batch</option>
              {relatedBatches.map((batch) => (
                <option key={batch.id}>{batch.name}</option>
              ))}
            </select>
            {selectedBatch && (
              <p className="text-xs text-brand-600 mt-1">
                {selectedBatch.students} students enrolled
              </p>
            )}
          </div>
        </div>
        <div>
          <label className={labelClass}>Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows="2"
            className={inputClass}
            placeholder="What this test covers"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>Test date</label>
            <input
              type="date"
              name="date"
              required
              value={form.date}
              onChange={handleChange}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Start time</label>
            <input
              type="time"
              name="startTime"
              required
              value={form.startTime}
              onChange={handleChange}
              className={inputClass}
            />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className={labelClass}>Duration (min)</label>
            <input
              type="number"
              name="duration"
              required
              min="1"
              value={form.duration}
              onChange={handleChange}
              className={inputClass}
            />
          </div>
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
            <label className={labelClass}>Passing marks</label>
            <input
              type="number"
              name="passingMarks"
              required
              min="0"
              value={form.passingMarks}
              onChange={handleChange}
              className={inputClass}
            />
          </div>
        </div>
        <div>
          <label className={labelClass}>Instructions</label>
          <textarea
            name="instructions"
            value={form.instructions}
            onChange={handleChange}
            rows="2"
            className={inputClass}
            placeholder="Instructions for students"
          />
        </div>
        <div>
          <label className={labelClass}>Faculty / Examiner</label>
          <select
            name="facultyId"
            required
            value={form.facultyId}
            onChange={handleChange}
            className={inputClass}
          >
            <option value="">Select faculty</option>
            {relatedFaculty.map((member) => (
              <option key={member.id} value={member.id}>
                {member.name} — {member.subject}
              </option>
            ))}
          </select>
        </div>
        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 border border-neutral-300 text-neutral-700 text-sm font-medium py-2.5 rounded-lg hover:bg-neutral-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium py-2.5 rounded-lg"
          >
            {test ? "Save Changes" : "Create Test"}
          </button>
        </div>
      </form>
    </Modal>
  );
}

export default AddTestModal;
