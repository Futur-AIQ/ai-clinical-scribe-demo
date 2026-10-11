import type { Metadata } from "next";
import { ConsultationView } from "@/components/consultation/ConsultationView";

export const metadata: Metadata = { title: "Consultation" };

export default function ConsultationPage() {
  return <ConsultationView />;
}
