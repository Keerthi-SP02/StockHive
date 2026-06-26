export function Sparkline({ data = [], stroke = "#1d4ed8", fill = "rgba(29,78,216,0.12)" }) {
  if (!data.length) return <div className="spark-empty">No chart data</div>;

  const width = 420;
  const height = 120;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const step = data.length > 1 ? width / (data.length - 1) : width;
  const points = data
    .map((value, index) => {
      const x = index * step;
      const y = height - ((value - min) / range) * (height - 16) - 8;
      return `${x},${y}`;
    })
    .join(" ");

  const area = `0,${height} ${points} ${width},${height}`;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="sparkline" role="img" aria-label="Chart">
      <defs>
        <linearGradient id="spark-fill" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={fill.replace("0.12", "0.24")} />
          <stop offset="100%" stopColor={fill} />
        </linearGradient>
      </defs>
      <polygon points={area} fill="url(#spark-fill)" />
      <polyline points={points} fill="none" stroke={stroke} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
