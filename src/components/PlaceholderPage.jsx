import PageHeader from './PageHeader'

function PlaceholderPage({ title, subtitle }) {
  return (
    <div>
      <PageHeader title={title} subtitle={subtitle || 'This module is coming soon.'} />
      <div className="bg-white border border-neutral-200 rounded-xl shadow-sm py-20 px-6 flex flex-col items-center text-center">
        <div className="w-12 h-12 rounded-full bg-brand-50 flex items-center justify-center mb-4">
          <svg className="w-6 h-6 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6l4 2m6-2a10 10 0 11-20 0 10 10 0 0120 0z" />
          </svg>
        </div>
        <h3 className="text-sm font-semibold text-neutral-800">{title} is on the way</h3>
        <p className="text-sm text-neutral-500 mt-1 max-w-sm">
          This part of Aravya is planned for an upcoming build. The navigation is already in place so you can review the full product structure today.
        </p>
      </div>
    </div>
  )
}

export default PlaceholderPage