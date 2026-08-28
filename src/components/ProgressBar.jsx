function ProgressBar({ percentage }) {
  const color = percentage >= 75 ? 'bg-green-500' : percentage >= 50 ? 'bg-yellow-500' : 'bg-red-500'
  const textColor = percentage >= 75 ? 'text-green-700' : percentage >= 50 ? 'text-yellow-700' : 'text-red-700'

  return (
    <div className="flex items-center gap-2 w-32">
      <div className="flex-1 h-2 bg-neutral-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${percentage}%` }}></div>
      </div>
      <span className={`text-xs font-medium w-8 ${textColor}`}>{percentage}%</span>
    </div>
  )
}

export default ProgressBar