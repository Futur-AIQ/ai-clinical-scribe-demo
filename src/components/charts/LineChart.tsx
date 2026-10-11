"use client";

import { useEffect, useId, useRef, useState } from "react";

interface LineChartProps {
  values: number[];
  labels: string[];
  width?: number;
  height?: number;
  /** Y-axis maximum. Defaults to a "nice" value above the largest point. */
  max?: number;
  /**
   * Show at most every n-th x label. The step widens when labels would be closer than MIN_LABEL_GAP,
   * the last label is always shown, and a regular label too close to it is dropped.
   */
  labelEvery?: number;
  /** Accessible name. */
  label?: string;
}

const NICE = [4, 8, 12, 16, 20, 30, 40, 60, 80, 100, 120, 150, 200, 300, 400, 600, 800, 1000];
export const niceMax = (v: number) => NICE.find((x) => x >= v * 1.08) ?? Math.ceil(v);

const PL = 30;
const PR = 14;
const PT = 10;
const PB = 26;
const BLUE = "#1a5cf4";
const MUTED = "#68728c";
/** Minimum distance between x-label centers, in px at the 10px label size. */
const MIN_LABEL_GAP = 44;

/**
 * Area + line chart in SVG. Wider than `width`, it scales up with its container; narrower, it draws at
 * the container's real width so the text stays readable.
 */
export function LineChart({ values, labels, width = 560, height = 150, max, labelEvery = 1, label = "Line chart" }: LineChartProps) {
  const gid = `lc${useId().replace(/[^a-zA-Z0-9]/g, "")}`;
  const ref = useRef<SVGSVGElement>(null);
  const [boxWidth, setBoxWidth] = useState(width);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setBoxWidth(Math.round(e.contentRect.width)));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const w = boxWidth > 0 ? Math.min(boxWidth, width) : width;
  const mx = max ?? niceMax(Math.max(...values));
  const n = values.length;
  const step = n > 1 ? Math.max(labelEvery, Math.ceil(MIN_LABEL_GAP / ((w - PL - PR) / (n - 1)))) : 1;
  const x = (i: number) => PL + (w - PL - PR) * (n === 1 ? 0.5 : i / (n - 1));
  const y = (v: number) => PT + (height - PT - PB) * (1 - v / mx);
  const pts = values.map((v, i) => [x(i), y(v)] as const);
  const line = pts.map(([px, py], i) => `${i ? "L" : "M"}${px.toFixed(1)} ${py.toFixed(1)}`).join(" ");
  const area = `${line} L${x(n - 1).toFixed(1)} ${y(0)} L${x(0).toFixed(1)} ${y(0)} Z`;
  const ticks = [0, mx / 3, (mx * 2) / 3, mx];

  return (
    <svg ref={ref} viewBox={`0 0 ${w} ${height}`} role="img" aria-label={label} className="block h-auto w-full overflow-visible">
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={BLUE} stopOpacity=".18" />
          <stop offset="1" stopColor={BLUE} stopOpacity="0" />
        </linearGradient>
      </defs>
      {ticks.map((t) => (
        <g key={t}>
          <line x1={PL} x2={w - PR} y1={y(t)} y2={y(t)} stroke="#eef1f6" strokeWidth="1" />
          <text x={PL - 8} y={y(t) + 3.5} textAnchor="end" fontSize="10" fill={MUTED}>
            {Math.round(t)}
          </text>
        </g>
      ))}
      <path d={area} fill={`url(#${gid})`} />
      <path d={line} fill="none" stroke={BLUE} strokeWidth="2" strokeLinejoin="round" />
      {pts.map(([px, py], i) => {
        const lastPoint = i === n - 1;
        return (
          <circle key={i} cx={px} cy={py} r={lastPoint ? 4.5 : 3.2} fill={lastPoint ? BLUE : "#fff"} stroke={BLUE} strokeWidth="2">
            <title>{`${labels[i]}: ${values[i]}`}</title>
          </circle>
        );
      })}
      {labels.map((l, i) =>
        (i % step === 0 && n - 1 - i >= step / 2) || i === n - 1 ? (
          <text key={i} x={x(i)} y={height - 6} textAnchor="middle" fontSize="10" fill={MUTED}>
            {l}
          </text>
        ) : null,
      )}
    </svg>
  );
}
