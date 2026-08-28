import Modal from './Modal'

function IntegrationConfigModal({ open, onClose, integration, onToggleStatus }) {
  if (!integration) return null

  const isConnected = integration.status === 'Connected'

  return (
    <Modal open={open} onClose={onClose} title={`Configure ${integration.name}`}>
      <div className="space-y-4">
        <p className="text-sm text-neutral-600">{integration.description}</p>
        <div className="flex justify-between text-sm border-t border-neutral-100 pt-4">
          <span className="text-neutral-500">Category</span>
          <span className="text-neutral-800 font-medium">{integration.category}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-neutral-500">Status</span>
          <span className="text-neutral-800 font-medium">{integration.status}</span>
        </div>
        {integration.lastSynced && (
          <div className="flex justify-between text-sm">
            <span className="text-neutral-500">Last synced</span>
            <span className="text-neutral-800 font-medium">{integration.lastSynced}</span>
          </div>
        )}
        <p className="text-xs text-neutral-400 border-t border-neutral-100 pt-4">
          This is a prototype. Connecting or disconnecting only updates local demo state — no real {integration.name} account is contacted.
        </p>
        <div className="flex gap-3 pt-2">
          <button type="button" onClick={onClose} className="flex-1 border border-neutral-300 text-neutral-700 text-sm font-medium py-2.5 rounded-lg hover:bg-neutral-50 transition-colors">Close</button>
          <button
            type="button"
            onClick={() => { onToggleStatus(integration.id); onClose() }}
            className={`flex-1 text-sm font-medium py-2.5 rounded-lg transition-colors ${isConnected ? 'bg-red-50 text-red-700 hover:bg-red-100' : 'bg-brand-600 hover:bg-brand-700 text-white'}`}
          >
            {isConnected ? 'Disconnect' : 'Connect'}
          </button>
        </div>
      </div>
    </Modal>
  )
}

export default IntegrationConfigModal