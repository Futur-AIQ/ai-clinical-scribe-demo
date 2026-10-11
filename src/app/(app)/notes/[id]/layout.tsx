import type { Metadata } from "next";

export const metadata: Metadata = { title: "Note Review" };

export default function NoteLayout({ children }: LayoutProps<"/notes/[id]">) {
  return children;
}
