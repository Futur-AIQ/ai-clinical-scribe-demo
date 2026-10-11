import { Eye, PanelsTopLeft } from "lucide-react";
import { Button, Card, Pill } from "@/components/ui";
import type { Template } from "@/data/types";

interface TemplateCardProps {
  template: Template;
  onPreview: () => void;
  onSetDefault: () => void;
}

/** Tile, name, uses, description, tags, then Preview and (unless it is the default) Set as default. */
export function TemplateCard({ template: t, onPreview, onSetDefault }: TemplateCardProps) {
  return (
    <Card className="flex flex-col gap-2.5 p-5">
      <div className="flex items-center gap-2.5">
        <span aria-hidden className="grid size-10 shrink-0 place-items-center rounded-[11px] bg-blue-50 text-blue">
          <PanelsTopLeft size={20} strokeWidth={1.8} />
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="text-[15px] font-semibold">{t.name}</h3>
          <span className="text-[12.5px] text-faint tabular-nums">Used {t.uses} times</span>
        </div>
        {t.isDefault && <Pill tone="blue">Default</Pill>}
      </div>
      <p className="text-[13px] leading-[1.55] text-muted">{t.description}</p>
      <div className="flex flex-wrap gap-1.5">
        {t.tags.map((g) => (
          <span key={g} className="rounded-md bg-gray-50 px-2 py-[3px] text-[11.5px] text-ink-2">
            {g}
          </span>
        ))}
      </div>
      <div className="mt-auto flex gap-2 pt-1.5">
        <Button size="sm" icon={Eye} onClick={onPreview}>
          Preview
        </Button>
        {!t.isDefault && (
          <Button size="sm" variant="ghost" onClick={onSetDefault}>
            Set as default
          </Button>
        )}
      </div>
    </Card>
  );
}
