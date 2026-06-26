export function DonutChart({ slices = [], size = 180, centerLabel = "" }) {
  const normalized = slices.filter((slice) => slice.value > 0);
  const total = normalized.reduce((sum, slice) => sum + slice.value, 0);

  if (!total) {
    return (
      <div className="donut-empty">
        <div className="donut-center">
          <strong>0</strong>
          <span>{centerLabel || "No data"}</span>
        </div>
      </div>
    );
  }

  const radius = 70;
  const strokeWidth = 22;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;

  return (
    <div className="donut-wrap">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="donut-chart" role="img" aria-label="Donut chart">
        <g transform={`translate(${size / 2}, ${size / 2}) rotate(-90)`}>
          <circle r={radius} fill="none" stroke="rgba(148,163,184,0.18)" strokeWidth={strokeWidth} />
          {normalized.map((slice) => {
            const dash = (slice.value / total) * circumference;
            const circle = (
              <circle
                key={slice.label}
                r={radius}
                fill="none"
                stroke={slice.color}
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                strokeDasharray={`${dash} ${circumference - dash}`}
                strokeDashoffset={-offset}
              />
            );
            offset += dash;
            return circle;
          })}
        </g>
      </svg>
      <div className="donut-center">
        <strong>{centerLabel}</strong>
        <span>Total {Math.round(total)}</span>
      </div>
    </div>
  );
}
