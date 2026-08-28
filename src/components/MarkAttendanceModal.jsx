import { useState } from "react";
import Modal from "./Modal";
import { batches } from "../data/batchesData";
import {
  sessionOptions,
  attendanceStatusOptions,
} from "../data/attendanceData";

function MarkAttendanceModal({ open, onClose, onSubmit }) {
  const [batchId, setBatchId] = useState("");
  const [date, setDate] = useState("");
  const [session, setSession] = useState(sessionOptions[0]);
  const [statuses, setStatuses] = useState({});

  const selectedBatch = batchId
    ? batches.find((b) => b.id === Number(batchId))
    : null;
  const batchStudents = selectedBatch ? selectedBatch.studentList : [];

  function handleBatchChange(e) {
    const id = e.target.value;
    setBatchId(id);
    const batch = batches.find((b) => b.id === Number(id));
    const initialStatuses = {};
    if (batch) {
      batch.studentList.forEach((s) => {
        initialStatuses[s.id] = "Present";
      });
    }
    setStatuses(initialStatuses);
  }

  function setStudentStatus(studentId, status) {
    setStatuses((prev) => ({ ...prev, [studentId]: status }));
  }

  function resetForm() {
    setBatchId("");
    setDate("");
    setSession(sessionOptions[0]);
    setStatuses({});
  }

  function handleSubmit(e) {
    e.preventDefault();
    onSubmit({ batchId: Number(batchId), date, session, statuses });
    resetForm();
    onClose();
  }

  function handleClose() {
    resetForm();
    onClose();
  }

  return (
    <Modal open={open} onClose={handleClose} title="Mark Attendance">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1.5">
            Batch
          </label>
          <select
            value={batchId}
            onChange={handleBatchChange}
            required
            className="w-full px-3.5 py-2.5 text-sm border border-neutral-300 rounded-lg outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 bg-white"
          >
            <option value="" disabled>
              Choose a batch...
            </option>
            {batches.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1.5">
              Date
            </label>
            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm border border-neutral-300 rounded-lg outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1.5">
              Session
            </label>
            <select
              value={session}
              onChange={(e) => setSession(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm border border-neutral-300 rounded-lg outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 bg-white"
            >
              {sessionOptions.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>

        {batchId && (
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1.5">
              Students
            </label>
            {batchStudents.length === 0 ? (
              <p className="text-sm text-neutral-500 border border-neutral-200 rounded-lg px-3.5 py-2.5 bg-neutral-50">
                No students in this batch yet.
              </p>
            ) : (
              <div className="max-h-56 overflow-y-auto border border-neutral-200 rounded-lg divide-y divide-neutral-100">
                {batchStudents.map((s) => (
                  <div
                    key={s.id}
                    className="flex items-center justify-between px-3 py-2.5 gap-2"
                  >
                    <span className="text-sm text-neutral-700">{s.name}</span>
                    <div className="flex gap-1 flex-wrap justify-end">
                      {attendanceStatusOptions.map((option) => (
                        <button
                          key={option}
                          type="button"
                          onClick={() => setStudentStatus(s.id, option)}
                          className={`px-2 py-1 rounded text-xs font-medium border transition-colors ${
                            statuses[s.id] === option
                              ? "bg-brand-50 border-brand-300 text-brand-700"
                              : "border-neutral-300 text-neutral-500 hover:bg-neutral-50"
                          }`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={handleClose}
            className="flex-1 border border-neutral-300 text-neutral-700 text-sm font-medium py-2.5 rounded-lg hover:bg-neutral-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={batchStudents.length === 0}
            className={`flex-1 text-sm font-medium py-2.5 rounded-lg transition-colors ${
              batchStudents.length === 0
                ? "bg-neutral-100 text-neutral-400 cursor-not-allowed"
                : "bg-brand-600 hover:bg-brand-700 text-white"
            }`}
          >
            Save Attendance
          </button>
        </div>
      </form>
    </Modal>
  );
}

export default MarkAttendanceModal;
