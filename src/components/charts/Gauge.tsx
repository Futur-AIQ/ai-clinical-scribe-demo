const CX = 90;
const CY = 86;
const R = 66;

interface GaugeProps {
  value: number;
  max?: number;
  /** Accessible name. Defaults to "{value} of {max}". */
  label?: string;
}

/** Half-circle gauge in SVG, filling left to right, with "value / max" in the center. */
export function Gauge({ value, max = 5, label }: GaugeProps) {
  const a = Math.PI * (1 - Math.min(Math.max(value / max, 0), 1));
  const ex = (CX + R * Math.cos(a)).toFixed(1);
  const ey = (CY - R * Math.sin(a)).toFixed(1);
  const start = `M${CX - R} ${CY} A${R} ${R} 0 0 1`;
  return (
    <svg viewBox="0 0 180 104" width="180" height="104" role="img" aria-label={label ?? `${value} of ${max}`} className="shrink-0">
      <path d={`${start} ${CX + R} ${CY}`} fill="none" stroke="#eef1f6" strokeWidth="13" strokeLinecap="round" />
      <path d={`${start} ${ex} ${ey}`} fill="none" stroke="#1a5cf4" strokeWidth="13" strokeLinecap="round" />
      <text x={CX} y="80" textAnchor="middle" fontSize="28" fontWeight="600" fill="#0e1b3d">
        {value}
        <tspan fontSize="13" fontWeight="400" fill="#68728c">
          {" "}/ {max}
        </tspan>
      </text>
    </svg>
  );
}
