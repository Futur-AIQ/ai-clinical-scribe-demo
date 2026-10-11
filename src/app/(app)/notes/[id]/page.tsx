"use client";

import { Search } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { NoteView } from "@/components/notes/NoteView";
import { buttonClass, EmptyState } from "@/components/ui";
import { useDemo } from "@/store/demo-store";

export default function NoteReviewPage() {
  const { id } = useParams<{ id: string }>();
  const note = useDemo((s) => s.noteById(id));
  const patient = useDemo((s) => (note ? s.patientByMrn(note.mrn) : undefined));

  if (!note || !patient) {
    return (
      <EmptyState
        icon={Search}
        iconSize={30}
        className="py-20"
        action={
          <Link href="/dashboard" className={buttonClass("secondary", "md")}>
            Back to Dashboard
          </Link>
        }
      >
        <b className="font-semibold text-ink">That note could not be found.</b>
      </EmptyState>
    );
  }
  return <NoteView key={note.id} note={note} patient={patient} />;
}
