"use client";

import clsx from "clsx";
import { type ReactNode, useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import type { Soap } from "@/data/types";
import { useDemo } from "@/store/demo-store";

const SAVE_MS = 500;

export const sectionText = "-mx-2.5 rounded-[9px] border border-transparent px-2.5 py-2 text-[13.5px] leading-[1.7] whitespace-pre-wrap text-ink-2";

interface SectionProps {
  letter: ReactNode;
  title: string;
  /** Letter tile colours. Blue by default. */
  tileClassName?: string;
  tag?: ReactNode;
  hint?: ReactNode;
  children: ReactNode;
}

/** One block of the note: a 26px letter tile, the section name and its text. */
export function Section({ letter, title, tileClassName = "bg-blue-50 text-blue", tag, hint, children }: SectionProps) {
  return (
    <div className="border-b border-line-2 py-4 last:border-b-0">
      <div className="mb-2 flex items-center gap-2.5">
        <span aria-hidden className={clsx("grid size-[26px] place-items-center rounded-[7px] text-[12.5px] font-bold", tileClassName)}>
          {letter}
        </span>
        <b className="text-[13.5px] font-semibold">{title}</b>
        {tag}
        {hint && <span className="ml-auto text-[12.5px] text-faint">{hint}</span>}
      </div>
      {children}
    </div>
  );
}

interface SoapSectionProps {
  noteId: string;
  k: keyof Soap;
  title: string;
  value: string;
  edited: boolean;
  editable: boolean;
}

/**
 * A SOAP section edited in place. The DOM owns the text while it has focus;
 * edits reach the store 500ms after the last keystroke, and on blur or unmount.
 */
export function SoapSection({ noteId, k, title, value, edited, editable }: SoapSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const pending = useRef<string | null>(null);
  const timer = useRef(0);
  const [typed, setTyped] = useState(false);

  const flush = useCallback(() => {
    window.clearTimeout(timer.current);
    if (pending.current === null) return;
    useDemo.getState().editSoap(noteId, k, pending.current);
    pending.current = null;
  }, [noteId, k]);

  // Write the stored text into the element, unless the user is typing in it.
  useLayoutEffect(() => {
    const el = ref.current;
    if (el && document.activeElement !== el && el.textContent !== value) el.textContent = value;
  }, [value]);

  useEffect(() => flush, [flush]);

  return (
    <Section
      letter={k.toUpperCase()}
      title={title}
      tag={(edited || typed) && <span className="rounded-md bg-amber-50 px-[7px] py-px text-[11px] font-medium text-[#b86600]">Edited</span>}
      hint={editable && "Click to edit"}
    >
      <div
        ref={ref}
        role="textbox"
        aria-multiline="true"
        aria-label={title}
        aria-readonly={!editable}
        contentEditable={editable ? "plaintext-only" : false}
        spellCheck={false}
        suppressContentEditableWarning
        className={clsx(
          sectionText,
          "outline-none focus-visible:outline-none",
          editable &&
            "hover:border-line hover:bg-surface-2 focus:border-[#9db6ff] focus:bg-white focus:shadow-[0_0_0_3px_rgba(26,92,244,.1)]",
        )}
        onInput={(e) => {
          pending.current = e.currentTarget.innerText;
          setTyped(true);
          window.clearTimeout(timer.current);
          timer.current = window.setTimeout(flush, SAVE_MS);
        }}
        onBlur={flush}
      />
    </Section>
  );
}
