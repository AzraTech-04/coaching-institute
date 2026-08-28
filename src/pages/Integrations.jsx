import { useState } from "react";
import { integrations as initialIntegrations } from "../data/integrationsData";
import PageHeader from "../components/PageHeader";
import StatCard from "../components/StatCard";
import StatusBadge from "../components/StatusBadge";
import IntegrationConfigModal from "../components/IntegrationConfigModal";

function Integrations() {
  const [integrations, setIntegrations] = useState(initialIntegrations);
  const [selectedId, setSelectedId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const stats = [
    {
      label: "Total Integrations",
      value: integrations.length,
      change: "Available",
      trend: "up",
    },
    {
      label: "Connected",
      value: integrations.filter((i) => i.status === "Connected").length,
      change: "Active",
      trend: "up",
    },
    {
      label: "Not Connected",
      value: integrations.filter((i) => i.status === "Not Connected").length,
      change: "Available to set up",
      trend: "down",
    },
    {
      label: "Needs Configuration",
      value: integrations.filter((i) => i.status === "Configuration Required")
        .length,
      change: "Action needed",
      trend: "down",
    },
  ];

  function handleToggleStatus(id) {
    setIntegrations(
      integrations.map((i) => {
        if (i.id !== id) return i;
        const nowConnected = i.status !== "Connected";
        return {
          ...i,
          status: nowConnected ? "Connected" : "Not Connected",
          lastSynced: nowConnected
            ? new Date().toISOString().slice(0, 10)
            : null,
        };
      }),
    );
  }

  const selectedIntegration = selectedId
    ? integrations.find((i) => i.id === selectedId)
    : null;

  return (
    <div>
      <PageHeader
        title="Integrations"
        subtitle="Connect Aravya to external services used by your institute."
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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {integrations.map((integration) => (
          <div
            key={integration.id}
            className="bg-white border border-neutral-200 rounded-xl p-5 shadow-sm"
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-base font-semibold text-neutral-800">
                  {integration.name}
                </h3>
                <p className="text-xs text-neutral-400 mt-0.5">
                  {integration.category}
                </p>
              </div>
              <StatusBadge status={integration.status} />
            </div>
            <p className="text-sm text-neutral-500 mt-3">
              {integration.description}
            </p>
            {integration.lastSynced && (
              <p className="text-xs text-neutral-400 mt-2">
                Last synced {integration.lastSynced}
              </p>
            )}
            <div className="mt-4 pt-4 border-t border-neutral-100 flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setSelectedId(integration.id);
                  setModalOpen(true);
                }}
                className="flex-1 border border-neutral-300 text-neutral-700 text-sm font-medium py-2 rounded-lg hover:bg-neutral-50 transition-colors"
              >
                Configure
              </button>
              <button
                type="button"
                onClick={() => handleToggleStatus(integration.id)}
                className={`flex-1 text-sm font-medium py-2 rounded-lg transition-colors ${integration.status === "Connected" ? "bg-red-50 text-red-700 hover:bg-red-100" : "bg-brand-600 hover:bg-brand-700 text-white"}`}
              >
                {integration.status === "Connected" ? "Disconnect" : "Connect"}
              </button>
            </div>
          </div>
        ))}
      </div>

      <IntegrationConfigModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        integration={selectedIntegration}
        onToggleStatus={handleToggleStatus}
      />
    </div>
  );
}

export default Integrations;
