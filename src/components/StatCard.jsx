function StatCard({ label, value, change, trend }) {
  const trendColor = trend === 'up' ? 'text-green-600' : 'text-red-600'
  const trendIcon = trend === 'up' ? '▲' : '▼'

  return (
    <div className="bg-white border border-neutral-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
      <p className="text-sm font-medium text-neutral-500">{label}</p>
      <p className="text-2xl font-bold text-neutral-800 mt-2">{value}</p>
      <p className={`text-xs mt-2 flex items-center gap-1 ${trendColor}`}>
        <span>{trendIcon}</span>
        {change}
      </p>
    </div>
  )
}

export default StatCard