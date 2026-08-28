function StatusBadge({ status }) {
  const styles = {
    Active: { badge: "bg-green-50 text-green-700", dot: "bg-green-500" },
    Inactive: {
      badge: "bg-neutral-100 text-neutral-600",
      dot: "bg-neutral-400",
    },
    Present: { badge: "bg-green-50 text-green-700", dot: "bg-green-500" },
    Absent: { badge: "bg-red-50 text-red-700", dot: "bg-red-500" },
    Late: { badge: "bg-yellow-50 text-yellow-700", dot: "bg-yellow-500" },
    Leave: { badge: "bg-blue-50 text-blue-700", dot: "bg-blue-500" },
    New: { badge: "bg-blue-50 text-blue-700", dot: "bg-blue-500" },
    Contacted: { badge: "bg-brand-50 text-brand-700", dot: "bg-brand-500" },
    "Follow-up": {
      badge: "bg-yellow-50 text-yellow-700",
      dot: "bg-yellow-500",
    },
    Converted: { badge: "bg-green-50 text-green-700", dot: "bg-green-500" },
    Lost: { badge: "bg-red-50 text-red-700", dot: "bg-red-500" },
    Scheduled: { badge: "bg-blue-50 text-blue-700", dot: "bg-blue-500" },
    Completed: { badge: "bg-green-50 text-green-700", dot: "bg-green-500" },
    "Follow-up Required": {
      badge: "bg-yellow-50 text-yellow-700",
      dot: "bg-yellow-500",
    },
    "Not Interested": { badge: "bg-red-50 text-red-700", dot: "bg-red-500" },
    Pending: { badge: "bg-yellow-50 text-yellow-700", dot: "bg-yellow-500" },
    Confirmed: { badge: "bg-green-50 text-green-700", dot: "bg-green-500" },
    Cancelled: { badge: "bg-red-50 text-red-700", dot: "bg-red-500" },
    Paid: { badge: "bg-green-50 text-green-700", dot: "bg-green-500" },
    "Partially Paid": {
      badge: "bg-yellow-50 text-yellow-700",
      dot: "bg-yellow-500",
    },
    Overdue: { badge: "bg-red-50 text-red-700", dot: "bg-red-500" },
    Upcoming: { badge: "bg-blue-50 text-blue-700", dot: "bg-blue-500" },
    Draft: { badge: "bg-neutral-100 text-neutral-600", dot: "bg-neutral-400" },
    Ongoing: { badge: "bg-yellow-50 text-yellow-700", dot: "bg-yellow-500" },
    Pass: { badge: "bg-green-50 text-green-700", dot: "bg-green-500" },
    Fail: { badge: "bg-red-50 text-red-700", dot: "bg-red-500" },
    Attempted: { badge: "bg-blue-50 text-blue-700", dot: "bg-blue-500" },
    "Not Attempted": {
      badge: "bg-neutral-100 text-neutral-600",
      dot: "bg-neutral-400",
    },
    Published: { badge: "bg-green-50 text-green-700", dot: "bg-green-500" },
    Sent: { badge: 'bg-green-50 text-green-700', dot: 'bg-green-500' },
    Draft: { badge: 'bg-neutral-100 text-neutral-600', dot: 'bg-neutral-400' },
    Published: { badge: 'bg-green-50 text-green-700', dot: 'bg-green-500' },
    Connected: { badge: 'bg-green-50 text-green-700', dot: 'bg-green-500' },
    'Not Connected': { badge: 'bg-neutral-100 text-neutral-600', dot: 'bg-neutral-400' },
    'Configuration Required': { badge: 'bg-yellow-50 text-yellow-700', dot: 'bg-yellow-500' },
  };

  const style = styles[status] || styles.Inactive;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${style.badge}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
      {status}
    </span>
  );
}

export default StatusBadge;
