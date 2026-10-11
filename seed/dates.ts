// Date helpers. All demo dates are computed from "now" so the app always looks current.
// IMPORTANT: call these on the client only (after mount). Server and client clocks differ,
// so computing them during server rendering causes hydration mismatches.

/**
 * A clinic time `dayOffset` days back. Before noon the "current clinic day" is yesterday,
 * so seeded morning visits never appear in the future.
 */
export function clinicDay(dayOffset: number, hour = 9, minute = 0, now = new Date()): Date {
  const base = now.getHours() < 12 ? 1 : 0;
  const d = new Date(now);
  d.setDate(d.getDate() - dayOffset - base);
  d.setHours(hour, minute, 0, 0);
  return d;
}

const MON = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
export const DOW = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const p2 = (n: number) => String(n).padStart(2, "0");

/** "Oct 11, 2026" */
export const fmtDate = (d: Date) => `${MON[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
/** "Oct 11" */
export const fmtDateShort = (d: Date) => `${MON[d.getMonth()]} ${d.getDate()}`;
/** "09:15 AM" (hour zero-padded, as in the screenshots) */
export const fmtTime = (d: Date) => {
  let h = d.getHours();
  const ap = h >= 12 ? "PM" : "AM";
  h = h % 12 || 12;
  return `${p2(h)}:${p2(d.getMinutes())} ${ap}`;
};
/** "10:30:15 AM" for transcript lines */
export const fmtTimeSec = (d: Date) => {
  let h = d.getHours();
  const ap = h >= 12 ? "PM" : "AM";
  h = h % 12 || 12;
  return `${p2(h)}:${p2(d.getMinutes())}:${p2(d.getSeconds())} ${ap}`;
};
/** seconds -> "02:43" */
export const fmtDuration = (s: number) => `${p2(Math.floor(s / 60))}:${p2(Math.floor(s % 60))}`;
/** "Today" / "Yesterday" / "Oct 9, 2026" */
export function relDay(d: Date, now = new Date()): string {
  if (d.toDateString() === now.toDateString()) return "Today";
  const y = new Date(now);
  y.setDate(y.getDate() - 1);
  return d.toDateString() === y.toDateString() ? "Yesterday" : fmtDate(d);
}
/** The last n days ending today, oldest first. */
export function lastNDays(n: number, now = new Date()): Date[] {
  const out: Date[] = [];
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    out.push(d);
  }
  return out;
}

/** Deterministic random generator (mulberry32), so generated data is identical on every load. */
export function rng(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
