import { Suspense } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { ShellSkeleton } from "@/components/layout/ShellSkeleton";

// The shell reads the URL (active nav item, route params), which Cache Components
// only allows inside a Suspense boundary. The skeleton is the prerendered fallback.
export default function AppLayout({ children }: LayoutProps<"/">) {
  return (
    <Suspense fallback={<ShellSkeleton />}>
      <AppShell>{children}</AppShell>
    </Suspense>
  );
}
