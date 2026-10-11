"use client";

import { Plus } from "lucide-react";
import { useState } from "react";
import { PageHead } from "@/components/layout/PageHead";
import { Button, toast } from "@/components/ui";
import { useDemo } from "@/store/demo-store";
import { NewTemplateModal } from "./NewTemplateModal";
import { TemplateCard } from "./TemplateCard";
import { TemplatePreviewModal } from "./TemplatePreviewModal";

export function TemplatesView() {
  const templates = useDemo((s) => s.templates);
  const setDefaultTemplate = useDemo((s) => s.setDefaultTemplate);
  const [previewId, setPreviewId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  const setDefault = (id: string) => {
    setDefaultTemplate(id);
    setPreviewId(null);
    toast("Default template updated");
  };

  return (
    <>
      <PageHead
        title="Templates"
        subtitle="Note formats the AI follows when it drafts a clinical note"
        actions={
          <Button variant="primary" icon={Plus} onClick={() => setCreating(true)}>
            New Template
          </Button>
        }
      />
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {templates.map((t) => (
          <TemplateCard key={t.id} template={t} onPreview={() => setPreviewId(t.id)} onSetDefault={() => setDefault(t.id)} />
        ))}
      </div>
      <TemplatePreviewModal
        template={templates.find((t) => t.id === previewId) ?? null}
        onClose={() => setPreviewId(null)}
        onSetDefault={setDefault}
      />
      <NewTemplateModal open={creating} onClose={() => setCreating(false)} />
    </>
  );
}
