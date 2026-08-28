import { useState } from "react";
import {
  leads as initialLeads,
  courseOptions,
  sourceOptions,
} from "../data/leadsData";
import StatusBadge from "../components/StatusBadge";
import PageHeader from "../components/PageHeader";
import EmptyState from "../components/EmptyState";
import StatCard from "../components/StatCard";
import AddLeadModal from "../components/AddLeadModal";
import LeadDetailsDrawer from "../components/LeadDetailsDrawer";
import { addCounsellingRecord } from "../data/counsellingData";

function Leads() {
  const [leads, setLeads] = useState(initialLeads);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [courseFilter, setCourseFilter] = useState("All");
  const [sourceFilter, setSourceFilter] = useState("All");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);

  const filteredLeads = leads.filter((lead) => {
    const matchesSearch = lead.name
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesStatus =
      statusFilter === "All" || lead.status === statusFilter;
    const matchesCourse =
      courseFilter === "All" || lead.course === courseFilter;
    const matchesSource =
      sourceFilter === "All" || lead.source === sourceFilter;
    return matchesSearch && matchesStatus && matchesCourse && matchesSource;
  });

  const stats = [
    {
      label: "Total Leads",
      value: leads.length,
      change: "All time",
      trend: "up",
    },
    {
      label: "New Leads",
      value: leads.filter((l) => l.status === "New").length,
      change: "Awaiting contact",
      trend: "up",
    },
    {
      label: "Follow-ups",
      value: leads.filter((l) => l.status === "Follow-up").length,
      change: "Need attention",
      trend: "down",
    },
    {
      label: "Converted",
      value: leads.filter((l) => l.status === "Converted").length,
      change: "This period",
      trend: "up",
    },
  ];

  function handleAddLead(form) {
    const newLead = {
      id: leads.length + 1,
      name: form.name,
      contact: form.contact,
      course: form.course,
      source: form.source,
      status: "New",
      followUpDate: new Date().toISOString().slice(0, 10),
      notes: form.notes,
    };
    setLeads([newLead, ...leads]);
  }

  function handleStatusChange(id, newStatus) {
    setLeads(
      leads.map((lead) =>
        lead.id === id ? { ...lead, status: newStatus } : lead,
      ),
    );
    setSelectedLead((prev) =>
      prev && prev.id === id ? { ...prev, status: newStatus } : prev,
    );
  }

  function handleMoveToCounselling(lead) {
    addCounsellingRecord(lead);
    handleStatusChange(lead.id, "Counselling");
    setSelectedLead(null);
  }

  return (
    <div>
      <PageHeader
        title="Leads"
        subtitle="Manage leads and admissions here."
        actionLabel="+ Add Lead"
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

      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
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
            placeholder="Search leads by name..."
            className="w-full pl-9 pr-3 py-2.5 text-sm border border-neutral-300 rounded-lg outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3.5 py-2.5 text-sm border border-neutral-300 rounded-lg outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 bg-white"
        >
          <option value="All">All Statuses</option>
          <option value="New">New</option>
          <option value="Contacted">Contacted</option>
          <option value="Follow-up">Follow-up</option>
          <option value="Converted">Converted</option>
          <option value="Lost">Lost</option>
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
          value={sourceFilter}
          onChange={(e) => setSourceFilter(e.target.value)}
          className="px-3.5 py-2.5 text-sm border border-neutral-300 rounded-lg outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 bg-white"
        >
          <option value="All">All Sources</option>
          {sourceOptions.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden shadow-sm">
        {leads.length === 0 ? (
          <EmptyState
            title="No leads yet"
            message="Add your first lead to start tracking admissions."
            actionLabel="+ Add Lead"
            onAction={() => setModalOpen(true)}
          />
        ) : filteredLeads.length === 0 ? (
          <EmptyState
            title="No matching leads"
            message="Try adjusting your search or filters to find what you're looking for."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] text-sm text-left">
              <thead className="bg-neutral-50 text-neutral-500 uppercase text-xs">
                <tr>
                  <th className="px-5 py-3">Name</th>
                  <th className="px-5 py-3">Course</th>
                  <th className="px-5 py-3">Source</th>
                  <th className="px-5 py-3">Follow-up</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {filteredLeads.map((lead) => (
                  <tr
                    key={lead.id}
                    className="hover:bg-neutral-50 cursor-pointer"
                    onClick={() => setSelectedLead(lead)}
                  >
                    <td className="px-5 py-3 font-medium text-neutral-800">
                      {lead.name}
                    </td>
                    <td className="px-5 py-3 text-neutral-600">{lead.course}</td>
                    <td className="px-5 py-3 text-neutral-600">{lead.source}</td>
                    <td className="px-5 py-3 text-neutral-600">
                      {lead.followUpDate}
                    </td>
                    <td className="px-5 py-3">
                      <StatusBadge status={lead.status} />
                    </td>
                    <td className="px-5 py-3 text-right">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedLead(lead);
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

      <AddLeadModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onAdd={handleAddLead}
      />
      <LeadDetailsDrawer
        lead={selectedLead}
        onClose={() => setSelectedLead(null)}
        onStatusChange={handleStatusChange}
        onMoveToCounselling={handleMoveToCounselling}
      />
    </div>
  );
}

export default Leads;
