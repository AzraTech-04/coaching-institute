import { useState } from "react";
import Modal from "./Modal";
import { courses } from "../data/coursesData";
import { faculty } from "../data/facultyData";
import {
  difficultyLevels,
  questionStatuses,
  questionTypes,
} from "../data/questionBankData";

const makeForm = (question) => ({
  text: question?.text || "",
  type: question?.type || questionTypes[0],
  course: question?.course || courses[0]?.name || "",
  subject: question?.subject || courses[0]?.subjects[0] || "",
  topic: question?.topic || "",
  createdBy: question?.createdBy || faculty[0]?.name || "",
  createdDate: question?.createdDate || "2026-08-22",
  difficulty: question?.difficulty || "Medium",
  marks: question?.marks || "",
  negativeMarks: question?.negativeMarks ?? 0,
  options: question?.options?.length ? [...question.options] : ["", "", "", ""],
  correctAnswer: question?.correctAnswer?.length
    ? [...question.correctAnswer]
    : [],
  explanation: question?.explanation || "",
  tags: question?.tags?.join(", ") || "",
  status: question?.status || "Active",
});

function AddQuestionModal({ open, onClose, onSave, question = null }) {
  const [form, setForm] = useState(() => makeForm(question));
  const selectedCourse = courses.find((course) => course.name === form.course);
  const needsOptions = form.type !== "Numerical";
  const isMulti = form.type === "Multiple Select";

  function updateField(event) {
    const { name, value } = event.target;
    if (name === "course") {
      const course = courses.find((item) => item.name === value);
      setForm((current) => ({
        ...current,
        course: value,
        subject: course?.subjects[0] || "",
      }));
      return;
    }
    setForm((current) => ({ ...current, [name]: value }));
  }

  function updateOption(index, value) {
    setForm((current) => ({
      ...current,
      options: current.options.map((option, optionIndex) =>
        optionIndex === index ? value : option,
      ),
    }));
  }

  function toggleAnswer(option) {
    setForm((current) => ({
      ...current,
      correctAnswer: isMulti
        ? current.correctAnswer.includes(option)
          ? current.correctAnswer.filter((answer) => answer !== option)
          : [...current.correctAnswer, option]
        : [option],
    }));
  }

  function handleTypeChange(event) {
    const type = event.target.value;
    setForm((current) => ({
      ...current,
      type,
      options:
        type === "Numerical"
          ? []
          : type === "True / False"
            ? ["True", "False"]
            : current.options.length >= 2
              ? current.options
              : ["", "", "", ""],
      correctAnswer: type === "True / False" ? ["True"] : [],
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    const options = needsOptions
      ? form.options.map((option) => option.trim()).filter(Boolean)
      : [];
    onSave({
      ...form,
      options,
      correctAnswer:
        form.type === "Numerical"
          ? [form.correctAnswer[0] || ""]
          : form.correctAnswer,
      marks: Number(form.marks),
      negativeMarks: Number(form.negativeMarks),
      tags: form.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
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
      title={question ? "Edit Question" : "Add Question"}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className={labelClass}>Question text</label>
          <textarea
            name="text"
            required
            rows="3"
            value={form.text}
            onChange={updateField}
            className={inputClass}
            placeholder="Enter the question students will see"
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>Question type</label>
            <select
              name="type"
              value={form.type}
              onChange={handleTypeChange}
              className={inputClass}
            >
              {questionTypes.map((type) => (
                <option key={type}>{type}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass}>Course</label>
            <select
              name="course"
              value={form.course}
              onChange={updateField}
              className={inputClass}
            >
              {courses.map((course) => (
                <option key={course.id}>{course.name}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>Created by</label>
            <select
              name="createdBy"
              required
              value={form.createdBy}
              onChange={updateField}
              className={inputClass}
            >
              {faculty.map((member) => (
                <option key={member.id}>{member.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass}>Created date</label>
            <input
              type="date"
              name="createdDate"
              required
              value={form.createdDate}
              onChange={updateField}
              className={inputClass}
            />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>Subject</label>
            <select
              name="subject"
              required
              value={form.subject}
              onChange={updateField}
              className={inputClass}
            >
              {selectedCourse?.subjects.map((subject) => (
                <option key={subject}>{subject}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass}>Topic</label>
            <input
              name="topic"
              required
              value={form.topic}
              onChange={updateField}
              className={inputClass}
              placeholder="e.g. Electrostatics"
            />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className={labelClass}>Difficulty</label>
            <select
              name="difficulty"
              value={form.difficulty}
              onChange={updateField}
              className={inputClass}
            >
              {difficultyLevels.map((level) => (
                <option key={level}>{level}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass}>Marks</label>
            <input
              name="marks"
              type="number"
              min="1"
              required
              value={form.marks}
              onChange={updateField}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Negative marks</label>
            <input
              name="negativeMarks"
              type="number"
              min="0"
              step="0.25"
              value={form.negativeMarks}
              onChange={updateField}
              className={inputClass}
            />
          </div>
        </div>
        {needsOptions ? (
          <div>
            <label className={labelClass}>
              {isMulti
                ? "Options and correct answers"
                : "Options and correct answer"}
            </label>
            <div className="space-y-2">
              {form.options.map((option, index) => (
                <div className="flex items-center gap-2" key={index}>
                  <input
                    value={option}
                    onChange={(event) =>
                      updateOption(index, event.target.value)
                    }
                    required={index < 2}
                    className={inputClass}
                    placeholder={`Option ${index + 1}`}
                  />
                  <input
                    type={isMulti ? "checkbox" : "radio"}
                    name="correctAnswer"
                    checked={
                      form.correctAnswer.includes(option) && Boolean(option)
                    }
                    onChange={() => toggleAnswer(option)}
                    className="h-4 w-4 accent-brand-600"
                    aria-label={`Mark option ${index + 1} correct`}
                  />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div>
            <label className={labelClass}>Correct numerical answer</label>
            <input
              type="number"
              required
              name="correctAnswer"
              value={form.correctAnswer[0] || ""}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  correctAnswer: [event.target.value],
                }))
              }
              className={inputClass}
            />
          </div>
        )}
        <div>
          <label className={labelClass}>Explanation</label>
          <textarea
            name="explanation"
            rows="2"
            value={form.explanation}
            onChange={updateField}
            className={inputClass}
            placeholder="Explain the solution briefly"
          />
        </div>
        <div>
          <label className={labelClass}>Tags</label>
          <input
            name="tags"
            value={form.tags}
            onChange={updateField}
            className={inputClass}
            placeholder="mechanics, revision"
          />
        </div>
        <div>
          <label className={labelClass}>Status</label>
          <select
            name="status"
            value={form.status}
            onChange={updateField}
            className={inputClass}
          >
            {questionStatuses.map((status) => (
              <option key={status}>{status}</option>
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
            {question ? "Save Changes" : "Add Question"}
          </button>
        </div>
      </form>
    </Modal>
  );
}

export default AddQuestionModal;
