"use client";

import { useDemo } from "@/store/demo-store";

/** The current practice's name, for page copy such as "People in Healthy Life Clinic …". */
export function PracticeName() {
  return <>{useDemo((s) => s.practice.name)}</>;
}
