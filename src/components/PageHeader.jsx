function PageHeader({ title, subtitle, actionLabel, onAction }) {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <h1 className="text-xl font-bold text-neutral-800 sm:text-2xl">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-neutral-500 sm:text-base">{subtitle}</p>}
      </div>
      {actionLabel && (
        <button
          type="button"
          onClick={onAction}
          className="page-header-actions self-start rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-brand-700"
        >
          {actionLabel}
        </button>
      )}
    </div>
  )
}

export default PageHeader