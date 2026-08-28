export function average(values) {
  return values.length
    ? values.reduce((sum, value) => sum + value, 0) / values.length
    : 0;
}

export function percent(value) {
  return `${Math.round(value)}%`;
}

export function statusScore(status) {
  return status === "Present" ? 100 : status === "Late" ? 75 : 0;
}

export function periodMatch(date, period, today = "2026-08-22") {
  if (!date || period === "All Time") return true;
  const days = { "Last 7 Days": 7, "Last 30 Days": 30, "Last 90 Days": 90 }[
    period
  ];
  const start = new Date(`${today}T00:00:00`);
  start.setDate(start.getDate() - days + 1);
  return new Date(`${date}T23:59:59`) >= start && date <= today;
}

export const periodOptions = [
  "Last 7 Days",
  "Last 30 Days",
  "Last 90 Days",
  "All Time",
];
