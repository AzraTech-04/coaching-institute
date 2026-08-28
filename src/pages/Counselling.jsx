import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  counsellingRecords as initialRecords,
  counsellorOptions,
  counsellingStatusOptions,
} from "../data/counsellingData";
import { addAdmissionRecord } from "../data/admissionsData";
import { courseOptions } from "../data/leadsData";
import StatusBadge from "../components/StatusBadge";
import PageHeader from "../components/PageHeader";
import EmptyState from "../components/EmptyState";
import StatCard from "../components/StatCard";
import ScheduleCounsellingModal from "../components/ScheduleCounsellingModal";
import CounsellingDetailsDrawer from "../components/CounsellingDetailsDrawer";

const TODAY = "2026-08-20";

function Counselling() {
  const navigate = useNavigate();
  const [records, setRecords] = useState(initialRecords);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [courseFilter, setCourseFilter] = useState("All");
  const [counsellorFilter, setCounsellorFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

  const filteredRecords = records.filter((record) => {
    const matchesSearch = record.name
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesStatus =
      statusFilter === "All" || record.status === statusFilter;
    const matchesCourse =
      courseFilter === "All" || record.course === courseFilter;
    const matchesCounsellor =
      counsellorFilter === "All" || record.counsellor === counsellorFilter;
    const matchesDate = !dateFilter || record.date === dateFilter;
    return (
      matchesSearch &&
      matchesStatus &&
      matchesCourse &&
      matchesCounsellor &&
      matchesDate
    );
  });

  const stats = [
    {
      label: "Scheduled Counselling",
      value: records.filter((r) => r.status === "Scheduled").length,
      change: "Upcoming",
      trend: "up",
    },
    {
      label: "Today's Sessions",
      value: records.filter((r) => r.date === TODAY).length,
      change: "Happening today",
      trend: "up",
    },
    {
      label: "Pending Follow-ups",
      value: records.filter((r) => r.status === "Follow-up Required").length,
      change: "Need attention",
      trend: "down",
    },
    {
      label: "Converted After Counselling",
      value: records.filter((r) => r.status === "Converted").length,
      change: "This period",
      trend: "up",
    },
  ];

  function handleAddRecord(form) {
    const newRecord = {
      id: records.length + 1,
      leadId: form.leadId,
      name: form.name,
      course: form.course,
      counsellor: form.counsellor,
      date: form.date,
      time: form.time,
      status: "Scheduled",
      followUpDate: form.date,
      notes: "",
    };
    setRecords([newRecord, ...records]);
  }

  function handleStatusChange(id, newStatus) {
    setRecords(
      records.map((r) => (r.id === id ? { ...r, status: newStatus } : r)),
    );
    setSelectedRecord((prev) =>
      prev && prev.id === id ? { ...prev, status: newStatus } : prev,
    );
  }

  function handleMoveToAdmission(record) {
    addAdmissionRecord(record);
    setSelectedRecord(null);
    navigate("/admissions");
  }

  return (
    <div>
      <PageHeader
        title="Counselling"
        subtitle="Guide leads toward the right course and batch."
        actionLabel="+ Schedule Counselling"
        onAction={() => setModalOpen(true)}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((stat) => (
          <StatCard
            key={stat.label}
            label={stat.label}
            value={stat.value}
            change={stat.change}
            trend={stat.trend}
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
            placeholder="Search by name..."
            className="w-full pl-9 pr-3 py-2.5 text-sm border border-neutral-300 rounded-lg outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3.5 py-2.5 text-sm border border-neutral-300 rounded-lg outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 bg-white"
        >
          <option value="All">All Statuses</option>
          {counsellingStatusOptions.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <select
          value={courseFilter}
          onChange={(e) => setCourseFilter(e.target.value)}
          className="px-3.5 py-2.5 text-sm border border-neutral-300 rounded-lg outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 bg-white"
        >
          <option value="All">All Courses</option>
          {courseOptions.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <select
          value={counsellorFilter}
          onChange={(e) => setCounsellorFilter(e.target.value)}
          className="px-3.5 py-2.5 text-sm border border-neutral-300 rounded-lg outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 bg-white"
        >
          <option value="All">All Counsellors</option>
          {counsellorOptions.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <input
          type="date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="px-3.5 py-2.5 text-sm border border-neutral-300 rounded-lg outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
        />
      </div>

      <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden shadow-sm">
        {records.length === 0 ? (
          <EmptyState
            title="No counselling sessions yet"
            message="Schedule your first counselling session to get started."
            actionLabel="+ Schedule Counselling"
            onAction={() => setModalOpen(true)}
          />
        ) : filteredRecords.length === 0 ? (
          <EmptyState
            title="No matching records"
            message="Try adjusting your search or filters to find what you're looking for."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] text-sm text-left">
              <thead className="bg-neutral-50 text-neutral-500 uppercase text-xs">
                <tr>
                  <th className="px-5 py-3">Name</th>
                  <th className="px-5 py-3">Course</th>
                  <th className="px-5 py-3">Counsellor</th>
                  <th className="px-5 py-3">Scheduled</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {filteredRecords.map((record) => (
                  <tr
                    key={record.id}
                    className="hover:bg-neutral-50 cursor-pointer"
                    onClick={() => setSelectedRecord(record)}
                  >
                    <td className="px-5 py-3 font-medium text-neutral-800">
                      {record.name}
                    </td>
                    <td className="px-5 py-3 text-neutral-600">
                      {record.course}
                    </td>
                    <td className="px-5 py-3 text-neutral-600">
                      {record.counsellor}
                    </td>
                    <td className="px-5 py-3 text-neutral-600">
                      {record.date} · {record.time}
                    </td>
                    <td className="px-5 py-3">
                      <StatusBadge status={record.status} />
                    </td>
                    <td className="px-5 py-3 text-right">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedRecord(record);
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

      <ScheduleCounsellingModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onAdd={handleAddRecord}
      />
      <CounsellingDetailsDrawer
        record={selectedRecord}
        onClose={() => setSelectedRecord(null)}
        onStatusChange={handleStatusChange}
        onMoveToAdmission={handleMoveToAdmission}
      />
    </div>
  );
}

export default Counselling;
