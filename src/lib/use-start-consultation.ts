"use client";

import { useRouter } from "next/navigation";
import { caseForPatient } from "@/data/cases";
import { useRecording } from "@/store/recording-store";
import { toast } from "@/store/ui-store";

/**
 * Starts a consultation for one patient: their own case if they have one, otherwise the
 * general visit. Only one recording runs at a time, so a running one sends the user back to it.
 */
export function useStartConsultation() {
  const router = useRouter();
  return (mrn: string) => {
    const rec = useRecording.getState();
    if (rec.status !== "idle") {
      toast("Finish the current consultation first.", "warn");
    } else {
      rec.start(caseForPatient(mrn), mrn);
    }
    router.push("/consultation");
  };
}
