import { useState } from "react";
import { feeRecords as initialFeeRecords } from "../data/feesData";
import { students } from "../data/studentsData";
import StatusBadge from "../components/StatusBadge";
import PageHeader from "../components/PageHeader";
import EmptyState from "../components/EmptyState";
import StatCard from "../components/StatCard";
import RecordPaymentModal from "../components/RecordPaymentModal";
import StudentFeeDetailsDrawer from "../components/StudentFeeDetailsDrawer";

const TODAY = "2026-08-22";

function deriveStatus(paidAmount, totalFee, dueDate) {
  if (paidAmount >= totalFee) return "Paid";
  if (paidAmount > 0 && new Date(dueDate) < new Date(TODAY)) return "Overdue";
  if (paidAmount === 0 && new Date(dueDate) < new Date(TODAY)) return "Overdue";
  if (paidAmount > 0) return "Partially Paid";
  return "Pending";
}

function enrichFeeRecord(fee) {
  const student = students.find((s) => s.id === fee.studentId);
  const paidAmount = fee.paymentHistory.reduce((sum, p) => sum + p.amount, 0);
  const remaining = fee.totalFee - paidAmount;
  const percentage =
    fee.totalFee > 0 ? Math.round((paidAmount / fee.totalFee) * 100) : 0;
  const status = deriveStatus(paidAmount, fee.totalFee, fee.dueDate);
  return { ...fee, student, paidAmount, remaining, percentage, status };
}

function FeesPayments() {
  const [feeRecords, setFeeRecords] = useState(initialFeeRecords);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [batchFilter, setBatchFilter] = useState("All");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedRecordId, setSelectedRecordId] = useState(null);

  const enrichedRecords = feeRecords
    .map(enrichFeeRecord)
    .filter((r) => r.student);

  const filteredRecords = enrichedRecords.filter((r) => {
    const matchesSearch = r.student.name
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesStatus = statusFilter === "All" || r.status === statusFilter;
    const matchesBatch =
      batchFilter === "All" || r.student.batch === batchFilter;
    return matchesSearch && matchesStatus && matchesBatch;
  });

  const totalCollected = enrichedRecords.reduce(
    (sum, r) => sum + r.paidAmount,
    0,
  );
  const totalOutstanding = enrichedRecords.reduce(
    (sum, r) => sum + r.remaining,
    0,
  );
  const pendingCount = enrichedRecords.filter(
    (r) => r.status === "Pending",
  ).length;
  const overdueCount = enrichedRecords.filter(
    (r) => r.status === "Overdue",
  ).length;

  const stats = [
    {
      label: "Total Collected",
      value: `₹${totalCollected.toLocaleString("en-IN")}`,
      change: "All time",
      trend: "up",
    },
    {
      label: "Total Outstanding",
      value: `₹${totalOutstanding.toLocaleString("en-IN")}`,
      change: "Across all students",
      trend: "down",
    },
    {
      label: "Pending Payments",
      value: pendingCount,
      change: "No payment yet",
      trend: "down",
    },
    {
      label: "Overdue Payments",
      value: overdueCount,
      change: "Past due date",
      trend: "down",
    },
  ];

  function handleRecordPayment({ studentId, amount, method, date }) {
    setFeeRecords(
      feeRecords.map((fee) => {
        if (fee.studentId !== studentId) return fee;
        const newPaymentId = fee.paymentHistory.length + 1;
        return {
          ...fee,
          paymentHistory: [
            ...fee.paymentHistory,
            { id: newPaymentId, date, amount, method },
          ],
        };
      }),
    );
  }

  const batchOptions = [...new Set(students.map((s) => s.batch))];

  const selectedRecord = selectedRecordId
    ? enrichedRecords.find((r) => r.id === selectedRecordId)
    : null;

  return (
    <div>
      <PageHeader
        title="Fees & Payments"
        subtitle="Track fee collection and outstanding dues across students."
        actionLabel="+ Record Payment"
        onAction={() => setModalOpen(true)}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((s) => (
          <StatCard
            key={s.label}
            label={s.label}
            value={s.value}
            change={s.change}
            trend={s.trend}
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
            placeholder="Search students..."
            className="w-full pl-9 pr-3 py-2.5 text-sm border border-neutral-300 rounded-lg outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3.5 py-2.5 text-sm border border-neutral-300 rounded-lg outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 bg-white"
        >
          <option value="All">All Statuses</option>
          <option value="Paid">Paid</option>
          <option value="Partially Paid">Partially Paid</option>
          <option value="Pending">Pending</option>
          <option value="Overdue">Overdue</option>
        </select>
        <select
          value={batchFilter}
          onChange={(e) => setBatchFilter(e.target.value)}
          className="px-3.5 py-2.5 text-sm border border-neutral-300 rounded-lg outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 bg-white"
        >
          <option value="All">All Batches</option>
          {batchOptions.map((b) => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
        </select>
      </div>

      <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden shadow-sm">
        {enrichedRecords.length === 0 ? (
          <EmptyState
            title="No fee records yet"
            message="Fee records will appear here once students are enrolled."
          />
        ) : filteredRecords.length === 0 ? (
          <EmptyState
            title="No matching fee records"
            message="Try adjusting your search or filters."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[620px] text-sm text-left">
              <thead className="bg-neutral-50 text-neutral-500 uppercase text-xs">
                <tr>
                  <th className="px-5 py-3">Student</th>
                  <th className="px-5 py-3">Batch</th>
                  <th className="px-5 py-3">Total Fee</th>
                  <th className="px-5 py-3">Paid</th>
                  <th className="px-5 py-3">Remaining</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {filteredRecords.map((r) => (
                  <tr
                    key={r.id}
                    className="hover:bg-neutral-50 cursor-pointer"
                    onClick={() => setSelectedRecordId(r.id)}
                  >
                    <td className="px-5 py-3 font-medium text-neutral-800">
                      {r.student.name}
                    </td>
                    <td className="px-5 py-3 text-neutral-600">
                      {r.student.batch}
                    </td>
                    <td className="px-5 py-3 text-neutral-600">
                      ₹{r.totalFee.toLocaleString("en-IN")}
                    </td>
                    <td className="px-5 py-3 text-neutral-600">
                      ₹{r.paidAmount.toLocaleString("en-IN")}
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className={
                          r.remaining > 0
                            ? "text-red-600 font-medium"
                            : "text-green-600 font-medium"
                        }
                      >
                        ₹{r.remaining.toLocaleString("en-IN")}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <StatusBadge status={r.status} />
                    </td>
                    <td className="px-5 py-3 text-right">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedRecordId(r.id);
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
          </div>
        )}
      </div>

      <RecordPaymentModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleRecordPayment}
        students={students}
        feeRecords={feeRecords}
      />
      <StudentFeeDetailsDrawer
        record={selectedRecord}
        onClose={() => setSelectedRecordId(null)}
      />
    </div>
  );
}

export default FeesPayments;
