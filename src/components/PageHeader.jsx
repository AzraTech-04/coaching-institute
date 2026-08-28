function PageHeader({ title, subtitle, actionLabel, onAction }) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-800">{title}</h1>
        {subtitle && <p className="text-neutral-500 mt-1">{subtitle}</p>}
      </div>
      {actionLabel && (
        <button
          type="button"
          onClick={onAction}
          className="bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors shadow-sm"
        >
          {actionLabel}
        </button>
      )}
    </div>
  )
}

export default PageHeader