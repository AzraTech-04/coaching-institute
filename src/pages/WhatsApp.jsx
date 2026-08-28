import { useState } from "react";
import {
  messages as initialMessages,
  createMessage,
} from "../data/communicationData";
import StatusBadge from "../components/StatusBadge";
import PageHeader from "../components/PageHeader";
import EmptyState from "../components/EmptyState";
import StatCard from "../components/StatCard";
import ComposeMessageModal from "../components/ComposeMessageModal";
import MessageDetailsDrawer from "../components/MessageDetailsDrawer";

function WhatsApp() {
  const [messages, setMessages] = useState(
    initialMessages.filter((m) => m.channel === "WhatsApp"),
  );
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [audienceFilter, setAudienceFilter] = useState("All");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);

  const filtered = messages.filter((m) => {
    const matchesSearch = m.title.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "All" || m.status === statusFilter;
    const matchesAudience =
      audienceFilter === "All" || m.audienceType === audienceFilter;
    return matchesSearch && matchesStatus && matchesAudience;
  });

  const stats = [
    {
      label: "Total Messages",
      value: messages.length,
      change: "All time",
      trend: "up",
    },
    {
      label: "Sent",
      value: messages.filter((m) => m.status === "Sent").length,
      change: "Delivered",
      trend: "up",
    },
    {
      label: "Scheduled",
      value: messages.filter((m) => m.status === "Scheduled").length,
      change: "Upcoming",
      trend: "up",
    },
    {
      label: "Drafts",
      value: messages.filter((m) => m.status === "Draft").length,
      change: "Not yet sent",
      trend: "down",
    },
  ];

  function handleCompose(form) {
    setMessages([
      createMessage({ ...form, id: messages.length + 1 }),
      ...messages,
    ]);
  }

  return (
    <div>
      <PageHeader
        title="WhatsApp"
        subtitle="Communicate with students, parents, and faculty over WhatsApp."
        actionLabel="+ Compose Message"
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
            placeholder="Search messages..."
            className="w-full pl-9 pr-3 py-2.5 text-sm border border-neutral-300 rounded-lg outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3.5 py-2.5 text-sm border border-neutral-300 rounded-lg outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 bg-white"
        >
          <option value="All">All Statuses</option>
          <option value="Sent">Sent</option>
          <option value="Scheduled">Scheduled</option>
          <option value="Draft">Draft</option>
        </select>
        <select
          value={audienceFilter}
          onChange={(e) => setAudienceFilter(e.target.value)}
          className="px-3.5 py-2.5 text-sm border border-neutral-300 rounded-lg outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 bg-white"
        >
          <option value="All">All Audiences</option>
          <option value="all-students">All Students</option>
          <option value="batch">Specific Batch</option>
        </select>
      </div>

      <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden shadow-sm">
        {messages.length === 0 ? (
          <EmptyState
            title="No WhatsApp messages yet"
            message="Compose your first WhatsApp message to reach students or parents."
            actionLabel="+ Compose Message"
            onAction={() => setModalOpen(true)}
          />
        ) : filtered.length === 0 ? (
          <EmptyState
            title="No matching messages"
            message="Try adjusting your search or filters."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[620px] text-sm text-left">
              <thead className="bg-neutral-50 text-neutral-500 uppercase text-xs">
                <tr>
                  <th className="px-5 py-3">Title</th>
                  <th className="px-5 py-3">Audience</th>
                  <th className="px-5 py-3">Recipients</th>
                  <th className="px-5 py-3">Date</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {filtered.map((m) => (
                  <tr
                    key={m.id}
                    className="hover:bg-neutral-50 cursor-pointer"
                    onClick={() => setSelectedMessage(m)}
                  >
                    <td className="px-5 py-3 font-medium text-neutral-800">
                      {m.title}
                    </td>
                    <td className="px-5 py-3 text-neutral-600">
                      {m.audience.label}
                    </td>
                    <td className="px-5 py-3 text-neutral-600">
                      {m.audience.count}
                    </td>
                    <td className="px-5 py-3 text-neutral-600">{m.date}</td>
                    <td className="px-5 py-3">
                      <StatusBadge status={m.status} />
                    </td>
                    <td className="px-5 py-3 text-right">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedMessage(m);
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

      <ComposeMessageModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleCompose}
        modalTitle="Compose WhatsApp Message"
        channelOptions={["WhatsApp"]}
      />
      <MessageDetailsDrawer
        message={selectedMessage}
        onClose={() => setSelectedMessage(null)}
      />
    </div>
  );
}

export default WhatsApp;
