import { useMemo, useState } from "react";
import PageHeader from "../components/PageHeader";
import StatCard from "../components/StatCard";
import StatusBadge from "../components/StatusBadge";
import EmptyState from "../components/EmptyState";
import AddBranchModal from "../components/AddBranchModal";
import BranchDetailsDrawer from "../components/BranchDetailsDrawer";
import {
  branches as initialBranches,
  branchStatusOptions,
} from "../data/branchesData";
import { batches } from "../data/batchesData";
import { students } from "../data/studentsData";

const inputClass =
  "px-3.5 py-2.5 text-sm border border-neutral-300 rounded-lg outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 bg-white";

function Branches() {
  const [branchRecords, setBranchRecords] = useState(initialBranches);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [cityFilter, setCityFilter] = useState("All");
  const [selectedBranchId, setSelectedBranchId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const enrichBranch = (branch) => {
    const relatedBatches = batches.filter((batch) =>
      branch.batchIds?.includes(batch.id),
    );
    const batchNames = new Set(relatedBatches.map((batch) => batch.name));
    const relatedStudents = students.filter((student) =>
      batchNames.has(student.batch),
    );
    const capacity = Number(branch.capacity) || 0;
    return {
      ...branch,
      relatedBatches,
      relatedStudents,
      studentCount: relatedStudents.length,
      occupancy: capacity ? (relatedStudents.length / capacity) * 100 : 0,
    };
  };

  const enrichedBranches = useMemo(
    () => branchRecords.map(enrichBranch),
    [branchRecords],
  );
  const cities = [
    ...new Set(branchRecords.map((branch) => branch.city)),
  ].sort();
  const filteredBranches = enrichedBranches.filter((branch) => {
    const query = search.toLowerCase().trim();
    return (
      (!query ||
        `${branch.name} ${branch.code} ${branch.city}`
          .toLowerCase()
          .includes(query)) &&
      (statusFilter === "All" || branch.status === statusFilter) &&
      (cityFilter === "All" || branch.city === cityFilter)
    );
  });
  const uniqueStudentIds = new Set(
    enrichedBranches.flatMap((branch) =>
      branch.relatedStudents.map((student) => student.id),
    ),
  );
  const totalCapacity = enrichedBranches.reduce(
    (sum, branch) => sum + (Number(branch.capacity) || 0),
    0,
  );
  const totalStudents = uniqueStudentIds.size;
  const overallOccupancy = totalCapacity
    ? (totalStudents / totalCapacity) * 100
    : 0;
  const selectedBranch = branchRecords.find(
    (branch) => branch.id === selectedBranchId,
  );

  function clearFilters() {
    setSearch("");
    setStatusFilter("All");
    setCityFilter("All");
  }

  function addBranch(branch) {
    const normalizedCode = branch.code.trim().toLowerCase();
    if (
      branchRecords.some(
        (record) => record.code.toLowerCase() === normalizedCode,
      )
    )
      return "A branch with this code already exists.";
    setBranchRecords((current) => [
      ...current,
      {
        ...branch,
        id: `BR${String(current.length + 1).padStart(3, "0")}`,
        code: branch.code.trim(),
        name: branch.name.trim(),
        city: branch.city.trim(),
        address: branch.address.trim(),
        contact: branch.contact.trim(),
        email: branch.email?.trim() || "",
        manager: branch.manager?.trim() || "",
        batchIds: [],
      },
    ]);
    return "";
  }

  const stats = [
    {
      label: "Total Branches",
      value: enrichedBranches.length,
      change: "Locations configured",
      trend: "up",
    },
    {
      label: "Active Branches",
      value: enrichedBranches.filter((branch) => branch.status === "Active")
        .length,
      change: "Currently operational",
      trend: "up",
    },
    {
      label: "Total Students",
      value: totalStudents,
      change: "Unique enrolled students",
      trend: "up",
    },
    {
      label: "Overall Occupancy",
      value: `${totalStudents} / ${totalCapacity}`,
      change: `${Math.round(overallOccupancy)}% occupied`,
      trend: overallOccupancy >= 70 ? "up" : "down",
    },
  ];

  return (
    <div>
      <PageHeader
        title="Branches"
        subtitle="Manage institute locations, capacity, academics, and branch operations."
        actionLabel="+ Add Branch"
        onAction={() => setModalOpen(true)}
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>
      <div className="flex flex-col sm:flex-row flex-wrap gap-3 mb-4">
        <div className="relative flex-1 min-w-[220px]">
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
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search branches..."
            aria-label="Search branches"
            className={`w-full pl-9 ${inputClass}`}
          />
        </div>
        <select
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
          aria-label="Filter by status"
          className={inputClass}
        >
          <option value="All">All Statuses</option>
          {branchStatusOptions.map((status) => (
            <option key={status}>{status}</option>
          ))}
        </select>
        <select
          value={cityFilter}
          onChange={(event) => setCityFilter(event.target.value)}
          aria-label="Filter by city"
          className={inputClass}
        >
          <option value="All">All Cities</option>
          {cities.map((city) => (
            <option key={city}>{city}</option>
          ))}
        </select>
      </div>
      {!branchRecords.length ? (
        <div className="bg-white border border-neutral-200 rounded-xl shadow-sm">
          <EmptyState
            title="No branches yet"
            message="Add your first branch to start organizing institute locations."
            actionLabel="Add Branch"
            onAction={() => setModalOpen(true)}
          />
        </div>
      ) : !filteredBranches.length ? (
        <div className="bg-white border border-neutral-200 rounded-xl shadow-sm">
          <EmptyState
            title="No matching branches"
            message="No branches match your current filters."
            actionLabel="Clear Filters"
            onAction={clearFilters}
          />
        </div>
      ) : (
        <div className="bg-white border border-neutral-200 rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[780px] text-sm text-left">
              <thead className="bg-neutral-50 text-neutral-500 uppercase text-xs">
                <tr>
                  <th className="px-5 py-3">Branch</th>
                  <th className="px-5 py-3">Code</th>
                  <th className="px-5 py-3">City</th>
                  <th className="px-5 py-3">Students</th>
                  <th className="px-5 py-3">Capacity</th>
                  <th className="px-5 py-3">Occupancy</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {filteredBranches.map((branch) => (
                  <tr
                    key={branch.id}
                    onClick={() => setSelectedBranchId(branch.id)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        setSelectedBranchId(branch.id);
                      }
                    }}
                    tabIndex={0}
                    role="button"
                    aria-label={`View details for ${branch.name}`}
                    className="cursor-pointer hover:bg-neutral-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2"
                  >
                    <td className="px-5 py-4">
                      <p className="font-medium text-neutral-800">
                        {branch.name}
                      </p>
                      <p className="text-xs text-neutral-500 mt-1">
                        {branch.address}
                      </p>
                    </td>
                    <td className="px-5 py-4 text-neutral-600">
                      {branch.code}
                    </td>
                    <td className="px-5 py-4 text-neutral-600">
                      {branch.city}
                    </td>
                    <td className="px-5 py-4 text-neutral-600">
                      {branch.studentCount}
                    </td>
                    <td className="px-5 py-4 text-neutral-600">
                      {branch.capacity}
                    </td>
                    <td className="px-5 py-4 text-neutral-600">
                      {Math.round(branch.occupancy)}%
                    </td>
                    <td className="px-5 py-4">
                      <StatusBadge status={branch.status} />
                    </td>
                    <td className="px-5 py-4">
                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          setSelectedBranchId(branch.id);
                        }}
                        className="text-sm font-medium text-brand-600 hover:text-brand-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 rounded"
                      >
                        View details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      <AddBranchModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onAdd={addBranch}
      />
      <BranchDetailsDrawer
        branch={selectedBranch}
        onClose={() => setSelectedBranchId(null)}
      />
    </div>
  );
}

export default Branches;
