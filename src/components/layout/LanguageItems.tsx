"use client";

import { Globe } from "lucide-react";
import { MenuHeading, MenuItem, toast } from "@/components/ui";
import { LANGUAGES } from "@/data/misc";
import { useDemo } from "@/store/demo-store";

/** "Transcription language" menu rows, shared by the top bar and the record card. */
export function LanguageItems() {
  const lang = useDemo((s) => s.language);
  const setLang = useDemo((s) => s.setLanguage);
  return (
    <>
      <MenuHeading>Transcription language</MenuHeading>
      {LANGUAGES.map((l) => (
        <MenuItem
          key={l}
          icon={Globe}
          checked={lang === l}
          onSelect={() => {
            setLang(l);
            toast(l.startsWith("English") ? `Language set to ${l}` : `Language set to ${l}. Sample scripts still play in English.`, "info");
          }}
        >
          {l}
        </MenuItem>
      ))}
    </>
  );
}
