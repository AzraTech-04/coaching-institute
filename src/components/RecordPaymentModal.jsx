import { useState } from "react";
import Modal from "./Modal";
import { paymentMethodOptions } from "../data/feesData";

function RecordPaymentModal({ open, onClose, onSubmit, students, feeRecords }) {
  const [studentId, setStudentId] = useState("");
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState(paymentMethodOptions[0]);
  const [date, setDate] = useState("");
  const [error, setError] = useState("");

  const selectedFee = studentId
    ? feeRecords.find((f) => f.studentId === Number(studentId))
    : null;
  const paidSoFar = selectedFee
    ? selectedFee.paymentHistory.reduce((sum, p) => sum + p.amount, 0)
    : 0;
  const remaining = selectedFee ? selectedFee.totalFee - paidSoFar : 0;

  function resetForm() {
    setStudentId("");
    setAmount("");
    setMethod(paymentMethodOptions[0]);
    setDate("");
    setError("");
  }

  function handleClose() {
    resetForm();
    onClose();
  }

  function handleSubmit(e) {
    e.preventDefault();
    const numericAmount = Number(amount);

    if (!selectedFee) {
      setError("Please select a student.");
      return;
    }
    if (numericAmount <= 0) {
      setError("Payment amount must be greater than zero.");
      return;
    }
    if (numericAmount > remaining) {
      setError(
        `Payment cannot exceed the remaining balance of ₹${remaining.toLocaleString("en-IN")}.`,
      );
      return;
    }

    onSubmit({
      studentId: Number(studentId),
      amount: numericAmount,
      method,
      date,
    });
    resetForm();
    onClose();
  }

  return (
    <Modal open={open} onClose={handleClose} title="Record Payment">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1.5">
            Student
          </label>
          <select
            value={studentId}
            onChange={(e) => {
              setStudentId(e.target.value);
              setError("");
            }}
            required
            className="w-full px-3.5 py-2.5 text-sm border border-neutral-300 rounded-lg outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 bg-white"
          >
            <option value="" disabled>
              Choose a student...
            </option>
            {students.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} — {s.batch}
              </option>
            ))}
          </select>
        </div>

        {selectedFee && (
          <div className="bg-neutral-50 border border-neutral-200 rounded-lg px-3.5 py-2.5 text-sm text-neutral-600">
            Remaining balance:{" "}
            <span className="font-medium text-neutral-800">
              ₹{remaining.toLocaleString("en-IN")}
            </span>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1.5">
            Payment amount (₹)
          </label>
          <input
            type="number"
            required
            min="1"
            value={amount}
            onChange={(e) => {
              setAmount(e.target.value);
              setError("");
            }}
            placeholder="e.g. 20000"
            className="w-full px-3.5 py-2.5 text-sm border border-neutral-300 rounded-lg outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1.5">
            Payment method
          </label>
          <select
            value={method}
            onChange={(e) => setMethod(e.target.value)}
            className="w-full px-3.5 py-2.5 text-sm border border-neutral-300 rounded-lg outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 bg-white"
          >
            {paymentMethodOptions.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1.5">
            Payment date
          </label>
          <input
            type="date"
            required
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-3.5 py-2.5 text-sm border border-neutral-300 rounded-lg outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
          />
        </div>

        {error && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3.5 py-2.5">
            {error}
          </p>
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
            className="flex-1 bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium py-2.5 rounded-lg transition-colors"
          >
            Record Payment
          </button>
        </div>
      </form>
    </Modal>
  );
}

export default RecordPaymentModal;
