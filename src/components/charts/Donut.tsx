const R = 52;
const C = 2 * Math.PI * R;
/** Gap between segments, in px along the ring. */
const GAP = 2;

interface DonutProps {
  /** [label, percent, color]. Percents add up to 100; the first part is named in the center. */
  parts: [string, number, string][];
  size?: number;
  /** Accessible name. */
  label?: string;
}

/** Ring chart in SVG, starting at 12 o'clock and running clockwise. */
export function Donut({ parts, size = 140, label = "Donut chart" }: DonutProps) {
  const [first] = parts;
  const lens = parts.map(([, value]) => (C * value) / 100);
  // Each segment starts where the previous ones end.
  const starts = lens.map((_, i) => lens.slice(0, i).reduce((a, b) => a + b, 0));
  return (
    <svg viewBox="0 0 140 140" width={size} height={size} role="img" aria-label={label} className="shrink-0">
      {parts.map(([name, value, color], i) => (
        <circle
          key={name}
          cx="70"
          cy="70"
          r={R}
          fill="none"
          stroke={color}
          strokeWidth="16"
          strokeDasharray={`${(lens[i] - GAP).toFixed(1)} ${(C - lens[i] + GAP).toFixed(1)}`}
          strokeDashoffset={(-starts[i]).toFixed(1)}
          transform="rotate(-90 70 70)"
        >
          <title>{`${name}: ${value}%`}</title>
        </circle>
      ))}
      {first && (
        <>
          <text x="70" y="68" textAnchor="middle" fontSize="20" fontWeight="600" fill="#0e1b3d">
            {first[1]}%
          </text>
          <text x="70" y="86" textAnchor="middle" fontSize="10.5" fill="#68728c">
            {first[0]}
          </text>
        </>
      )}
    </svg>
  );
}
