"use client";

import { Mic, RotateCcw, Trash2, User } from "lucide-react";
import type { ReactNode } from "react";
import { Menu, MenuItem, MenuSeparator, type MenuTriggerProps, toast } from "@/components/ui";
import type { Patient } from "@/data/types";
import { useStartConsultation } from "@/lib/use-start-consultation";
import { useDemo } from "@/store/demo-store";

interface PatientMenuProps {
  patient: Patient;
  trigger: (props: MenuTriggerProps) => ReactNode;
}

/** View profile, Start consultation, then Archive or Restore. Used on the list rows and the record. */
export function PatientMenu({ patient: p, trigger }: PatientMenuProps) {
  const archivePatients = useDemo((s) => s.archivePatients);
  const restorePatient = useDemo((s) => s.restorePatient);
  const startFor = useStartConsultation();
  const archived = p.status === "Archived";

  const onArchive = () => {
    if (archived) restorePatient(p.mrn);
    else archivePatients([p.mrn]);
    toast(`${p.name} ${archived ? "restored" : "archived"}`);
  };

  return (
    <Menu aria-label={`Actions for ${p.name}`} trigger={trigger}>
      <MenuItem icon={User} href={`/patients/${p.mrn}`}>
        View profile
      </MenuItem>
      <MenuItem icon={Mic} onSelect={() => startFor(p.mrn)}>
        Start consultation
      </MenuItem>
      <MenuSeparator />
      <MenuItem icon={archived ? RotateCcw : Trash2} danger={!archived} onSelect={onArchive}>
        {archived ? "Restore patient" : "Archive patient"}
      </MenuItem>
    </Menu>
  );
}
