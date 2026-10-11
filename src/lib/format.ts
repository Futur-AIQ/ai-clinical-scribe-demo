export { fmtDate, fmtDateShort, fmtDuration, fmtMonthYear, fmtTime, fmtTimeSec, relDay } from "@/data/dates";

/** 1248 -> "1,248" */
export const fmtNumber = (n: number) => n.toLocaleString("en-US");
