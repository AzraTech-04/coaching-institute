import { useEffect, useState } from "react";
import Modal from "./Modal";
import { courses } from "../data/coursesData";
import { faculty } from "../data/facultyData";
import { students } from "../data/studentsData";
import { doubtPriorities, doubtStatuses } from "../data/doubtsData";

const emptyForm = {
  studentId: "",
  course: "",
  batch: "",
  subject: "",
  topic: "",
  question: "",
  facultyId: "",
  priority: "Medium",
  status: "Open",
  createdDate: new Date().toISOString().slice(0, 10),
  resolution: "",
};

function formFromDoubt(doubt) {
  if (!doubt) return emptyForm;

  return {
    studentId: doubt.studentId ? String(doubt.studentId) : "",
    course: doubt.course || "",
    batch: doubt.batch || "",
    subject: doubt.subject || "",
    topic: doubt.topic || "",
    question: doubt.question || "",
    facultyId: doubt.facultyId ? String(doubt.facultyId) : "",
    priority: doubt.priority || "Medium",
    status: doubt.status || "Open",
    createdDate: doubt.createdDate || new Date().toISOString().slice(0, 10),
    resolution: doubt.resolution || "",
  };
}

function AddDoubtModal({ open, onClose, onSave, doubt = null }) {
  const [form, setForm] = useState(() => formFromDoubt(doubt));

  useEffect(() => {
    setForm(formFromDoubt(doubt));
  }, [doubt, open]);

  const selectedStudent = students.find(
    (student) => student.id === Number(form.studentId),
  );
  const selectedCourse = courses.find((course) => course.name === form.course);
  const relatedFaculty = faculty.filter((member) => member.status === "Active");

  function handleChange(event) {
    const { name, value } = event.target;

    if (name === "studentId") {
      const nextStudent = students.find(
        (student) => student.id === Number(value),
      );

      const nextCourse = nextStudent?.course || "";
      const nextBatch = nextStudent?.batch || "";
      const courseMeta = courses.find((course) => course.name === nextCourse);

      setForm({
        ...form,
        studentId: value,
        course: nextCourse,
        batch: nextBatch,
        subject: courseMeta?.subjects[0] || "",
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
    const student = students.find((item) => item.id === Number(form.studentId));

    onSave({
      ...form,
      studentId: Number(form.studentId),
      student: student?.name || "Unknown Student",
      course: student?.course || form.course,
      batch: student?.batch || form.batch,
      facultyId: Number(form.facultyId),
      faculty: assignedFaculty?.name || "Unassigned",
      resolution: form.resolution || "",
      priority: form.priority || "Medium",
      status: form.status || "Open",
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
      title={doubt ? "Edit Doubt" : "Raise Doubt"}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className={labelClass}>Student</label>
          <select
            name="studentId"
            value={form.studentId}
            onChange={handleChange}
            className={inputClass}
          >
            <option value="">Select student</option>
            {students.map((student) => (
              <option key={student.id} value={student.id}>
                {student.name}
              </option>
            ))}
          </select>
          {selectedStudent && (
            <p className="text-xs text-brand-600 mt-1">
              {selectedStudent.course} · {selectedStudent.batch}
            </p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>Course</label>
            <input
              value={form.course}
              readOnly
              className={`${inputClass} bg-neutral-100 text-neutral-600`}
            />
          </div>
          <div>
            <label className={labelClass}>Batch</label>
            <input
              value={form.batch}
              readOnly
              className={`${inputClass} bg-neutral-100 text-neutral-600`}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
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
          <div>
            <label className={labelClass}>Topic</label>
            <input
              name="topic"
              value={form.topic}
              onChange={handleChange}
              placeholder="e.g. Projectile Motion"
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <label className={labelClass}>Question / doubt</label>
          <textarea
            name="question"
            value={form.question}
            onChange={handleChange}
            rows="4"
            placeholder="Describe the question or confusion you need help with"
            className={inputClass}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>Priority</label>
            <select
              name="priority"
              value={form.priority}
              onChange={handleChange}
              className={inputClass}
            >
              {doubtPriorities.map((priority) => (
                <option key={priority} value={priority}>
                  {priority}
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
              {doubtStatuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className={labelClass}>Assigned faculty</label>
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

        <div>
          <label className={labelClass}>Faculty response / resolution</label>
          <textarea
            name="resolution"
            value={form.resolution}
            onChange={handleChange}
            rows="3"
            placeholder="Add a mock faculty response or resolution"
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>Created date</label>
          <input
            type="date"
            name="createdDate"
            value={form.createdDate}
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
            {doubt ? "Save Changes" : "Raise Doubt"}
          </button>
        </div>
      </form>
    </Modal>
  );
}

export default AddDoubtModal;
