import type { Metadata } from "next";
import { DashboardView } from "@/components/dashboard/DashboardView";
import { PageHead } from "@/components/layout/PageHead";

export const metadata: Metadata = { title: "Dashboard" };

export default function DashboardPage() {
  return (
    <>
      <PageHead
        title={
          <>
            Welcome back, Dr. Sarah Johnson{" "}
            <span aria-hidden className="inline-block origin-[70%_70%] animate-wave">
              👋
            </span>
          </>
        }
        subtitle="Here's what's happening with your practice today."
      />
      <DashboardView />
    </>
  );
}
