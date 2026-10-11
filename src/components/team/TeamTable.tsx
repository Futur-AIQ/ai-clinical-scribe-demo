"use client";

import { Ellipsis, Pencil, Trash2 } from "lucide-react";
import { Avatar, IconButton, Menu, MenuItem, Pill, StatusPill, toast } from "@/components/ui";
import type { TeamMember } from "@/data/types";
import { useDemo } from "@/store/demo-store";

const TH = "border-b border-line bg-surface-2 px-4 py-2.5 text-left text-[12px] font-medium whitespace-nowrap text-ink-2";
const TD = "border-b border-line-2 px-4 py-3 align-middle whitespace-nowrap group-last:border-b-0";

export function TeamTable() {
  const team = useDemo((s) => s.team);
  return (
    // Relative so the sr-only header label stays inside the scroll box instead of widening the page.
    <div className="relative overflow-x-auto">
      <table className="w-full border-collapse text-[13px]">
        <thead>
          <tr>
            <th className={TH}>Member</th>
            <th className={TH}>Role</th>
            <th className={TH}>Specialty / Area</th>
            <th className={TH}>Notes This Month</th>
            <th className={TH}>Status</th>
            <th className={TH}>
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {team.map((m, i) => (
            <Row key={`${m.email}-${i}`} member={m} index={i} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Row({ member: m, index }: { member: TeamMember; index: number }) {
  const owner = m.role === "Owner";
  return (
    <tr className="group">
      <td className={TD}>
        <div className="flex items-center gap-3">
          <Avatar name={m.name} size={36} variant={owner ? "doctor" : "patient"} />
          <span>
            <b className="block text-[13px] font-medium">{m.name}</b>
            <small className="block text-[12px] text-muted">{m.email}</small>
          </span>
        </div>
      </td>
      <td className={TD}>{owner ? <Pill tone="blue">Owner</Pill> : m.role}</td>
      <td className={TD}>{m.area}</td>
      <td className={`${TD} tabular-nums`}>{m.notesThisMonth || "—"}</td>
      <td className={TD}>{m.status === "Invited" ? <Pill tone="amber">Invited</Pill> : <StatusPill status="Active" />}</td>
      <td className={`${TD} w-14 text-right`}>{!owner && <MemberMenu member={m} index={index} />}</td>
    </tr>
  );
}

function MemberMenu({ member: m, index }: { member: TeamMember; index: number }) {
  const removeMember = useDemo((s) => s.removeMember);
  return (
    <Menu
      aria-label={`Actions for ${m.name}`}
      trigger={(p) => <IconButton icon={Ellipsis} aria-label={`More actions for ${m.name}`} {...p} />}
    >
      <MenuItem icon={Pencil} onSelect={() => toast("Role editing opens here in the full app.", "info")}>
        Change role
      </MenuItem>
      <MenuItem
        icon={Trash2}
        danger
        onSelect={() => {
          removeMember(index);
          toast(`${m.name} removed`, "warn");
        }}
      >
        Remove from team
      </MenuItem>
    </Menu>
  );
}
