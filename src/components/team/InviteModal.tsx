"use client";

import { Send } from "lucide-react";
import type { FormEvent } from "react";
import { PracticeName } from "@/components/layout/PracticeName";
import { Button, Field, Input, Modal, Select, toast } from "@/components/ui";
import { useDemo } from "@/store/demo-store";

const FORM_ID = "invite-form";
const ROLES = ["Physician", "Nurse Practitioner", "Medical Assistant", "Billing Specialist", "Admin"];

export function InviteModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const invite = useDemo((s) => s.invite);

  // Native validation (email format, required fields) runs before this fires.
  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const text = (k: string) => String(f.get(k) ?? "").trim();
    invite({ name: text("name"), email: text("email"), role: text("role"), area: "—", status: "Invited", notesThisMonth: 0 });
    onClose();
    toast("Invite created. In this demo no email is sent.", "info");
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Invite a team member"
      subtitle={
        <>
          They get an email with a link to join <PracticeName />
        </>
      }
      footer={
        <>
          <Button className="ml-auto" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" form={FORM_ID} variant="primary" icon={Send}>
            Send Invite
          </Button>
        </>
      }
    >
      <form id={FORM_ID} onSubmit={onSubmit} className="grid grid-cols-2 gap-x-4 gap-y-3.5 max-sm:grid-cols-1">
        <Field label="Email" htmlFor="inv-email" className="col-span-full">
          <Input id="inv-email" name="email" type="email" required placeholder="name@clinic.example" autoComplete="off" />
        </Field>
        <Field label="Name" htmlFor="inv-name">
          {/* Whitespace-only names are rejected by the pattern. */}
          <Input id="inv-name" name="name" required pattern=".*\S.*" autoComplete="off" />
        </Field>
        <Field label="Role" htmlFor="inv-role">
          <Select id="inv-role" name="role" defaultValue={ROLES[0]}>
            {ROLES.map((r) => (
              <option key={r}>{r}</option>
            ))}
          </Select>
        </Field>
      </form>
    </Modal>
  );
}
