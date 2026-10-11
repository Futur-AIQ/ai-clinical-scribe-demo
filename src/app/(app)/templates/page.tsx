import type { Metadata } from "next";
import { TemplatesView } from "@/components/templates/TemplatesView";

export const metadata: Metadata = { title: "Templates" };

export default function TemplatesPage() {
  return <TemplatesView />;
}
