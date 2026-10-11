"use client";

import clsx from "clsx";
import { useEffect, useRef } from "react";

export type RecordStatus = "idle" | "recording" | "paused";

interface WaveformProps {
  status: RecordStatus;
  /** A line is being "spoken" right now (recording only). */
  speaking?: boolean;
  className?: string;
}

interface Entry {
  canvas: HTMLCanvasElement;
  /** Read every frame, so prop changes need no re-registration. */
  state: { status: RecordStatus; speaking: boolean };
  level: number;
  t: number;
}

const BAR = 2.6;
const GAP = 3.4;

// One requestAnimationFrame loop drives every mounted waveform.
const entries = new Set<Entry>();
let raf = 0;
let last = 0;
let reducedMotion: MediaQueryList | null = null;

function targetLevel({ status, speaking }: Entry["state"]) {
  if (status === "recording") return speaking ? 1 : 0.3;
  return status === "paused" ? 0.05 : 0.55;
}

function draw(e: Entry) {
  const c = e.canvas;
  const dpr = window.devicePixelRatio || 1;
  const w = c.clientWidth;
  const h = c.clientHeight;
  if (!w) return;
  if (c.width !== Math.round(w * dpr) || c.height !== Math.round(h * dpr)) {
    c.width = Math.round(w * dpr);
    c.height = Math.round(h * dpr);
  }
  const ctx = c.getContext("2d");
  if (!ctx) return;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, w, h);
  const g = ctx.createLinearGradient(0, 0, w, 0);
  g.addColorStop(0, "#1a5cf4");
  g.addColorStop(0.5, "#2c78f5");
  g.addColorStop(0.78, "#1aa5c9");
  g.addColorStop(1, "#14b8a6");
  ctx.fillStyle = g;
  const n = Math.floor(w / (BAR + GAP));
  for (let i = 0; i < n; i++) {
    const k = i / n;
    const env = 0.25 + 0.75 * Math.pow(Math.abs(Math.sin(k * Math.PI * 2.6 + 0.6)), 0.7);
    const noise = (Math.sin(i * 1.73 + e.t * 0.0062) + Math.sin(i * 0.61 + e.t * 0.0107) + Math.sin(i * 2.9 - e.t * 0.0041)) / 3;
    let bh = Math.max(2.4, Math.abs(noise) * env * e.level * h * 0.98);
    if (i % 9 === 4) bh = Math.max(bh, h * 0.08 * e.level + 2);
    ctx.fillRect(i * (BAR + GAP), (h - bh) / 2, BAR, bh);
  }
}

function frame(ts: number) {
  const dt = Math.min(50, ts - last || 16);
  last = ts;
  const slow = reducedMotion?.matches ? 0.1 : 1;
  for (const e of entries) {
    e.level += (targetLevel(e.state) - e.level) * 0.07;
    e.t += dt * (e.state.status === "recording" ? 1 : 0.22) * slow;
    draw(e);
  }
  raf = entries.size ? requestAnimationFrame(frame) : 0;
}

/** Animated bars. Canvas, devicePixelRatio aware; 78px high by default. */
export function Waveform({ status, speaking = false, className }: WaveformProps) {
  const ref = useRef<HTMLCanvasElement>(null);
  const entryRef = useRef<Entry | null>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    reducedMotion ??= window.matchMedia("(prefers-reduced-motion: reduce)");
    const entry: Entry = { canvas, state: { status: "idle", speaking: false }, level: 0.5, t: 0 };
    entryRef.current = entry;
    entries.add(entry);
    if (!raf) {
      last = 0;
      raf = requestAnimationFrame(frame);
    }
    return () => {
      entries.delete(entry);
      entryRef.current = null;
      if (!entries.size && raf) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    };
  }, []);

  useEffect(() => {
    if (entryRef.current) entryRef.current.state = { status, speaking };
  }, [status, speaking]);

  return <canvas ref={ref} aria-hidden className={clsx("block h-[78px] w-full", className)} />;
}
