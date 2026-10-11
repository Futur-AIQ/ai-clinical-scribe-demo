import { useEffect } from "react";
import { useDemo } from "@/store/demo-store";
import { useRecording } from "@/store/recording-store";

const TICK_MS = 100;

/**
 * The recording ticker: every 100ms while recording, playback advances by 0.1 s × speed.
 * Mounted once in AppShell, so the session survives page navigation. Stops when paused or idle.
 */
export function useRecordingEngine() {
  const recording = useRecording((s) => s.status === "recording");
  useEffect(() => {
    if (!recording) return;
    const id = window.setInterval(() => {
      useRecording.getState().tick((TICK_MS / 1000) * useDemo.getState().speed);
    }, TICK_MS);
    return () => window.clearInterval(id);
  }, [recording]);
}
