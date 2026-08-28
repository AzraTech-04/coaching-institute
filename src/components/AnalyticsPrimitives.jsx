export function AnalyticsSection({
  title,
  subtitle,
  children,
  className = "",
}) {
  return (
    <section
      className={`bg-white border border-neutral-200 rounded-xl shadow-sm ${className}`}
    >
      <div className="px-5 pt-5">
        <h2 className="text-base font-semibold text-neutral-800">{title}</h2>
        {subtitle && (
          <p className="text-xs text-neutral-500 mt-1">{subtitle}</p>
        )}
      </div>
      {children}
    </section>
  );
}

export function AnalyticsFilters({ filters, setFilter, options, onClear }) {
  const selectClass =
    "px-3.5 py-2.5 text-sm border border-neutral-300 rounded-lg outline-none focus:ring-2 focus:ring-brand-500 bg-white";
  return (
    <div className="bg-white border border-neutral-200 rounded-xl shadow-sm p-4 mb-6">
      <div className="flex items-center justify-between gap-3 mb-3">
        <p className="text-sm font-semibold text-neutral-800">
          Analytics filters
        </p>
        <button
          type="button"
          onClick={onClear}
          className="text-sm font-medium text-brand-600 hover:text-brand-700"
        >
          Clear filters
        </button>
      </div>
      <div className="flex flex-col sm:flex-row flex-wrap gap-3">
        {options.map((option) => (
          <select
            key={option.name}
            aria-label={option.label}
            value={filters[option.name]}
            onChange={(event) => setFilter(option.name, event.target.value)}
            className={selectClass}
          >
            {option.values.map((value) => (
              <option key={value} value={value}>
                {value === "All" ? `All ${option.label}` : value}
              </option>
            ))}
          </select>
        ))}
      </div>
    </div>
  );
}

export function BarList({
  items,
  valueLabel = (item) => `${item.value}%`,
  color = "bg-brand-600",
}) {
  const max = Math.max(...items.map((item) => item.value), 1);
  return (
    <div className="px-5 pb-5 pt-4 space-y-4">
      {items.length ? (
        items.map((item) => (
          <div key={item.label}>
            <div className="flex justify-between gap-3 text-xs mb-1.5">
              <span className="text-neutral-600 truncate">{item.label}</span>
              <span className="font-semibold text-neutral-800 whitespace-nowrap">
                {valueLabel(item)}
              </span>
            </div>
            <div
              className="h-2 bg-neutral-100 rounded-full overflow-hidden"
              title={`${item.label}: ${valueLabel(item)}`}
            >
              <div
                className={`h-full rounded-full ${color}`}
                style={{ width: `${(item.value / max) * 100}%` }}
              />
            </div>
          </div>
        ))
      ) : (
        <p className="text-sm text-neutral-500">No records match this view.</p>
      )}
    </div>
  );
}

export function Donut({ segments, center }) {
  const total = segments.reduce((sum, segment) => sum + segment.value, 0) || 1;
  const gradient = segments
    .reduce(
      (result, segment) => {
        const end = result.cursor + (segment.value / total) * 100;
        return {
          cursor: end,
          stops: [
            ...result.stops,
            `${segment.color} ${result.cursor}% ${end}%`,
          ],
        };
      },
      { cursor: 0, stops: [] },
    )
    .stops.join(", ");
  return (
    <div className="flex items-center gap-5 px-5 pb-5 pt-4">
      <div
        className="w-28 h-28 rounded-full shrink-0 flex items-center justify-center"
        style={{ background: `conic-gradient(${gradient})` }}
      >
        <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center text-lg font-bold text-neutral-800">
          {center}
        </div>
      </div>
      <div className="space-y-2 text-xs min-w-0">
        {segments.map((segment) => (
          <div key={segment.label} className="flex items-center gap-2">
            <span
              className="w-2.5 h-2.5 rounded-full shrink-0"
              style={{ backgroundColor: segment.color }}
            />
            <span className="text-neutral-600 truncate">{segment.label}</span>
            <span className="font-semibold text-neutral-800">
              {segment.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function LineChart({
  points,
  lines,
  emptyMessage = "Not enough dated activity to show a trend.",
}) {
  const width = 640;
  const height = 210;
  const max = Math.max(
    ...points.flatMap((point) => lines.map((line) => point[line.key])),
    100,
  );
  const pointString = (key) =>
    points
      .map(
        (point, index) =>
          `${30 + (index * (width - 60)) / Math.max(points.length - 1, 1)},${height - 32 - (point[key] / max) * (height - 62)}`,
      )
      .join(" ");
  return (
    <div className="px-5 pb-5 pt-4 overflow-x-auto">
      <div className="flex gap-4 flex-wrap text-xs text-neutral-500 mb-3">
        {lines.map((line) => (
          <span key={line.key} className="inline-flex items-center gap-1.5">
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: line.color }}
            />
            {line.label}
          </span>
        ))}
      </div>
      {points.length > 1 ? (
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full min-w-[460px] h-52"
          role="img"
          aria-label={lines.map((line) => line.label).join(" and ")}
        >
          {[25, 50, 75, 100].map((tick) => {
            const y = height - 32 - (tick / max) * (height - 62);
            return (
              <g key={tick}>
                <line
                  x1="30"
                  x2={width - 30}
                  y1={y}
                  y2={y}
                  stroke="#e7e5e4"
                  strokeDasharray="3 4"
                />
                <text x="0" y={y + 4} fontSize="11" fill="#a8a29e">
                  {tick}
                </text>
              </g>
            );
          })}
          {lines.map((line) => (
            <polyline
              key={line.key}
              points={pointString(line.key)}
              fill="none"
              stroke={line.color}
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ))}
          {points.map((point, index) => {
            const x =
              30 + (index * (width - 60)) / Math.max(points.length - 1, 1);
            return (
              <g key={point.label}>
                {lines.map((line) => (
                  <circle
                    key={line.key}
                    cx={x}
                    cy={height - 32 - (point[line.key] / max) * (height - 62)}
                    r="4"
                    fill={line.color}
                  >
                    <title>{`${line.label}: ${point[line.key]} on ${point.label}`}</title>
                  </circle>
                ))}
                <text
                  x={x}
                  y={height - 8}
                  textAnchor="middle"
                  fontSize="11"
                  fill="#78716c"
                >
                  {point.label}
                </text>
              </g>
            );
          })}
        </svg>
      ) : (
        <p className="text-sm text-neutral-500 py-12 text-center">
          {emptyMessage}
        </p>
      )}
    </div>
  );
}
