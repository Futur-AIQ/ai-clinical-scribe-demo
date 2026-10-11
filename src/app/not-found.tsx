import type { Metadata } from "next";
import Link from "next/link";
import { Search } from "lucide-react";
import { EmptyState, buttonClass } from "@/components/ui";

export const metadata: Metadata = { title: "Page not found" };

export default function NotFound() {
  return (
    <main className="grid min-h-dvh place-items-center px-4">
      <EmptyState
        icon={Search}
        iconSize={28}
        action={
          <Link href="/dashboard" className={buttonClass("primary", "md")}>
            Back to Dashboard
          </Link>
        }
      >
        That page could not be found.
      </EmptyState>
    </main>
  );
}
