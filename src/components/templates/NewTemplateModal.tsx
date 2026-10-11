"use client";

import type { FormEvent } from "react";
import { Button, Field, Input, Modal, Textarea, toast } from "@/components/ui";
import { DOCTOR } from "@/data/misc";
import { useDemo } from "@/store/demo-store";

const FORM_ID = "new-template-form";
const DEFAULT_SECTIONS = ["Chief complaint", "History", "Examination", "Assessment", "Plan"].join("\n");

export function NewTemplateModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const addTemplate = useDemo((s) => s.addTemplate);

  // Native validation (a required name) runs before this fires.
  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const sections = String(f.get("sections") ?? "")
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);
    addTemplate({
      id: `t${Date.now()}`,
      name: String(f.get("name") ?? "").trim(),
      description: `Custom template created by ${DOCTOR.name}.`,
      tags: ["Custom"],
      sections,
      uses: 0,
      isDefault: false,
    });
    onClose();
    toast("Template created");
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="New Template"
      subtitle="Name the sections the AI should fill in, one per line"
      footer={
        <>
          <Button className="ml-auto" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" form={FORM_ID} variant="primary">
            Create Template
          </Button>
        </>
      }
    >
      <form id={FORM_ID} onSubmit={onSubmit} className="flex flex-col gap-3.5">
        <Field label="Template name" htmlFor="tpl-name">
          {/* Whitespace-only names are rejected by the pattern. */}
          <Input id="tpl-name" name="name" required pattern=".*\S.*" placeholder="Dermatology Visit" autoComplete="off" />
        </Field>
        <Field label="Sections" htmlFor="tpl-sections">
          <Textarea id="tpl-sections" name="sections" rows={5} defaultValue={DEFAULT_SECTIONS} />
        </Field>
      </form>
    </Modal>
  );
}
