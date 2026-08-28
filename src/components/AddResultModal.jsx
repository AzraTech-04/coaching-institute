import { useState } from "react";
import Modal from "./Modal";
import { tests } from "../data/testsData";
import { batches } from "../data/batchesData";
import { students } from "../data/studentsData";

const completedTests = tests.filter((test) => test.status === "Completed");
const resultStatuses = ["Pass", "Fail", "Pending"];

function initialForm(result) {
  const test = result
    ? completedTests.find((item) => item.id === result.testId)
    : completedTests[0];
  const testStudents = students.filter((student) => student.batch === test?.batch);
  return {
    testId: result?.testId ?? test?.id ?? "",
    studentId: result?.studentId ?? testStudents[0]?.id ?? "",
    marksObtained: result?.marksObtained ?? "",
    totalMarks: result?.totalMarks ?? test?.totalMarks ?? "",
    status: result?.status ?? "Pass",
  };
}

function AddResultModal({ open, onClose, onSave, result = null }) {
  const [form, setForm] = useState(() => initialForm(result));
  const selectedTest = completedTests.find((test) => test.id === Number(form.testId));
  const relatedStudents = students.filter((student) => student.batch === selectedTest?.batch);
  const selectedStudent = relatedStudents.find((student) => student.id === Number(form.studentId));
  const percentage = form.marksObtained && form.totalMarks
    ? Math.round((Number(form.marksObtained) / Number(form.totalMarks)) * 100)
    : 0;
  const inputClass = "w-full px-3.5 py-2.5 text-sm border border-neutral-300 rounded-lg outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 bg-white";
  const labelClass = "block text-sm font-medium text-neutral-700 mb-1.5";

  function handleChange(event) {
    const { name, value } = event.target;
    if (name === "testId") {
      const test = completedTests.find((item) => item.id === Number(value));
      const firstStudent = students.find((student) => student.batch === test?.batch);
      setForm((current) => ({
        ...current,
        testId: value,
        studentId: firstStudent?.id || "",
        totalMarks: test?.totalMarks || "",
      }));
      return;
    }
    setForm((current) => ({ ...current, [name]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    onSave({
      testId: Number(form.testId),
      studentId: Number(form.studentId),
      marksObtained: Number(form.marksObtained),
      totalMarks: Number(form.totalMarks),
      status: form.status,
    });
    onClose();
  }

  return (
    <Modal open={open} onClose={onClose} title={result ? "Edit Result" : "Enter Result"}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className={labelClass}>Completed test</label>
          <select name="testId" value={form.testId} onChange={handleChange} className={inputClass}>
            {completedTests.map((test) => <option key={test.id} value={test.id}>{test.name}</option>)}
          </select>
        </div>
        <div>
          <label className={labelClass}>Student</label>
          <select name="studentId" required value={form.studentId} onChange={handleChange} className={inputClass}>
            {relatedStudents.map((student) => <option key={student.id} value={student.id}>{student.name}</option>)}
          </select>
          {selectedStudent && <p className="text-xs text-brand-600 mt-1">{selectedStudent.batch} · {selectedTest?.course}</p>}
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div><label className={labelClass}>Marks obtained</label><input name="marksObtained" type="number" min="0" max={form.totalMarks} required value={form.marksObtained} onChange={handleChange} className={inputClass} /></div>
          <div><label className={labelClass}>Total marks</label><input name="totalMarks" type="number" min="1" required value={form.totalMarks} onChange={handleChange} className={inputClass} /></div>
        </div>
        <div className="bg-neutral-50 rounded-lg px-3 py-2 text-sm text-neutral-600">Calculated percentage: <strong className="text-neutral-800">{percentage}%</strong></div>
        <div><label className={labelClass}>Result status</label><select name="status" value={form.status} onChange={handleChange} className={inputClass}>{resultStatuses.map((status) => <option key={status}>{status}</option>)}</select></div>
        <div className="flex gap-3 pt-2"><button type="button" onClick={onClose} className="flex-1 border border-neutral-300 text-neutral-700 text-sm font-medium py-2.5 rounded-lg hover:bg-neutral-50">Cancel</button><button type="submit" className="flex-1 bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium py-2.5 rounded-lg">{result ? "Save Changes" : "Save Result"}</button></div>
      </form>
    </Modal>
  );
}

export default AddResultModal;
