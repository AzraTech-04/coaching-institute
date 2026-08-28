function EmptyState({ title, message, actionLabel, onAction }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <div className="w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center mb-4">
        <svg className="w-6 h-6 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
        </svg>
      </div>
      <h3 className="text-sm font-semibold text-neutral-800">{title}</h3>
      <p className="text-sm text-neutral-500 mt-1 max-w-xs">{message}</p>
      {actionLabel && (
        <button
          type="button"
          onClick={onAction}
          className="mt-4 bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
        >
          {actionLabel}
        </button>
      )}
    </div>
  )
}

export default EmptyState