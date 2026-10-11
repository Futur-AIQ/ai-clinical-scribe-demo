import type { Metadata } from "next";

export const metadata: Metadata = { title: "Patient Record" };

export default function PatientLayout({ children }: LayoutProps<"/patients/[mrn]">) {
  return children;
}
