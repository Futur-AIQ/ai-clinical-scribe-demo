import clsx from "clsx";
import { Section } from "@/components/notes/SoapSection";
import { Button, Modal } from "@/components/ui";
import type { Template } from "@/data/types";

interface TemplatePreviewModalProps {
  /** Open while set. */
  template: Template | null;
  onClose: () => void;
  onSetDefault: (id: string) => void;
}

/** The template's sections, numbered, as the AI will fill them. */
export function TemplatePreviewModal({ template: t, onClose, onSetDefault }: TemplatePreviewModalProps) {
  return (
    <Modal
      open={!!t}
      onClose={onClose}
      title={t?.name}
      subtitle={t?.description}
      footer={
        <>
          {t && !t.isDefault && (
            <Button className="ml-auto" onClick={() => onSetDefault(t.id)}>
              Set as default
            </Button>
          )}
          <Button variant="primary" className={clsx(t?.isDefault && "ml-auto")} onClick={onClose}>
            Done
          </Button>
        </>
      }
    >
      {t?.sections.map((s, i) => (
        <Section key={`${s}-${i}`} letter={i + 1} title={s}>
          <div className="py-2 text-[13.5px] leading-[1.7] text-faint">The AI writes this section from the conversation.</div>
        </Section>
      ))}
    </Modal>
  );
}
