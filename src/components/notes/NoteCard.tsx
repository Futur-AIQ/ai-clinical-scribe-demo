"use client";

import { AudioLines, ChevronRight, Copy, FileText, Pencil } from "lucide-react";
import { TranscriptRow } from "@/components/consultation/TranscriptCard";
import { Button, Card, CardHeader } from "@/components/ui";
import type { Note, Patient, Soap } from "@/data/types";
import { copyText, noteText } from "@/lib/note-text";
import { useDemo } from "@/store/demo-store";
import { Section, SoapSection, sectionText } from "./SoapSection";

const SECTIONS: [keyof Soap, string][] = [
  ["s", "Subjective"],
  ["o", "Objective"],
  ["a", "Assessment"],
  ["p", "Plan"],
];

interface NoteCardProps {
  note: Note;
  patient: Patient;
  editable: boolean;
  /** Shows "Amend" (Completed notes that are not being amended). */
  onAmend?: () => void;
}

/** The SOAP note: editable sections, clinician notes and the collapsible transcript. */
export function NoteCard({ note: n, patient, editable, onAmend }: NoteCardProps) {
  const format = useDemo((s) => s.settings.format);
  const redact = useDemo((s) => s.settings.redactExports);
  const transcript = n.transcript ?? [];
  const clinicianNotes = n.clinicianNotes ?? [];

  return (
    <Card>
      <CardHeader
        title={n.dx}
        subtitle={`· ${format} note`}
        icon={FileText}
        iconSize={19}
        actions={
          <>
            <Button size="sm" icon={Copy} onClick={() => void copyText(noteText(n, patient, redact))}>
              Copy note
            </Button>
            {onAmend && (
              <Button size="sm" icon={Pencil} onClick={onAmend}>
                Amend
              </Button>
            )}
          </>
        }
        className="flex-wrap"
      />
      <div className="px-[22px] pt-1.5 pb-[18px]">
        {SECTIONS.map(([k, title]) => (
          <SoapSection
            key={`${n.id}-${k}`}
            noteId={n.id}
            k={k}
            title={title}
            value={n.soap[k]}
            edited={n.edited?.includes(k) ?? false}
            editable={editable}
          />
        ))}
        {clinicianNotes.length > 0 && (
          <Section letter="+" title="Clinician Notes" tileClassName="bg-amber-50 text-[#b86600]">
            {clinicianNotes.map((text, i) => (
              <div key={i} className={sectionText}>
                {text}
              </div>
            ))}
          </Section>
        )}
      </div>
      {transcript.length > 0 && (
        <details className="group border-t border-line-2">
          <summary className="flex cursor-pointer list-none items-center gap-2.5 px-5 py-3.5 text-[14px] font-semibold [&::-webkit-details-marker]:hidden">
            <ChevronRight size={16} strokeWidth={1.8} aria-hidden className="text-muted transition-transform duration-200 group-open:rotate-90" />
            <AudioLines size={17} strokeWidth={1.8} aria-hidden className="text-blue" />
            Transcript
            <span className="text-[12.5px] font-normal text-faint">{transcript.length} segments</span>
          </summary>
          <div className="px-5 pb-1">
            {transcript.map((l, i) => (
              <TranscriptRow key={i} line={l} />
            ))}
          </div>
        </details>
      )}
    </Card>
  );
}
