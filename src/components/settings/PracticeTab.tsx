"use client";

import type { FormEvent } from "react";
import { Button, Card, Field, Input, Select, toast } from "@/components/ui";
import { PRACTICES } from "@/data/misc";
import { useDemo } from "@/store/demo-store";

const TIME_ZONES = ["Central Time (US & Canada)", "Eastern Time", "Pacific Time"];

/** Saving renames the practice everywhere (sidebar, page copy). The other fields only confirm, as in the prototype. */
export function PracticeTab() {
  const practice = useDemo((s) => s.practice);
  const setPractice = useDemo((s) => s.setPractice);
  const address = PRACTICES.find((p) => p.id === practice.id)?.address ?? PRACTICES[0].address;

  // Native validation (a non-blank name) runs before this fires.
  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const name = String(new FormData(e.currentTarget).get("name") ?? "").trim();
    setPractice({ ...practice, name });
    toast("Changes saved");
  };

  return (
    <Card className="px-5 py-[18px]">
      {/* Keyed so switching practice from the sidebar refills the form. */}
      <form key={practice.id} onSubmit={onSubmit} className="grid grid-cols-2 gap-x-4 gap-y-3.5 max-sm:grid-cols-1">
        <Field label="Practice name" htmlFor="pr-name">
          <Input id="pr-name" name="name" required pattern=".*\S.*" defaultValue={practice.name} autoComplete="off" />
        </Field>
        <Field label="Practice ID" htmlFor="pr-id">
          <Input id="pr-id" value={practice.id} readOnly />
        </Field>
        <Field label="Address" htmlFor="pr-address" className="col-span-full">
          <Input id="pr-address" defaultValue={address} autoComplete="off" />
        </Field>
        <Field label="Time zone" htmlFor="pr-tz">
          <Select id="pr-tz" defaultValue={TIME_ZONES[0]}>
            {TIME_ZONES.map((z) => (
              <option key={z}>{z}</option>
            ))}
          </Select>
        </Field>
        <Field label="Clinic hours" htmlFor="pr-hours">
          <Input id="pr-hours" defaultValue="Mon–Fri, 8:00 AM – 6:00 PM" autoComplete="off" />
        </Field>
        <div className="col-span-full flex justify-end">
          <Button type="submit" variant="primary">
            Save Changes
          </Button>
        </div>
      </form>
    </Card>
  );
}
